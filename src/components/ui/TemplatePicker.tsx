import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { EnhancedTemplatePreview } from './EnhancedTemplatePreview';
import type { TemplateTheme } from '../../types/templates';
import { professionalTemplates } from '../../data/templates';
import { Palette, Eye, Check, Sparkles, Grid, Monitor, Smartphone } from 'lucide-react';

interface TemplatePickerProps {
  eventType: 'birthday' | 'wedding' | 'corporate' | 'party';
  selectedTemplate?: string;
  onTemplateSelect: (template: TemplateTheme) => void;
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  className?: string;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  eventType,
  selectedTemplate,
  onTemplateSelect,
  eventData,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'birthday' | 'wedding' | 'corporate' | 'party'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'preview'>('grid');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getFilteredTemplates = () => {
    if (activeCategory === 'all') {
      return professionalTemplates.filter(t => t.category === eventType || t.category === 'party');
    }
    return professionalTemplates.filter(t => t.category === activeCategory);
  };

  const filteredTemplates = getFilteredTemplates();

  const categories = [
    { id: 'all', label: 'Recomendados', count: professionalTemplates.filter(t => t.category === eventType || t.category === 'party').length },
    { id: eventType, label: getEventTypeLabel(eventType), count: professionalTemplates.filter(t => t.category === eventType).length },
    { id: 'party', label: '🎉 Festa', count: professionalTemplates.filter(t => t.category === 'party').length }
  ];

  function getEventTypeLabel(type: string) {
    switch(type) {
      case 'birthday': return '🎂 Aniversário';
      case 'wedding': return '💒 Casamento';
      case 'corporate': return '🏢 Corporativo';
      case 'party': return '🎉 Festa';
      default: return type;
    }
  }

  return (
    <div className={className}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
            Escolha um Template Profissional
          </h3>
          
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.id as 'all' | 'birthday' | 'wedding' | 'corporate' | 'party')}
                className="flex items-center space-x-1"
              >
                <span>{category.label}</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-l-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grade</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-2 rounded-r-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
              onClick={() => onTemplateSelect(template)}
            >
              <Card 
                className={selectedTemplate === template.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedTemplate === template.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                          setViewMode('preview');
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
              
              <CardContent>
                {/* Template Preview */}
                <div 
                  className="h-40 rounded-lg mb-3 relative overflow-hidden border"
                  style={{
                    background: `linear-gradient(135deg, ${template.design.colorScheme.primary} 0%, ${template.design.colorScheme.secondary} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                    <div className="space-y-1">
                      <div 
                        className="text-lg font-bold"
                        style={{ fontFamily: template.design.typography.headingFont }}
                      >
                        {template.name}
                      </div>
                      <div 
                        className="text-sm opacity-90"
                        style={{ fontFamily: template.design.typography.bodyFont }}
                      >
                        Layout: {template.layout.type}
                      </div>
                    </div>
                    
                    {/* Layout representation */}
                    <div className="space-y-1">
                      {template.layout.type === 'single-column' && (
                        <div className="space-y-1">
                          <div className="h-1 bg-white/50 rounded w-full"></div>
                          <div className="h-1 bg-white/30 rounded w-3/4"></div>
                        </div>
                      )}
                      {template.layout.type === 'two-column' && (
                        <div className="flex space-x-1">
                          <div className="h-4 bg-white/50 rounded flex-1"></div>
                          <div className="h-4 bg-white/30 rounded flex-1"></div>
                        </div>
                      )}
                      {template.layout.type === 'grid' && (
                        <div className="grid grid-cols-3 gap-1">
                          <div className="h-2 bg-white/50 rounded"></div>
                          <div className="h-2 bg-white/30 rounded"></div>
                          <div className="h-2 bg-white/50 rounded"></div>
                        </div>
                      )}
                      {template.layout.type === 'masonry' && (
                        <div className="flex space-x-1">
                          <div className="space-y-1 flex-1">
                            <div className="h-2 bg-white/50 rounded"></div>
                            <div className="h-1 bg-white/30 rounded"></div>
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="h-1 bg-white/30 rounded"></div>
                            <div className="h-2 bg-white/50 rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.design.colorScheme.primary }}
                        title="Cor Primária"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.design.colorScheme.secondary }}
                        title="Cor Secundária"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.design.colorScheme.accent }}
                        title="Cor de Destaque"
                      />
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                        }}
                        className="p-1"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        <Palette className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {template.design.theme}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {template.layout.type}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {template.components.cards.style}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div>📱 Seções: {Object.values(template.sections).filter(s => s.enabled).length} ativas</div>
                    <div>✨ Efeitos: {template.effects.scrollAnimations ? 'Animado' : 'Estático'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        </div>
      )}

      {/* Preview Mode */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          {/* Template Selector */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setPreviewTemplate(template.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  previewTemplate === template.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Preview Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Preview: {filteredTemplates.find(t => t.id === previewTemplate)?.name || filteredTemplates[0]?.name}
            </h3>
            <div className="flex items-center space-x-2">
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
              <Button
                onClick={() => {
                  const template = filteredTemplates.find(t => t.id === previewTemplate);
                  if (template) {
                    onTemplateSelect(template);
                  }
                }}
                disabled={!previewTemplate}
              >
                Selecionar Template
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          {previewTemplate && (
            <div className="border rounded-lg overflow-hidden">
              <EnhancedTemplatePreview
                template={filteredTemplates.find(t => t.id === previewTemplate)!}
                eventData={eventData}
                mode={previewMode}
                showFullPage={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-gray-600">
            Tente selecionar uma categoria diferente ou volte para "Todos"
          </p>
        </div>
      )}

      {/* Legacy Preview Modal for Backward Compatibility */}
      {previewTemplate && viewMode === 'grid' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Preview: {professionalTemplates.find(t => t.id === previewTemplate)?.name}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewTemplate(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h4 className="text-xl font-semibold mb-2">Preview Completo</h4>
                <p className="text-sm mb-4">
                  Use o modo "Preview" acima para ver o template completo em tempo real
                </p>
                <Button onClick={() => {
                  setViewMode('preview');
                  setPreviewTemplate(previewTemplate);
                }}>
                  Abrir Preview Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};