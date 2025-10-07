import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { TemplatePreview } from './TemplatePreview';
import type { TemplateTheme, CustomizationOptions } from '../../types/templates';
import { 
  Palette, 
  Type, 
  Layout, 
  RotateCcw,
  Save,
  Monitor,
  Smartphone,
  Eye,
  Maximize
} from 'lucide-react';

interface TemplateCustomizerProps {
  template: TemplateTheme;
  customization?: CustomizationOptions;
  onCustomizationChange: (options: CustomizationOptions) => void;
  onSave: () => void;
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  className?: string;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  customization = {},
  onCustomizationChange,
  onSave,
  eventData,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showFullPreview, setShowFullPreview] = useState(false);

  const updateColors = (newColors: Partial<typeof template.design.colorScheme>) => {
    const updated: CustomizationOptions = {
      templateId: customization.templateId || template.id,
      ...customization,
      designOverrides: {
        ...customization.designOverrides,
        colorScheme: {
          ...template.design.colorScheme,
          ...customization.designOverrides?.colorScheme,
          ...newColors
        }
      }
    };
    onCustomizationChange(updated);
  };

  const updateTypography = (newTypography: Partial<typeof template.design.typography>) => {
    const updated: CustomizationOptions = {
      templateId: customization.templateId || template.id,
      ...customization,
      designOverrides: {
        ...customization.designOverrides,
        typography: {
          ...template.design.typography,
          ...customization.designOverrides?.typography,
          ...newTypography
        }
      }
    };
    onCustomizationChange(updated);
  };

  const updateLayout = (newLayout: Partial<typeof template.layout>) => {
    const updated: CustomizationOptions = {
      templateId: customization.templateId || template.id,
      ...customization,
      layoutOverrides: {
        ...customization.layoutOverrides,
        ...newLayout
      }
    };
    onCustomizationChange(updated);
  };

  const resetToDefault = () => {
    onCustomizationChange({
      templateId: template.id
    });
  };

  const tabs = [
    { id: 'colors', label: 'Cores', icon: Palette },
    { id: 'fonts', label: 'Tipografia', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Moderno)' },
    { value: 'Roboto', label: 'Roboto (Clássico)' },
    { value: 'Poppins', label: 'Poppins (Amigável)' },
    { value: 'Montserrat', label: 'Montserrat (Elegante)' },
    { value: 'Playfair Display', label: 'Playfair Display (Luxo)' },
    { value: 'Merriweather', label: 'Merriweather (Leitura)' },
    { value: 'Oswald', label: 'Oswald (Impacto)' },
    { value: 'Dancing Script', label: 'Dancing Script (Script)' },
    { value: 'Great Vibes', label: 'Great Vibes (Elegante Script)' }
  ];

  const currentColors = {
    ...template.design.colorScheme,
    ...customization.designOverrides?.colorScheme
  };
  
  const currentFonts = {
    ...template.design.typography,
    ...customization.designOverrides?.typography
  };

  const currentLayout = {
    ...template.layout,
    ...customization.layoutOverrides
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Personalizar: {template.name}</h3>
              <p className="text-sm text-gray-600">
                Customize cores, fontes e layout do seu template
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="flex border rounded-lg">
                <Button
                  variant={previewMode === 'desktop' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="rounded-r-none"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="rounded-l-none"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resetar</span>
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                className="flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1">
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mb-6 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-4">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'colors' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Esquema de Cores</h4>
                    
                    {Object.entries(currentColors).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key === 'primary' ? 'Primária' :
                           key === 'secondary' ? 'Secundária' :
                           key === 'accent' ? 'Destaque' :
                           key === 'background' ? 'Fundo' :
                           key === 'surface' ? 'Superfície' :
                           key === 'text' ? 'Texto' : 'Suave'}
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => updateColors({
                              [key]: e.target.value
                            })}
                            className="w-12 h-12 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateColors({
                              [key]: e.target.value
                            })}
                            className="px-3 py-2 border border-gray-300 rounded text-sm font-mono flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'fonts' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Tipografia</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonte dos Títulos
                      </label>
                      <select
                        value={currentFonts.headingFont}
                        onChange={(e) => updateTypography({
                          headingFont: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonte do Corpo
                      </label>
                      <select
                        value={currentFonts.bodyFont}
                        onChange={(e) => updateTypography({
                          bodyFont: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonte Decorativa
                      </label>
                      <select
                        value={currentFonts.decorativeFont}
                        onChange={(e) => updateTypography({
                          decorativeFont: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'layout' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Configurações de Layout</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Layout
                      </label>
                      <select
                        value={currentLayout.type}
                        onChange={(e) => updateLayout({
                          type: e.target.value as typeof template.layout.type
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="single-column">Coluna Única</option>
                        <option value="two-column">Duas Colunas</option>
                        <option value="grid">Grid</option>
                        <option value="masonry">Masonry</option>
                        <option value="timeline">Timeline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posição do Header
                      </label>
                      <select
                        value={currentLayout.headerPosition}
                        onChange={(e) => updateLayout({
                          headerPosition: e.target.value as typeof template.layout.headerPosition
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="top">Topo</option>
                        <option value="center">Centro</option>
                        <option value="side">Lateral</option>
                        <option value="overlay">Sobreposto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posição da Sidebar
                      </label>
                      <select
                        value={currentLayout.sidebarPosition}
                        onChange={(e) => updateLayout({
                          sidebarPosition: e.target.value as typeof template.layout.sidebarPosition
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="none">Nenhuma</option>
                        <option value="left">Esquerda</option>
                        <option value="right">Direita</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Preview em Tempo Real</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowFullPreview(!showFullPreview)}
                    >
                      <Maximize className="w-4 h-4 mr-1" />
                      {showFullPreview ? 'Compacto' : 'Expandir'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview Completo
                    </Button>
                  </div>
                </div>
                
                {/* Live Preview Component */}
                <TemplatePreview
                  template={template}
                  customization={Object.keys(customization).length > 0 ? customization as CustomizationOptions : undefined}
                  eventData={eventData}
                  mode={previewMode}
                  showFullPage={showFullPreview}
                />
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>✨ Preview atualizado em tempo real conforme você edita</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};