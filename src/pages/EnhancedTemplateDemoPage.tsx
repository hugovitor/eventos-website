import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TemplatePicker } from '../components/ui/TemplatePicker';
import { EnhancedTemplateCustomizer } from '../components/ui/EnhancedTemplateCustomizer';
import { EnhancedTemplatePreview } from '../components/ui/EnhancedTemplatePreview';
import type { TemplateTheme, CustomizationOptions } from '../types/templates';

export const EnhancedTemplateDemoPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateTheme | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    templateId: 'magazine'
  });
  const [currentStep, setCurrentStep] = useState<'select' | 'customize' | 'preview'>('select');

  // Dados de exemplo para demonstração
  const sampleEventData = {
    title: 'Minha Festa de Aniversário Especial',
    type: 'birthday',
    description: 'Venha celebrar comigo mais um ano de vida! Será uma festa inesquecível com muita música, dança, comida deliciosa e momentos especiais para compartilharmos juntos.',
    event_date: '2024-12-31T20:00:00',
    location: 'Salão de Festas Paradise - Rua das Flores, 123, Centro'
  };

  const steps = [
    { id: 'select', label: 'Selecionar Template', description: 'Escolha um template profissional' },
    { id: 'customize', label: 'Personalizar', description: 'Customize cores, fontes e layout' },
    { id: 'preview', label: 'Preview Final', description: 'Veja como ficará seu evento' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Sistema de Templates Aprimorado
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Funcionalidades robustas com preview em tempo real e personalização avançada
          </p>
          
          {/* Steps Indicator */}
          <div className="flex justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step.id ? 'bg-white text-blue-600' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                <div className="text-left">
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Step 1: Template Selection */}
          {currentStep === 'select' && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">🎯 Selecione um Template</h2>
                <p className="text-gray-600">
                  Escolha entre nossos templates profissionais com preview em tempo real
                </p>
              </CardHeader>
              <CardContent>
                <TemplatePicker
                  eventType="birthday"
                  selectedTemplate={selectedTemplate?.id}
                  onTemplateSelect={(template) => {
                    setSelectedTemplate(template);
                    setCustomization({ templateId: template.id });
                  }}
                  eventData={sampleEventData}
                />
                
                {selectedTemplate && (
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setCurrentStep('customize')}>
                      Próximo: Personalizar →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Customization */}
          {currentStep === 'customize' && selectedTemplate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">🎨 Personalize seu Template</h2>
                    <p className="text-gray-600">
                      Ajuste cores, fontes e layout com preview em tempo real
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('select')}
                    >
                      ← Voltar
                    </Button>
                    <Button onClick={() => setCurrentStep('preview')}>
                      Ver Preview Final →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedTemplateCustomizer
                  template={selectedTemplate}
                  initialCustomization={customization}
                  eventData={sampleEventData}
                  onCustomizationChange={setCustomization}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Final Preview */}
          {currentStep === 'preview' && selectedTemplate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">👀 Preview Final</h2>
                    <p className="text-gray-600">
                      Visualize como sua página de evento ficará para os convidados
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('customize')}
                    >
                      ← Editar
                    </Button>
                    <Button>
                      🚀 Publicar Evento
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <EnhancedTemplatePreview
                    template={selectedTemplate}
                    customization={{
                      templateId: customization.templateId,
                      designOverrides: {
                        colorScheme: customization.designOverrides?.colorScheme,
                        typography: customization.designOverrides?.typography
                      }
                    }}
                    eventData={sampleEventData}
                    mode="desktop"
                    showFullPage={true}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">✨ Funcionalidades Implementadas</h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-2">🎨 Preview em Tempo Real</h3>
                  <p className="text-sm text-blue-700">
                    Veja instantaneamente como as mudanças afetam seu template
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold text-green-900 mb-2">🔤 Fontes Dinâmicas</h3>
                  <p className="text-sm text-green-700">
                    Carregamento automático de fontes do Google Fonts com aplicação em tempo real
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">🎭 Layouts Variados</h3>
                  <p className="text-sm text-purple-700">
                    5 tipos de layout: Single-column, Two-column, Grid, Masonry, Timeline
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-bold text-orange-900 mb-2">🎨 Paletas de Cores</h3>
                  <p className="text-sm text-orange-700">
                    Paletas predefinidas e personalização completa de cores
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">📱 Responsivo</h3>
                  <p className="text-sm text-red-700">
                    Preview em desktop e mobile com ajustes automáticos
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold text-yellow-900 mb-2">💾 Exportação</h3>
                  <p className="text-sm text-yellow-700">
                    Export de configurações e compartilhamento de previews
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">🔍 Debug Info</h3>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded text-sm">
                <div><strong>Template Selecionado:</strong> {selectedTemplate?.name || 'Nenhum'}</div>
                <div><strong>Step Atual:</strong> {currentStep}</div>
                <div><strong>Customizações:</strong></div>
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(customization, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};