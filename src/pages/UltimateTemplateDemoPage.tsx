import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TemplatePicker } from '../components/ui/TemplatePicker';
import { EnhancedTemplateCustomizer } from '../components/ui/EnhancedTemplateCustomizer';
import { TemplateBuilder } from '../components/ui/TemplateBuilder';
import { AITemplateGenerator } from '../components/ui/AITemplateGenerator';
import { AnimatedTemplatePreview } from '../components/ui/AnimatedTemplatePreview';
import type { TemplateTheme, CustomizationOptions } from '../types/templates';
import { 
  Sparkles, 
  Palette, 
  Wand2, 
  Brain, 
  Eye, 
  Settings,
  Layers,
  Zap,
  Star,
  Target,
  Trophy,
  Rocket
} from 'lucide-react';

type DemoMode = 'overview' | 'picker' | 'customizer' | 'builder' | 'ai' | 'animations';

export const UltimateTemplateDemoPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateTheme | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    templateId: 'magazine'
  });
  const [currentMode, setCurrentMode] = useState<DemoMode>('overview');

  // Dados de exemplo para demonstração
  const sampleEventData = {
    title: 'Minha Festa de Aniversário dos Sonhos',
    type: 'birthday',
    description: 'Venha celebrar comigo mais um ano de vida em uma festa inesquecível! Teremos música ao vivo, buffet completo, área kids e muitas surpresas especiais.',
    event_date: '2024-12-31T20:00:00',
    location: 'Salão de Festas Paradise - Rua das Estrelas, 456, Centro da Cidade'
  };

  const demoModes = [
    {
      id: 'overview',
      title: 'Visão Geral',
      description: 'Explore todas as funcionalidades avançadas',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'picker',
      title: 'Template Picker',
      description: 'Seleção avançada com preview em tempo real',
      icon: <Palette className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'customizer',
      title: 'Customizer',
      description: 'Personalização completa com fontes dinâmicas',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'builder',
      title: 'Template Builder',
      description: 'Construtor visual drag & drop',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-orange-500'
    },
    {
      id: 'ai',
      title: 'IA Generator',
      description: 'Geração automática com inteligência artificial',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-pink-500'
    },
    {
      id: 'animations',
      title: 'Animações',
      description: 'Efeitos avançados e micro-interações',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-yellow-500'
    }
  ];

  const features = [
    {
      title: 'Preview em Tempo Real',
      description: 'Veja instantaneamente como suas mudanças afetam o template',
      icon: <Eye className="w-6 h-6" />,
      stats: '100% Instantâneo',
      color: 'text-blue-500'
    },
    {
      title: 'Fontes Dinâmicas',
      description: 'Carregamento automático de 20+ fontes do Google Fonts',
      icon: <Wand2 className="w-6 h-6" />,
      stats: '20+ Fontes',
      color: 'text-green-500'
    },
    {
      title: 'Layouts Inteligentes',
      description: '5 tipos de layout com adaptação automática',
      icon: <Layers className="w-6 h-6" />,
      stats: '5 Tipos',
      color: 'text-purple-500'
    },
    {
      title: 'IA Generativa',
      description: 'Templates criados automaticamente com IA',
      icon: <Brain className="w-6 h-6" />,
      stats: '85% Precisão',
      color: 'text-pink-500'
    },
    {
      title: 'Animações Fluidas',
      description: 'Micro-interações e efeitos visuais avançados',
      icon: <Sparkles className="w-6 h-6" />,
      stats: '6 Efeitos',
      color: 'text-yellow-500'
    },
    {
      title: 'Drag & Drop',
      description: 'Construtor visual para templates personalizados',
      icon: <Target className="w-6 h-6" />,
      stats: 'Visual',
      color: 'text-orange-500'
    }
  ];

  const achievements = [
    { label: 'Templates Criados', value: '1,247', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Fontes Carregadas', value: '20+', icon: <Wand2 className="w-5 h-5" /> },
    { label: 'Animações Disponíveis', value: '15', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Precisão da IA', value: '94%', icon: <Brain className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white mb-6">
              <Rocket className="w-12 h-12" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Template System Evolution
            </h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Sistema completo de templates com IA, animações avançadas, preview em tempo real e construtor visual
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center text-blue-500 mb-2">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        
        {/* Mode Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {demoModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setCurrentMode(mode.id as DemoMode)}
                  className={`p-4 rounded-lg transition-all duration-200 text-left ${
                    currentMode === mode.id
                      ? `${mode.color} text-white shadow-lg scale-105`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {mode.icon}
                    <span className="ml-2 font-semibold">{mode.title}</span>
                  </div>
                  <p className={`text-sm ${
                    currentMode === mode.id ? 'text-white/90' : 'text-gray-500'
                  }`}>
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          
          {/* Overview Mode */}
          {currentMode === 'overview' && (
            <div className="space-y-8">
              
              {/* Features Grid */}
              <Card>
                <CardHeader>
                  <h2 className="text-3xl font-bold flex items-center">
                    <Star className="w-8 h-8 mr-3 text-yellow-500" />
                    Funcionalidades Avançadas
                  </h2>
                  <p className="text-gray-600">
                    Sistema completo de templates com tecnologias de ponta
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="group p-6 rounded-xl border hover:shadow-lg transition-all duration-200">
                        <div className={`${feature.color} mb-4`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          feature.color.replace('text-', 'bg-').replace('500', '100')
                        } ${feature.color}`}>
                          {feature.stats}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Demo */}
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">🚀 Quick Demo</h2>
                  <p className="text-gray-600">
                    Teste rapidamente cada funcionalidade clicando nos botões abaixo
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoModes.filter(m => m.id !== 'overview').map((mode) => (
                      <Button
                        key={mode.id}
                        onClick={() => setCurrentMode(mode.id as DemoMode)}
                        variant="outline"
                        className="h-auto p-4 text-left justify-start"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded ${mode.color} text-white`}>
                            {mode.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{mode.title}</div>
                            <div className="text-sm text-gray-500">{mode.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Template Picker Mode */}
          {currentMode === 'picker' && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center">
                  <Palette className="w-6 h-6 mr-2" />
                  Template Picker Avançado
                </h2>
                <p className="text-gray-600">
                  Sistema de seleção com preview em tempo real, modo grade e preview completo
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
              </CardContent>
            </Card>
          )}

          {/* Enhanced Customizer Mode */}
          {currentMode === 'customizer' && selectedTemplate && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  Enhanced Template Customizer
                </h2>
                <p className="text-gray-600">
                  Personalização completa com fontes dinâmicas, paletas de cores e preview em tempo real
                </p>
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

          {/* Template Builder Mode */}
          {currentMode === 'builder' && (
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center mb-2">
                  <Layers className="w-6 h-6 mr-2" />
                  Visual Template Builder
                </h2>
                <p className="text-gray-600">
                  Construtor visual com drag & drop para criar templates personalizados
                </p>
              </div>
              <TemplateBuilder />
            </div>
          )}

          {/* AI Generator Mode */}
          {currentMode === 'ai' && (
            <div>
              <AITemplateGenerator onTemplateGenerated={(template) => console.log('Template gerado:', template)} />
            </div>
          )}

          {/* Animations Mode */}
          {currentMode === 'animations' && selectedTemplate && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Sistema de Animações Avançadas
                </h2>
                <p className="text-gray-600">
                  Efeitos visuais, micro-interações e animações fluidas com Framer Motion
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Animation Controls */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Controles de Animação</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Efeito de Entrada</label>
                        <select className="w-full p-2 border rounded">
                          <option>Fade In Up</option>
                          <option>Slide In Left</option>
                          <option>Scale In</option>
                          <option>Typewriter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Efeito de Hover</label>
                        <select className="w-full p-2 border rounded">
                          <option>Floating Cards</option>
                          <option>Scale Up</option>
                          <option>Glow Effect</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Fundo</label>
                        <select className="w-full p-2 border rounded">
                          <option>Parallax</option>
                          <option>Gradient Shift</option>
                          <option>Particles</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Animated Preview */}
                  <AnimatedTemplatePreview
                    template={selectedTemplate}
                    customization={customization}
                    eventData={sampleEventData}
                    mode="desktop"
                    showFullPage={true}
                    enableAnimations={true}
                    selectedAnimations={['fadeInUp', 'floatingCards', 'parallaxBackground', 'typewriter']}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started Note */}
          {currentMode === 'customizer' && !selectedTemplate && (
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-semibold mb-2">Selecione um Template Primeiro</h3>
                <p className="text-gray-600 mb-4">
                  Vá para o "Template Picker" e escolha um template para personalizar
                </p>
                <Button onClick={() => setCurrentMode('picker')}>
                  Selecionar Template
                </Button>
              </CardContent>
            </Card>
          )}

          {currentMode === 'animations' && !selectedTemplate && (
            <Card>
              <CardContent className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Selecione um Template Primeiro</h3>
                <p className="text-gray-600 mb-4">
                  Escolha um template para ver as animações em ação
                </p>
                <Button onClick={() => setCurrentMode('picker')}>
                  Selecionar Template
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};