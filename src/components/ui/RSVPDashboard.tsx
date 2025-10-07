import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { supabase, type Guest, type Event } from '../../lib/supabase';
import {
  Users,
  CheckCircle2,
  Clock,
  Download,
  Search,
  ChefHat,
  UserPlus,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  MapPin
} from 'lucide-react';

interface RSVPDashboardProps {
  event: Event;
  className?: string;
}

interface RSVPStats {
  total: number;
  confirmed: number;
  pending: number;
  plusOnes: number;
  ceremonyAttendees: number;
  receptionAttendees: number;
}

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({
  event,
  className = ''
}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<RSVPStats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    plusOnes: 0,
    ceremonyAttendees: 0,
    receptionAttendees: 0
  });

  const fetchGuests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
    } finally {
      setLoading(false);
    }
  }, [event.id]);

  const calculateStats = useCallback(() => {
    const confirmed = guests.filter(g => g.confirmed);
    const pending = guests.filter(g => !g.confirmed);
    const plusOnes = confirmed.filter(g => g.plus_one && g.plus_one_name).length;
    const ceremonyAttendees = confirmed.filter(g => g.will_attend_ceremony).length;
    const receptionAttendees = confirmed.filter(g => g.will_attend_reception).length;

    setStats({
      total: guests.length,
      confirmed: confirmed.length,
      pending: pending.length,
      plusOnes,
      ceremonyAttendees,
      receptionAttendees
    });
  }, [guests]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'confirmed' && guest.confirmed) ||
      (filter === 'pending' && !guest.confirmed);
    
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.plus_one_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportGuestList = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Confirmado', 'Acompanhante', 'Nome Acompanhante', 'Cerimônia', 'Recepção', 'Restrições', 'Data Confirmação'],
      ...guests.map(guest => [
        guest.name,
        guest.email || '',
        guest.phone_number || '',
        guest.confirmed ? 'Sim' : 'Não',
        guest.plus_one ? 'Sim' : 'Não',
        guest.plus_one_name || '',
        guest.will_attend_ceremony ? 'Sim' : 'Não',
        guest.will_attend_reception ? 'Sim' : 'Não',
        guest.dietary_restrictions || '',
        guest.confirmation_date ? new Date(guest.confirmation_date).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}_convidados.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendReminder = async (guestId: string) => {
    // TODO: Implementar envio de lembrete por email
    console.log('Enviando lembrete para:', guestId);
    alert('Funcionalidade de lembrete será implementada');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-gray-900">{stats.plusOnes}</div>
            <div className="text-sm text-gray-600">Acompanhantes</div>
          </CardContent>
        </Card>

        {event.ceremony_time && (
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.ceremonyAttendees}</div>
              <div className="text-sm text-gray-600">Cerimônia</div>
            </CardContent>
          </Card>
        )}

        {event.reception_time && (
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.receptionAttendees}</div>
              <div className="text-sm text-gray-600">Recepção</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-xl font-semibold">Lista de Convidados</h3>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Busca */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar convidados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
                />
              </div>

              {/* Filtro */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'confirmed' | 'pending')}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="confirmed">Confirmados</option>
                <option value="pending">Pendentes</option>
              </select>

              {/* Exportar */}
              <Button onClick={exportGuestList} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredGuests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum convidado encontrado' : 'Nenhum convidado ainda'}
              </h4>
              <p className="text-gray-500">
                {searchTerm ? 'Tente outros termos de busca' : 'Os convidados aparecerão aqui quando confirmarem presença'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGuests.map((guest) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{guest.name}</h4>
                        {guest.confirmed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                        {guest.plus_one && guest.plus_one_name && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            +1: {guest.plus_one_name}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {guest.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {guest.email}
                            </div>
                          )}
                          {guest.phone_number && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {guest.phone_number}
                            </div>
                          )}
                          {guest.confirmation_date && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Confirmado em {new Date(guest.confirmation_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          {guest.dietary_restrictions && (
                            <div className="flex items-center">
                              <ChefHat className="w-4 h-4 mr-2" />
                              {guest.dietary_restrictions}
                            </div>
                          )}
                          {guest.special_requests && (
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {guest.special_requests}
                            </div>
                          )}
                          
                          {/* Presença em eventos */}
                          <div className="flex items-center space-x-4">
                            {event.ceremony_time && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                guest.will_attend_ceremony 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                Cerimônia: {guest.will_attend_ceremony ? 'Sim' : 'Não'}
                              </span>
                            )}
                            {event.reception_time && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                guest.will_attend_reception 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                Recepção: {guest.will_attend_reception ? 'Sim' : 'Não'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!guest.confirmed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendReminder(guest.id)}
                        >
                          Lembrar
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo para catering */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Resumo para Catering</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Contagem de Pessoas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Confirmados (principais):</span>
                  <span className="font-medium">{stats.confirmed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Acompanhantes:</span>
                  <span className="font-medium">{stats.plusOnes}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total de pessoas:</span>
                  <span className="font-bold">{stats.confirmed + stats.plusOnes}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Restrições Alimentares</h4>
              <div className="space-y-1 text-sm">
                {guests
                  .filter(g => g.confirmed && (g.dietary_restrictions || g.plus_one_dietary_restrictions))
                  .map(guest => (
                    <div key={guest.id}>
                      {guest.dietary_restrictions && (
                        <div>• {guest.name}: {guest.dietary_restrictions}</div>
                      )}
                      {guest.plus_one_dietary_restrictions && guest.plus_one_name && (
                        <div>• {guest.plus_one_name}: {guest.plus_one_dietary_restrictions}</div>
                      )}
                    </div>
                  ))}
                {guests.filter(g => g.confirmed && (g.dietary_restrictions || g.plus_one_dietary_restrictions)).length === 0 && (
                  <p className="text-gray-500 italic">Nenhuma restrição alimentar reportada</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};