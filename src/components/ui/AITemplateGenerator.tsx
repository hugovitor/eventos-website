import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Type, 
  Layout,
  Download,
  RefreshCw,
  Zap,
  Target,
  Eye
} from 'lucide-react';
import type { TemplateTheme } from '../../types/templates';

interface AITemplateRequest {
  eventType: 'birthday' | 'wedding' | 'corporate' | 'baby_shower' | 'graduation' | 'anniversary';
  style: 'modern' | 'classic' | 'elegant' | 'fun' | 'minimalist' | 'artistic';
  colorPreference: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'pastel' | 'custom';
  customColors?: string[];
  audience: 'family' | 'friends' | 'professional' | 'mixed';
  formality: 'casual' | 'semi-formal' | 'formal';
  specialRequests?: string;
}

const stylePrompts = {
  modern: {
    theme: 'Clean lines, minimal clutter, contemporary typography',
    colors: ['#2563eb', '#1e40af', '#3b82f6'],
    features: ['geometric shapes', 'sans-serif fonts', 'gradient backgrounds']
  },
  classic: {
    theme: 'Traditional elegance, timeless design, sophisticated layout',
    colors: ['#991b1b', '#dc2626', '#f59e0b'],
    features: ['serif fonts', 'ornamental borders', 'classic color schemes']
  },
  elegant: {
    theme: 'Sophisticated, refined, luxury aesthetic',
    colors: ['#059669', '#10b981', '#34d399'],
    features: ['gold accents', 'script fonts', 'marble textures']
  },
  fun: {
    theme: 'Playful, energetic, vibrant and engaging',
    colors: ['#7c3aed', '#8b5cf6', '#a78bfa'],
    features: ['bright colors', 'fun animations', 'casual typography']
  },
  minimalist: {
    theme: 'Simple, clean, focused on content',
    colors: ['#374151', '#4b5563', '#6b7280'],
    features: ['white space', 'simple typography', 'minimal elements']
  },
  artistic: {
    theme: 'Creative, unique, expressive design',
    colors: ['#dc2626', '#f59e0b', '#10b981'],
    features: ['creative layouts', 'artistic elements', 'bold typography']
  }
};

interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: TemplateTheme) => void;
  className?: string;
}

export const AITemplateGenerator: React.FC<AITemplateGeneratorProps> = ({ 
  onTemplateGenerated, 
  className = '' 
}) => {
  const [request, setRequest] = useState<AITemplateRequest>({
    eventType: 'birthday',
    style: 'modern',
    colorPreference: 'vibrant',
    audience: 'family',
    formality: 'casual'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<TemplateTheme | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const generateAITemplate = async () => {
    setIsGenerating(true);
    
    // Simular processo de IA (em produção seria uma API real)
    setTimeout(() => {
      const template: TemplateTheme = {
        id: `ai-generated-${Date.now()}`,
        name: `Template ${request.style} para ${request.eventType}`,
        description: `Template gerado por IA com estilo ${request.style} para eventos de ${request.eventType}`,
        preview: '/template-preview.jpg',
        // Mapear eventType para category válida
        category: request.eventType === 'baby_shower' || 
                 request.eventType === 'graduation' || 
                 request.eventType === 'anniversary' ? 'party' : 
                 request.eventType as 'wedding' | 'birthday' | 'corporate',
        
        layout: {
          type: 'single-column',
          headerPosition: 'top',
          contentFlow: 'vertical',
          sidebarPosition: 'none',
          footerStyle: 'minimal'
        },

        design: {
          theme: request.style === 'fun' ? 'modern' : 
                request.style === 'classic' ? 'classic' : 
                request.style as 'modern' | 'classic' | 'artistic' | 'minimalist' | 'luxury' | 'rustic',
          colorScheme: {
            primary: stylePrompts[request.style].colors[0],
            secondary: stylePrompts[request.style].colors[1],
            accent: stylePrompts[request.style].colors[2],
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1e293b',
            muted: '#64748b'
          },
          typography: {
            headingFont: request.style === 'classic' ? 'Playfair Display' : 'Inter',
            bodyFont: 'Inter',
            decorativeFont: request.style === 'elegant' ? 'Dancing Script' : 'Inter',
            sizes: {
              title: '3rem',
              subtitle: '1.5rem',
              body: '1rem',
              caption: '0.875rem'
            }
          }
        },

        components: {
          cards: {
            style: request.style === 'classic' ? 'outlined' : 'elevated',
            borderRadius: 'medium',
            spacing: 'normal'
          },
          buttons: {
            style: request.style === 'fun' ? 'gradient' : 'solid',
            size: 'medium',
            animation: 'hover'
          },
          navigation: {
            type: 'tabs',
            position: 'top'
          }
        },

        sections: {
          hero: { enabled: true, style: 'banner', height: 'medium' },
          about: { enabled: true, layout: 'text-only' },
          gallery: { enabled: request.eventType !== 'corporate', style: 'grid' },
          rsvp: { enabled: true, style: 'inline' },
          gifts: { enabled: request.eventType === 'wedding' || request.eventType === 'baby_shower', style: 'grid' },
          contact: { enabled: true, style: 'simple' }
        },

        effects: {
          pageTransitions: true,
          scrollAnimations: request.style === 'fun',
          hoverEffects: true,
          loadingAnimations: false,
          parallaxScrolling: false
        }
      };

      setGeneratedTemplate(template);
      setIsGenerating(false);
    }, 2000);
  };

  const applyTemplate = () => {
    if (generatedTemplate) {
      onTemplateGenerated(generatedTemplate);
    }
  };

  const regenerateTemplate = () => {
    setGeneratedTemplate(null);
    generateAITemplate();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gerador de Templates IA
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nossa IA cria templates personalizados baseados nas suas preferências e no tipo de evento
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Configurações do Evento
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={request.eventType}
                onChange={(e) => setRequest({
                  ...request, 
                  eventType: e.target.value as AITemplateRequest['eventType']
                })}
              >
                <option value="birthday">Aniversário</option>
                <option value="wedding">Casamento</option>
                <option value="corporate">Corporativo</option>
                <option value="baby_shower">Chá de Bebê</option>
                <option value="graduation">Formatura</option>
                <option value="anniversary">Aniversário de Casamento</option>
              </select>
            </div>

            {/* Estilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo Preferido
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={request.style}
                onChange={(e) => setRequest({
                  ...request, 
                  style: e.target.value as AITemplateRequest['style']
                })}
              >
                <option value="modern">Moderno</option>
                <option value="classic">Clássico</option>
                <option value="elegant">Elegante</option>
                <option value="fun">Divertido</option>
                <option value="minimalist">Minimalista</option>
                <option value="artistic">Artístico</option>
              </select>
            </div>

            {/* Preferência de Cores */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferência de Cores
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={request.colorPreference}
                onChange={(e) => setRequest({
                  ...request, 
                  colorPreference: e.target.value as AITemplateRequest['colorPreference']
                })}
              >
                <option value="warm">Cores Quentes</option>
                <option value="cool">Cores Frias</option>
                <option value="neutral">Cores Neutras</option>
                <option value="vibrant">Cores Vibrantes</option>
                <option value="pastel">Cores Pastel</option>
              </select>
            </div>

            {/* Público */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público Alvo
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={request.audience}
                onChange={(e) => setRequest({
                  ...request, 
                  audience: e.target.value as AITemplateRequest['audience']
                })}
              >
                <option value="family">Família</option>
                <option value="friends">Amigos</option>
                <option value="professional">Profissional</option>
                <option value="mixed">Misto</option>
              </select>
            </div>

            {/* Formalidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Formalidade
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={request.formality}
                onChange={(e) => setRequest({
                  ...request, 
                  formality: e.target.value as AITemplateRequest['formality']
                })}
              >
                <option value="casual">Casual</option>
                <option value="semi-formal">Semi-formal</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Próximo Passo
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Gerando seu Template
            </h3>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!isGenerating && !generatedTemplate && (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <p className="text-gray-600">
                  Clique no botão abaixo para gerar seu template personalizado
                </p>
                <Button 
                  onClick={generateAITemplate}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Gerar Template com IA
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <RefreshCw className="w-12 h-12 text-white animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Gerando seu template...</p>
                  <p className="text-gray-600">A IA está analisando suas preferências</p>
                </div>
              </div>
            )}

            {generatedTemplate && (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-green-600">Template Gerado!</h4>
                  <p className="text-gray-600">{generatedTemplate.name}</p>
                  <p className="text-sm text-gray-500">{generatedTemplate.description}</p>
                </div>
                <div className="flex space-x-4 justify-center">
                  <Button 
                    onClick={regenerateTemplate}
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Gerar Novo
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && generatedTemplate && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center">
              <Layout className="w-5 h-5 mr-2" />
              Pré-visualização do Template
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-8 min-h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center">
                  <Type className="w-16 h-16 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold">{generatedTemplate.name}</h4>
                <div className="flex space-x-2 justify-center">
                  {Object.values(generatedTemplate.design.colorScheme).slice(0, 3).map((color, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 max-w-md">
                  Este é uma pré-visualização do seu template personalizado gerado por IA
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentStep(2)}
                variant="outline"
              >
                Voltar
              </Button>
              <div className="flex space-x-4">
                <Button 
                  onClick={regenerateTemplate}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar Outro
                </Button>
                <Button 
                  onClick={applyTemplate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Usar Este Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};