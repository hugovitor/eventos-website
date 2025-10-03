import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

export const EditEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { addNotification, NotificationContainer } = useNotification();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    type: 'birthday' as 'birthday' | 'wedding',
    description: '',
    event_date: '',
    location: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    is_public: false
  });

  // Buscar dados do evento
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !user?.id) return;

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title,
            type: data.type,
            description: data.description || '',
            event_date: data.event_date,
            location: data.location || '',
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
            is_public: data.is_public
          });
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Evento não encontrado ou você não tem permissão para editá-lo.'
        });
        navigate('/dashboard');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, user?.id, navigate]); // addNotification intencionalmente omitido para evitar loop

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eventId) return;

    setLoading(true);
    
    try {
      console.log('Dados sendo enviados:', {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        is_public: formData.is_public
      });

      const { data, error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          type: formData.type,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          is_public: formData.is_public
        })
        .eq('id', eventId)
        .eq('user_id', user.id)
        .select();

      console.log('Resposta do Supabase:', { data, error });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Evento atualizado!',
        message: `O evento "${formData.title}" foi atualizado com sucesso.`
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar evento';
      
      addNotification({
        type: 'error',
        title: 'Erro ao atualizar evento',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                ← Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Editar Evento
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Editar Informações do Evento
              </h2>
              <p className="text-sm text-gray-600">
                Atualize as informações do seu evento personalizado.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Título do Evento *"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Aniversário da Maria, Casamento João & Ana"
                    required
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Evento *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="birthday">Aniversário</option>
                      <option value="wedding">Casamento</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Data do Evento *"
                    name="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Local do Evento"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Salão de Festas, Igreja São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição do Evento
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva seu evento, adicione detalhes especiais, horários, etc."
                  />
                </div>

                {/* Personalização de Cores */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personalização de Cores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cor Primária
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          name="primary_color"
                          value={formData.primary_color}
                          onChange={handleInputChange}
                          className="h-10 w-20 border border-gray-300 rounded-md"
                        />
                        <Input
                          name="primary_color"
                          value={formData.primary_color}
                          onChange={handleInputChange}
                          placeholder="#3B82F6"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cor Secundária
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          name="secondary_color"
                          value={formData.secondary_color}
                          onChange={handleInputChange}
                          className="h-10 w-20 border border-gray-300 rounded-md"
                        />
                        <Input
                          name="secondary_color"
                          value={formData.secondary_color}
                          onChange={handleInputChange}
                          placeholder="#1E40AF"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configurações de Visibilidade */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configurações de Visibilidade
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="is_public"
                        checked={formData.is_public}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Tornar evento público (permitir que pessoas vejam a página do evento)
                      </label>
                    </div>
                    
                    {/* Status atual */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      formData.is_public 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {formData.is_public ? '🌐 Público' : '🔒 Privado'}
                    </div>
                    
                    {formData.is_public && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-700">
                          ✅ Seu evento está público! Qualquer pessoa com o link pode visualizar a página do evento.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview das cores */}
                <div className="border rounded-lg p-4" style={{ backgroundColor: formData.primary_color + '10' }}>
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: formData.primary_color }}
                    />
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: formData.secondary_color }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: formData.primary_color }}>
                        Preview das Cores
                      </p>
                      <p className="text-sm" style={{ color: formData.secondary_color }}>
                        Assim ficarão as cores do seu evento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};