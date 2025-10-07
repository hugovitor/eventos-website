import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, type Event } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Plus, Calendar, Users, Gift, RefreshCw, Trash2, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

export const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { addNotification, NotificationContainer } = useNotification();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      console.log('Buscando eventos para usuário:', user?.id);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Eventos carregados:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const deleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o evento "${eventTitle}"? 
    
⚠️ ATENÇÃO: Esta ação irá remover PERMANENTEMENTE:
• O evento e todas suas configurações
• Todos os convidados confirmados
• Lista de presentes e reservas
• Fotos e arquivos enviados
• Mensagens e comentários
• Customizações de template

Esta ação NÃO PODE ser desfeita.`)) {
      return;
    }

    try {
      setLoading(true);

      // O PostgreSQL irá deletar automaticamente em cascata devido às foreign keys
      // mas vamos fazer a limpeza explícita para garantir e dar feedback ao usuário
      
      console.log(`Iniciando exclusão completa do evento ${eventId}...`);
      
      // 1. Deletar mensagens dos convidados (se existir tabela)
      const { error: messagesError } = await supabase
        .from('guest_messages')
        .delete()
        .eq('event_id', eventId);
      
      if (messagesError && messagesError.code !== 'PGRST116') { // PGRST116 = tabela não existe
        console.warn('Erro ao deletar mensagens:', messagesError);
      }

      // 2. Deletar reservas de presentes
      const { error: reservationsError } = await supabase
        .from('gift_reservations')
        .delete()
        .eq('event_id', eventId);
      
      if (reservationsError && reservationsError.code !== 'PGRST116') {
        console.warn('Erro ao deletar reservas:', reservationsError);
      }

      // 3. Deletar presentes
      const { error: giftsError } = await supabase
        .from('gifts')
        .delete()
        .eq('event_id', eventId);
      
      if (giftsError) {
        console.warn('Erro ao deletar presentes:', giftsError);
      }

      // 4. Deletar convidados
      const { error: guestsError } = await supabase
        .from('guests')
        .delete()
        .eq('event_id', eventId);
      
      if (guestsError) {
        console.warn('Erro ao deletar convidados:', guestsError);
      }

      // 5. Finalmente, deletar o evento (isso deve limpar o resto automaticamente)
      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user?.id); // Segurança: só pode deletar próprios eventos

      if (eventError) throw eventError;

      console.log(`Evento ${eventId} excluído completamente com sucesso!`);

      addNotification({
        type: 'success',
        title: 'Evento excluído completamente',
        message: `O evento "${eventTitle}" e todos os dados relacionados foram removidos permanentemente.`
      });

      // Atualizar a lista de eventos
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao excluir evento',
        message: 'Ocorreu um erro ao tentar excluir o evento. Tente novamente ou contate o suporte.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEventPublic = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_public: !currentStatus })
        .eq('id', eventId)
        .eq('user_id', user?.id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Status atualizado',
        message: `Evento ${!currentStatus ? 'publicado' : 'tornado privado'} com sucesso.`
      });

      // Atualizar a lista de eventos
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, is_public: !currentStatus }
            : event
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao atualizar status',
        message: 'Ocorreu um erro ao tentar atualizar o status do evento.'
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Removido fetchEvents da dependência para evitar loop

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Meus Eventos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setLoading(true);
                  fetchEvents();
                }}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <span className="text-sm text-gray-700">
                Olá, {user?.email}
              </span>
              <Button variant="ghost" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Eventos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {events.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Eventos Ativos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {events.filter(event => event.is_public).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Gift className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Próximos Eventos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {events.filter(event => new Date(event.event_date) > new Date()).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Seus Eventos</h2>
              <Button onClick={() => navigate('/events/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro evento personalizado
                </p>
                <Button onClick={() => navigate('/events/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {event.type === 'birthday' ? '🎂 Aniversário' : 
                           event.type === 'wedding' ? '💒 Casamento' :
                           event.type === 'corporate' ? '🏢 Corporativo' : '🎉 Festa'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.is_public 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.is_public ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        📅 {new Date(event.event_date).toLocaleDateString('pt-BR')}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-600">
                          📍 {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (event.is_public) {
                              navigate(`/event/${event.id}`);
                            } else {
                              addNotification({
                                type: 'warning',
                                title: 'Evento Privado',
                                message: 'Torne o evento público primeiro para ver a página.'
                              });
                            }
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={event.is_public ? "outline" : "primary"}
                          className="flex-1"
                          onClick={() => toggleEventPublic(event.id, event.is_public)}
                        >
                          {event.is_public ? 'Tornar Privado' : 'Publicar'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => deleteEvent(event.id, event.title)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};