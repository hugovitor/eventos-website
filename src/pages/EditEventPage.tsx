import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { TemplatePicker } from '../components/ui/TemplatePicker';
import { TemplateCustomizer } from '../components/ui/TemplateCustomizer';
import { PhotoGallery } from '../components/ui/PhotoGallery';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import type { TemplateTheme, CustomizationOptions } from '../types/templates';
import { professionalTemplates } from '../data/templates';

export const EditEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { addNotification, NotificationContainer } = useNotification();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'template' | 'customize' | 'photos'>('details');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateTheme | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    templateId: 'magazine'
  });
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'birthday' as 'birthday' | 'wedding' | 'corporate' | 'party',
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
          
          // Carregar template e customização se existirem
          const template = professionalTemplates.find(t => t.id === 'magazine'); // Usar template padrão
          if (template) {
            setSelectedTemplate(template);
          }
          
          setCustomization({ templateId: 'magazine' });
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
  }, [eventId, user?.id, navigate, addNotification]);

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
      // Primeiro, atualizar os campos básicos
      const basicUpdate = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        is_public: formData.is_public
      };

      const { error: basicError } = await supabase
        .from('events')
        .update(basicUpdate)
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (basicError) throw basicError;

      // Depois, tentar atualizar as informações de template
      try {
        const { error: templateError } = await supabase
          .from('events')
          .update({
            template_id: selectedTemplate?.id || customization.templateId,
            template_customization: customization
          })
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (templateError) {
          console.warn('Não foi possível salvar as configurações de template:', templateError.message);
        }
      } catch (templateUpdateError) {
        console.warn('Colunas de template não encontradas. Execute a migração do banco de dados.', templateUpdateError);
      }

      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Evento atualizado com sucesso.'
      });
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao atualizar o evento. Tente novamente.'
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
                Editar Evento: {formData.title}
              </h1>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setStep('details')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  step === 'details' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Detalhes
              </button>
              <button
                onClick={() => setStep('template')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  step === 'template' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎨 Template
              </button>
              {selectedTemplate && (
                <button
                  onClick={() => setStep('customize')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 'customize' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⚙️ Personalizar
                </button>
              )}
              <button
                onClick={() => setStep('photos')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  step === 'photos' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📷 Fotos
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Step 1: Event Details */}
          {step === 'details' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Informações do Evento
                </h2>
                <p className="text-sm text-gray-600">
                  Edite as informações básicas do seu evento.
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
                      placeholder="Ex: Aniversário da Maria"
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
                        <option value="birthday">🎂 Aniversário</option>
                        <option value="wedding">💒 Casamento</option>
                        <option value="corporate">🏢 Evento Corporativo</option>
                        <option value="party">🎉 Festa/Celebração</option>
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
                      placeholder="Ex: Salão de Festas"
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
                      placeholder="Descreva seu evento..."
                    />
                  </div>

                  {selectedTemplate && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Template Atual
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-16 h-16 rounded-lg"
                            style={{ 
                              background: `linear-gradient(135deg, ${selectedTemplate.design.colorScheme.primary}, ${selectedTemplate.design.colorScheme.secondary})`
                            }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{selectedTemplate.name}</h4>
                            <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStep('template')}
                          >
                            Alterar Template
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStep('customize')}
                          >
                            Personalizar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

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
          )}

          {step === 'template' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Alterar Template
                </h2>
                <p className="text-sm text-gray-600">
                  Escolha um novo template para seu evento.
                </p>
              </CardHeader>
              <CardContent>
                <TemplatePicker
                  selectedTemplate={selectedTemplate?.id}
                  onTemplateSelect={(template) => {
                    setSelectedTemplate(template);
                    setCustomization({ templateId: template.id });
                  }}
                  eventType={formData.type}
                />
                
                <div className="flex justify-between space-x-4 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('details')}
                  >
                    ← Voltar
                  </Button>
                  <Button 
                    onClick={() => setStep('customize')}
                    disabled={!selectedTemplate}
                  >
                    Personalizar →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'customize' && selectedTemplate && (
            <>
              <TemplateCustomizer
                template={selectedTemplate}
                customization={customization}
                onCustomizationChange={setCustomization}
                onSave={() => setStep('details')}
                className="mb-6"
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setStep('template')}
                >
                  ← Alterar Template
                </Button>
                <Button 
                  onClick={() => setStep('details')}
                >
                  Finalizar →
                </Button>
              </div>
            </>
          )}

          {/* Step 4: Photos */}
          {step === 'photos' && eventId && (
            <>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-gray-900">
                    Galeria de Fotos
                  </h2>
                  <p className="text-sm text-gray-600">
                    Adicione, edite ou remova fotos do seu evento.
                  </p>
                </CardHeader>
                <CardContent>
                  <PhotoGallery
                    eventId={eventId}
                    isPublic={false}
                    maxPhotos={12}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setStep('customize')}
                >
                  ← Personalizar
                </Button>
                <Button 
                  onClick={() => setStep('details')}
                >
                  Voltar aos Detalhes →
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <NotificationContainer />
    </div>
  );
};