import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { FontLoader } from './FontLoader';
import { EnhancedTemplatePreview } from './EnhancedTemplatePreview';
import { PhotoGallery } from './PhotoGallery';
import type { TemplateTheme, CustomizationOptions, EventPhoto } from '../../types/templates';
import { 
  Palette, 
  Type, 
  Layout, 
  Sliders, 
  Eye, 
  EyeOff, 
  Monitor, 
  Smartphone,
  RefreshCw,
  Download,
  Share2,
  Camera
} from 'lucide-react';

interface EnhancedTemplateCustomizerProps {
  template: TemplateTheme;
  initialCustomization?: CustomizationOptions;
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  onCustomizationChange: (customization: CustomizationOptions) => void;
  className?: string;
}

export const EnhancedTemplateCustomizer: React.FC<EnhancedTemplateCustomizerProps> = ({
  template,
  initialCustomization = { templateId: template.id },
  eventData,
  onCustomizationChange,
  className = ''
}) => {
  const [customization, setCustomization] = useState<CustomizationOptions>(initialCustomization);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'effects' | 'photos'>('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>(initialCustomization.photos || []);

  // Fontes disponíveis do Google Fonts
  const availableFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito',
    'Raleway',
    'Ubuntu',
    'Playfair Display',
    'Merriweather',
    'Lora',
    'Crimson Text',
    'Libre Baskerville',
    'Dancing Script',
    'Pacifico',
    'Lobster',
    'Great Vibes',
    'Satisfy'
  ];

  // Paletas de cores predefinidas
  const colorPalettes = [
    {
      name: 'Azul Oceano',
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa'
    },
    {
      name: 'Rosa Romântico',
      primary: '#be185d',
      secondary: '#ec4899',
      accent: '#f472b6'
    },
    {
      name: 'Verde Natureza',
      primary: '#166534',
      secondary: '#22c55e',
      accent: '#4ade80'
    },
    {
      name: 'Roxo Elegante',
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc'
    },
    {
      name: 'Laranja Vibrante',
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c'
    },
    {
      name: 'Vermelho Paixão',
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f87171'
    }
  ];

  useEffect(() => {
    onCustomizationChange(customization);
  }, [customization, onCustomizationChange]);

  const updateCustomization = (updates: Partial<CustomizationOptions>) => {
    setCustomization(prev => ({
      ...prev,
      ...updates,
      designOverrides: {
        ...prev.designOverrides,
        ...updates.designOverrides
      }
    }));
  };

  const updateColors = (colorUpdates: any) => {
    updateCustomization({
      designOverrides: {
        ...customization.designOverrides,
        colorScheme: {
          ...customization.designOverrides?.colorScheme,
          ...colorUpdates
        }
      }
    });
  };

  const updateTypography = (typographyUpdates: any) => {
    updateCustomization({
      designOverrides: {
        ...customization.designOverrides,
        typography: {
          ...customization.designOverrides?.typography,
          ...typographyUpdates
        }
      }
    });
  };

  const updatePhotos = (photos: EventPhoto[]) => {
    setEventPhotos(photos);
    const updated = {
      ...customization,
      photos
    };
    setCustomization(updated);
    onCustomizationChange(updated);
  };

  const resetToDefaults = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCustomization({ templateId: template.id });
      setIsLoading(false);
    }, 500);
  };

  const exportConfiguration = () => {
    const config = JSON.stringify(customization, null, 2);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}-customization.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentColors = {
    primary: customization.designOverrides?.colorScheme?.primary || template.design.colorScheme.primary,
    secondary: customization.designOverrides?.colorScheme?.secondary || template.design.colorScheme.secondary,
    accent: customization.designOverrides?.colorScheme?.accent || template.design.colorScheme.accent,
    background: customization.designOverrides?.colorScheme?.background || template.design.colorScheme.background,
    text: customization.designOverrides?.colorScheme?.text || template.design.colorScheme.text
  };

  const currentTypography = {
    headingFont: customization.designOverrides?.typography?.headingFont || template.design.typography.headingFont,
    bodyFont: customization.designOverrides?.typography?.bodyFont || template.design.typography.bodyFont
  };

  return (
    <FontLoader fonts={[currentTypography.headingFont, currentTypography.bodyFont]}>
      <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
        {/* Controls Panel */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sliders className="w-5 h-5 mr-2" />
                  Personalizar Template
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToDefaults}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Template: <strong>{template.name}</strong>
              </p>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Card>
            <CardContent className="p-0">
              <div className="flex border-b">
                {[
                  { id: 'colors', label: 'Cores', icon: Palette },
                  { id: 'typography', label: 'Tipografia', icon: Type },
                  { id: 'layout', label: 'Layout', icon: Layout },
                  { id: 'effects', label: 'Efeitos', icon: Sliders },
                  { id: 'photos', label: 'Fotos', icon: Camera }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'colors' | 'typography' | 'layout' | 'effects' | 'photos')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Paletas Predefinidas</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {colorPalettes.map(palette => (
                          <button
                            key={palette.name}
                            onClick={() => updateColors(palette)}
                            className="p-3 rounded-lg border hover:border-gray-300 transition-colors"
                          >
                            <div className="flex space-x-1 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.primary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.secondary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.accent }}
                              />
                            </div>
                            <div className="text-xs font-medium">{palette.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Cores Personalizadas</h4>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor Primária</label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={currentColors.primary}
                            onChange={(e) => updateColors({ primary: e.target.value })}
                            className="w-12 h-10"
                          />
                          <Input
                            type="text"
                            value={currentColors.primary}
                            onChange={(e) => updateColors({ primary: e.target.value })}
                            placeholder="#1e40af"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Cor Secundária</label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={currentColors.secondary}
                            onChange={(e) => updateColors({ secondary: e.target.value })}
                            className="w-12 h-10"
                          />
                          <Input
                            type="text"
                            value={currentColors.secondary}
                            onChange={(e) => updateColors({ secondary: e.target.value })}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Cor de Destaque</label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={currentColors.accent}
                            onChange={(e) => updateColors({ accent: e.target.value })}
                            className="w-12 h-10"
                          />
                          <Input
                            type="text"
                            value={currentColors.accent}
                            onChange={(e) => updateColors({ accent: e.target.value })}
                            placeholder="#60a5fa"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Typography Tab */}
                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fonte dos Títulos</label>
                      <select
                        value={currentTypography.headingFont}
                        onChange={(e) => updateTypography({ headingFont: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        {availableFonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                      <div 
                        className="mt-2 p-3 bg-gray-50 rounded text-lg font-semibold"
                        style={{ fontFamily: currentTypography.headingFont }}
                      >
                        Preview do Título
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Fonte do Texto</label>
                      <select
                        value={currentTypography.bodyFont}
                        onChange={(e) => updateTypography({ bodyFont: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        {availableFonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                      <div 
                        className="mt-2 p-3 bg-gray-50 rounded"
                        style={{ fontFamily: currentTypography.bodyFont }}
                      >
                        Preview do texto normal. Este é um exemplo de como o texto ficará no seu evento.
                      </div>
                    </div>
                  </div>
                )}

                {/* Layout Tab */}
                {activeTab === 'layout' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Tipo de Layout</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {['single-column', 'two-column', 'grid'].map((layoutType) => (
                          <button
                            key={layoutType}
                            className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                              customization.layoutOverrides?.type === layoutType
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              const updated = {
                                ...customization,
                                layoutOverrides: {
                                  ...customization.layoutOverrides,
                                  type: layoutType as 'single-column' | 'two-column' | 'grid'
                                }
                              };
                              setCustomization(updated);
                              onCustomizationChange(updated);
                            }}
                          >
                            {layoutType === 'single-column' && 'Coluna Única'}
                            {layoutType === 'two-column' && 'Duas Colunas'}
                            {layoutType === 'grid' && 'Grade'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div className="space-y-6">
                    <PhotoGallery
                      eventId={eventData?.title || 'evento'}
                      photos={eventPhotos}
                      onPhotosChange={updatePhotos}
                      maxPhotos={8}
                    />
                  </div>
                )}

                {/* Effects Tab */}
                {activeTab === 'effects' && (
                  <div className="space-y-6">
                    <div className="text-center py-8 text-gray-500">
                      <Sliders className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <h4 className="font-medium">Efeitos Avançados</h4>
                      <p className="text-sm mt-2">
                        Animações e efeitos especiais estarão disponíveis em breve
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={exportConfiguration}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Configuração</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar Preview</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Preview em Tempo Real</h3>
                  <div className="flex border rounded-lg">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`px-3 py-2 rounded-l-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                        previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-3 py-2 rounded-r-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                        previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedTemplatePreview
                  template={template}
                  customization={{
                    templateId: customization.templateId,
                    designOverrides: customization.designOverrides,
                    layoutOverrides: {
                      spacing: 'normal',
                      borderRadius: 'medium'
                    }
                  }}
                  eventData={eventData}
                  mode={previewMode}
                  showFullPage={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </FontLoader>
  );
};