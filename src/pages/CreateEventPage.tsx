import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

export const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification, NotificationContainer } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'birthday' as 'birthday' | 'wedding',
    description: '',
    event_date: '',
    location: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...formData,
            user_id: user.id,
            is_public: false // Começa como privado
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('Evento criado com sucesso:', data);
      
      // Mostrar notificação de sucesso
      addNotification({
        type: 'success',
        title: 'Evento criado!',
        message: `O evento "${data.title}" foi criado com sucesso.`
      });
      
      // Redirecionar para o dashboard após um breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar evento';
      
      addNotification({
        type: 'error',
        title: 'Erro ao criar evento',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

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
                Criar Novo Evento
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
                Informações Básicas do Evento
              </h2>
              <p className="text-sm text-gray-600">
                Preencha as informações básicas para criar seu evento personalizado.
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
                    {loading ? 'Criando...' : 'Criar Evento'}
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