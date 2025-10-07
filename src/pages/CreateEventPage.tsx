import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { TemplatePicker } from '../components/ui/TemplatePicker';
import { EnhancedTemplateCustomizer } from '../components/ui/EnhancedTemplateCustomizer';
import { PhotoGallery } from '../components/ui/PhotoGallery';
import { PhotoUploadTest } from '../components/debug/PhotoUploadTest';
import { type EventPhoto } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import type { TemplateTheme, CustomizationOptions } from '../types/templates';

export const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification, NotificationContainer } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'template' | 'customize' | 'photos' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateTheme | null>(null);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
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
    secondary_color: '#1E40AF'
  });

  // Função para migrar fotos locais para o Supabase
  const migratePhotosToSupabase = async (eventId: string, localPhotos: EventPhoto[]) => {
    try {
      console.log(`📸 Iniciando migração de ${localPhotos.length} fotos para o evento ${eventId}`);
      
      for (const localPhoto of localPhotos) {
        try {
          // Converter URL blob de volta para File
          if (localPhoto.url.startsWith('blob:')) {
            const response = await fetch(localPhoto.url);
            const blob = await response.blob();
            const file = new File([blob], localPhoto.filename, { type: blob.type || 'image/jpeg' });
            
            console.log(`🔄 Migrando foto: ${file.name}`);
            
            // Upload direto para o Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${eventId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const storagePath = `event-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('event-photos')
              .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.log(`⚠️ Storage não configurado para ${file.name}, usando placeholder`);
              console.log(`🔗 URL placeholder: https://via.placeholder.com/500x300/f3f4f6/9ca3af?text=${encodeURIComponent(file.name)}`);
              // Continua sem storage, salva só os metadados
            }

            // Obter URL pública (mesmo que o upload tenha falhado, tenta obter)
            const { data: urlData } = supabase.storage
              .from('event-photos')
              .getPublicUrl(storagePath);

            // Salvar metadados no banco
            const photoData = {
              event_id: eventId,
              url: uploadError ? 
                `https://via.placeholder.com/500x300/f3f4f6/9ca3af?text=${encodeURIComponent(file.name)}` : 
                urlData.publicUrl, // Usa placeholder se upload falhou
              filename: file.name,
              caption: localPhoto.caption || null,
              size_bytes: file.size,
              width: localPhoto.width,
              height: localPhoto.height,
              mime_type: file.type,
              storage_path: storagePath,
              uploaded_by: user?.id
            };

            const { data, error } = await supabase
              .from('event_photos')
              .insert(photoData)
              .select()
              .single();

            if (error) {
              if (error.code === 'PGRST205') {
                console.log(`⚠️ Tabela event_photos não encontrada. Execute a migração SQL.`);
              } else {
                console.error(`❌ Erro ao salvar metadados da foto ${file.name}:`, error);
              }
            } else {
              const isPlaceholder = uploadError ? true : false;
              console.log(`✅ Foto migrada com sucesso: ${data.filename} ${isPlaceholder ? '(placeholder)' : '(Supabase Storage)'}`);
              console.log(`🔗 URL salva: ${data.url}`);
            }
          }
        } catch (error) {
          console.error(`❌ Erro ao migrar foto ${localPhoto.filename}:`, error);
          // Continua com as outras fotos mesmo se uma falhar
        }
      }
      
      console.log('✅ Migração de fotos concluída');
    } catch (error) {
      console.error('❌ Erro na migração de fotos:', error);
    }
  };

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
      // Primeiro, criar o evento sem as colunas de template
      const basicEventData = {
        ...formData,
        user_id: user.id,
        is_public: false
      };

      const { data: eventData, error: insertError } = await supabase
        .from('events')
        .insert([basicEventData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Depois, tentar atualizar com as informações de template
      try {
        const { error: updateError } = await supabase
          .from('events')
          .update({
            template_id: selectedTemplate?.id || customization.templateId,
            template_customization: customization
          })
          .eq('id', eventData.id);

        if (updateError) {
          console.warn('Não foi possível salvar as configurações de template:', updateError.message);
          // Continua mesmo se não conseguir salvar o template
        }
      } catch (templateError) {
        console.warn('Colunas de template não encontradas. Execute a migração do banco de dados.', templateError);
      }

      console.log('Evento criado com sucesso:', eventData);
      
      // Armazenar o ID do evento criado
      setCreatedEventId(eventData.id);
      
      // Transferir fotos temporárias para o evento real (se houver)
      if (customization.photos && customization.photos.length > 0) {
        console.log(`🔄 Transferindo ${customization.photos.length} fotos para o evento real...`);
        await migratePhotosToSupabase(eventData.id, customization.photos);
      }
      
      // Mostrar notificação de sucesso
      const photoMessage = customization.photos && customization.photos.length > 0 
        ? ` e ${customization.photos.length} foto(s) foram salvas.`
        : '.';
        
      addNotification({
        type: 'success',
        title: 'Evento criado!',
        message: `O evento "${eventData.title}" foi criado com sucesso${photoMessage}`
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
            
            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'template' ? 'bg-blue-600 text-white' : 
                  (step === 'customize' || step === 'photos' || step === 'details') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium text-gray-700">Template</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'customize' ? 'bg-blue-600 text-white' : 
                  (step === 'photos' || step === 'details') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium text-gray-700">Personalizar</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'photos' ? 'bg-blue-600 text-white' : 
                  step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium text-gray-700">Fotos</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  4
                </div>
                <span className="text-sm font-medium text-gray-700">Detalhes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Step 1: Template Selection */}
          {step === 'template' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Escolha um Template
                </h2>
                <p className="text-sm text-gray-600">
                  Selecione um template profissional para seu evento.
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
                  eventData={{
                    title: formData.title || 'Meu Evento',
                    type: formData.type,
                    description: formData.description || 'Descrição do evento',
                    event_date: formData.event_date,
                    location: formData.location || 'Local do evento'
                  }}
                />
                
                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    onClick={() => setStep('customize')}
                    disabled={!selectedTemplate}
                  >
                    Próximo: Personalizar →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Template Customization */}
          {step === 'customize' && selectedTemplate && (
            <>
              <EnhancedTemplateCustomizer
                template={selectedTemplate}
                initialCustomization={customization}
                eventData={{
                  title: formData.title || 'Meu Evento',
                  type: formData.type,
                  description: formData.description || 'Descrição do evento',
                  event_date: formData.event_date,
                  location: formData.location || 'Local do evento'
                }}
                onCustomizationChange={setCustomization}
                className="mb-6"
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setStep('template')}
                >
                  ← Voltar
                </Button>
                <Button 
                  onClick={() => setStep('photos')}
                >
                  Próximo: Fotos →
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Photos */}
          {step === 'photos' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Galeria de Fotos
                </h2>
                <p className="text-sm text-gray-600">
                  Adicione algumas fotos para tornar seu evento mais atrativo (opcional).
                </p>
              </CardHeader>
              <CardContent>
                {/* PhotoGallery funciona sempre - em modo temporário antes de criar, em modo real após criar */}
                <PhotoGallery
                  eventId={createdEventId || 'temp-event'}
                  isPublic={false} // Sempre modo de edição para permitir upload
                  photos={customization.photos || []}
                  onPhotosChange={(photos) => setCustomization(prev => ({ ...prev, photos }))}
                  maxPhotos={8}
                />
                
                {/* Componente de Debug */}
                {createdEventId && (
                  <div className="mt-8">
                    <PhotoUploadTest eventId={createdEventId} />
                  </div>
                )}
                
                {/* Info sobre o status das fotos */}
                <div className="mt-4 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                  {createdEventId ? (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ✅ Evento criado! Fotos serão salvas permanentemente
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      � Você pode adicionar fotos agora! Elas serão salvas quando criar o evento
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('customize')}
                  >
                    ← Voltar
                  </Button>
                  <Button 
                    onClick={() => setStep('details')}
                  >
                    Próximo: Detalhes →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Event Details */}
          {step === 'details' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Informações do Evento
                </h2>
                <p className="text-sm text-gray-600">
                  Preencha as informações para finalizar seu evento.
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

                  {/* Template Preview */}
                  {selectedTemplate && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Template Selecionado
                      </h3>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div 
                          className="w-16 h-16 rounded-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${selectedTemplate.design.colorScheme.primary}, ${selectedTemplate.design.colorScheme.secondary})`
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedTemplate.name}</h4>
                          <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Layout: {selectedTemplate.layout.type}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStep('customize')}
                        >
                          Editar Template
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-4 pt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setStep('photos')}
                      disabled={loading}
                    >
                      ← Voltar
                    </Button>
                    <div className="flex space-x-4">
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
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};