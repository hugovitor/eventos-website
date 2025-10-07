import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Move, 
  Type, 
  Image as ImageIcon, 
  Calendar, 
  Users, 
  Save,
  Eye,
  Layers,
  Settings
} from 'lucide-react';

// Tipos de componentes disponíveis
export interface TemplateComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'info_card' | 'timeline' | 'gallery' | 'form' | 'spacer';
  label: string;
  icon: React.ReactNode;
  config: {
    content?: string;
    style?: {
      backgroundColor?: string;
      textColor?: string;
      fontSize?: string;
      padding?: string;
      margin?: string;
      borderRadius?: string;
      textAlign?: 'left' | 'center' | 'right';
    };
    props?: Record<string, unknown>;
  };
  order: number;
}

const availableComponents: Omit<TemplateComponent, 'id' | 'order'>[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    icon: <ImageIcon className="w-4 h-4" />,
    config: {
      content: 'Título do Evento',
      style: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        fontSize: '3xl',
        padding: '8',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'text',
    label: 'Texto',
    icon: <Type className="w-4 h-4" />,
    config: {
      content: 'Adicione seu texto aqui...',
      style: {
        fontSize: 'base',
        padding: '4',
        textAlign: 'left'
      }
    }
  },
  {
    type: 'info_card',
    label: 'Card de Informação',
    icon: <Calendar className="w-4 h-4" />,
    config: {
      content: 'Data: 31/12/2024',
      style: {
        backgroundColor: '#F3F4F6',
        padding: '4',
        borderRadius: 'lg',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'timeline',
    label: 'Timeline',
    icon: <Users className="w-4 h-4" />,
    config: {
      content: 'Programação do evento',
      style: {
        padding: '6'
      }
    }
  },
  {
    type: 'gallery',
    label: 'Galeria',
    icon: <ImageIcon className="w-4 h-4" />,
    config: {
      content: 'Galeria de fotos',
      style: {
        padding: '4'
      }
    }
  },
  {
    type: 'spacer',
    label: 'Espaçador',
    icon: <Move className="w-4 h-4" />,
    config: {
      style: {
        padding: '4'
      }
    }
  }
];

// Componente Drag Source
const DraggableComponent: React.FC<{
  component: Omit<TemplateComponent, 'id' | 'order'>;
  onAdd: (type: string) => void;
}> = ({ component, onAdd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { componentType: component.type },
    end: (_item, monitor) => {
      if (monitor.didDrop()) {
        onAdd(component.type);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={`p-3 border rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:border-blue-500 hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-2">
        {component.icon}
        <span className="text-sm font-medium">{component.label}</span>
      </div>
    </div>
  );
};

// Componente Drop Zone
const DropZone: React.FC<{
  onDrop: (componentType: string) => void;
  children: React.ReactNode;
}> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { componentType: string }) => {
      onDrop(item.componentType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`min-h-96 border-2 border-dashed rounded-lg transition-all ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {children}
    </div>
  );
};

// Componente editável individual
const EditableComponent: React.FC<{
  component: TemplateComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
  onDelete: (id: string) => void;
}> = ({ component, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(component.config.content || '');

  const renderComponent = () => {
    const style = {
      backgroundColor: component.config.style?.backgroundColor,
      color: component.config.style?.textColor,
      padding: `${component.config.style?.padding || 4} * 0.25rem`,
      margin: `${component.config.style?.margin || 0} * 0.25rem`,
      borderRadius: component.config.style?.borderRadius,
      textAlign: component.config.style?.textAlign as 'left' | 'center' | 'right' | undefined,
      fontSize: component.config.style?.fontSize
    };

    switch (component.type) {
      case 'hero':
        return (
          <div 
            className="py-16 px-8 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg"
            style={style}
          >
            <h1 className="text-4xl font-bold mb-4">{component.config.content}</h1>
            <p className="text-xl opacity-90">Subtítulo do evento</p>
          </div>
        );
      
      case 'text':
        return (
          <div className="prose max-w-none" style={style}>
            {isEditing ? (
              <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onBlur={() => {
                  onUpdate(component.id, {
                    config: { ...component.config, content: tempContent }
                  });
                  setIsEditing(false);
                }}
                className="w-full p-2 border rounded resize-none"
                rows={3}
                autoFocus
              />
            ) : (
              <p onDoubleClick={() => setIsEditing(true)}>
                {component.config.content}
              </p>
            )}
          </div>
        );
      
      case 'info_card':
        return (
          <div 
            className="p-6 rounded-lg border bg-gray-50 text-center"
            style={style}
          >
            <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Informação do Evento</h3>
            <p>{component.config.content}</p>
          </div>
        );
      
      case 'timeline':
        return (
          <div className="space-y-4" style={style}>
            <h3 className="text-xl font-bold mb-4">{component.config.content}</h3>
            {[
              { time: '20:00', event: 'Chegada dos convidados' },
              { time: '21:00', event: 'Início da festa' }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.time}
                </div>
                <span>{item.event}</span>
              </div>
            ))}
          </div>
        );
      
      case 'gallery':
        return (
          <div style={style}>
            <h3 className="text-xl font-bold mb-4">{component.config.content}</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'spacer':
        return (
          <div 
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500"
            style={{ height: '60px', ...style }}
          >
            Espaçador
          </div>
        );
      
      default:
        return <div>Componente desconhecido</div>;
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(component.id)}
    >
      {renderComponent()}
      
      {/* Controles de edição */}
      <div className={`absolute top-2 right-2 flex space-x-1 ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 bg-white border rounded shadow-sm hover:bg-gray-50"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="p-1 bg-white border rounded shadow-sm hover:bg-red-50 text-red-600"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Componente principal do Template Builder
export const TemplateBuilder: React.FC = () => {
  const [components, setComponents] = useState<TemplateComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('Meu Template Personalizado');
  const [previewMode, setPreviewMode] = useState(false);

  const addComponent = useCallback((type: string) => {
    const baseComponent = availableComponents.find(c => c.type === type);
    if (!baseComponent) return;

    const newComponent: TemplateComponent = {
      ...baseComponent,
      id: `${type}-${Date.now()}`,
      order: components.length
    };

    setComponents(prev => [...prev, newComponent]);
  }, [components.length]);

  const updateComponent = useCallback((id: string, updates: Partial<TemplateComponent>) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setSelectedComponent(null);
  }, []);

  const saveTemplate = () => {
    const templateData = {
      name: templateName,
      components: components,
      createdAt: new Date().toISOString()
    };
    
    // Salvar no localStorage por enquanto
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    savedTemplates.push(templateData);
    localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));
    
    alert('Template salvo com sucesso!');
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Template Builder</h1>
                <p className="text-gray-600">Crie templates personalizados arrastrando componentes</p>
              </div>
              <div className="flex items-center space-x-3">
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Nome do template"
                  className="w-64"
                />
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{previewMode ? 'Editar' : 'Preview'}</span>
                </Button>
                <Button
                  onClick={saveTemplate}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Template</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            
            {/* Sidebar de Componentes */}
            {!previewMode && (
              <div className="col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      Componentes
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableComponents.map((component, index) => (
                        <DraggableComponent
                          key={index}
                          component={component}
                          onAdd={addComponent}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Propriedades do componente selecionado */}
                {selectedComponentData && (
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Propriedades
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Conteúdo</label>
                          <Input
                            value={selectedComponentData.config.content || ''}
                            onChange={(e) => updateComponent(selectedComponentData.id, {
                              config: {
                                ...selectedComponentData.config,
                                content: e.target.value
                              }
                            })}
                            placeholder="Conteúdo do componente"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              value={selectedComponentData.config.style?.backgroundColor || '#ffffff'}
                              onChange={(e) => updateComponent(selectedComponentData.id, {
                                config: {
                                  ...selectedComponentData.config,
                                  style: {
                                    ...selectedComponentData.config.style,
                                    backgroundColor: e.target.value
                                  }
                                }
                              })}
                              className="w-12"
                            />
                            <Input
                              value={selectedComponentData.config.style?.backgroundColor || '#ffffff'}
                              onChange={(e) => updateComponent(selectedComponentData.id, {
                                config: {
                                  ...selectedComponentData.config,
                                  style: {
                                    ...selectedComponentData.config.style,
                                    backgroundColor: e.target.value
                                  }
                                }
                              })}
                              placeholder="#ffffff"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Cor do Texto</label>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              value={selectedComponentData.config.style?.textColor || '#000000'}
                              onChange={(e) => updateComponent(selectedComponentData.id, {
                                config: {
                                  ...selectedComponentData.config,
                                  style: {
                                    ...selectedComponentData.config.style,
                                    textColor: e.target.value
                                  }
                                }
                              })}
                              className="w-12"
                            />
                            <Input
                              value={selectedComponentData.config.style?.textColor || '#000000'}
                              onChange={(e) => updateComponent(selectedComponentData.id, {
                                config: {
                                  ...selectedComponentData.config,
                                  style: {
                                    ...selectedComponentData.config.style,
                                    textColor: e.target.value
                                  }
                                }
                              })}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Alinhamento</label>
                          <select
                            value={selectedComponentData.config.style?.textAlign || 'left'}
                            onChange={(e) => updateComponent(selectedComponentData.id, {
                              config: {
                                ...selectedComponentData.config,
                                style: {
                                  ...selectedComponentData.config.style,
                                  textAlign: e.target.value as 'left' | 'center' | 'right'
                                }
                              }
                            })}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value="left">Esquerda</option>
                            <option value="center">Centro</option>
                            <option value="right">Direita</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Área de Construção */}
            <div className={previewMode ? 'col-span-12' : 'col-span-9'}>
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">
                    {previewMode ? 'Preview do Template' : 'Área de Construção'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {previewMode 
              ? 'Visualize como seu template ficará para os usuários'
              : 'Arraste componentes da barra lateral para esta área'
            }
                  </p>
                </CardHeader>
                <CardContent>
                  {previewMode ? (
                    // Modo Preview
                    <div className="space-y-6">
                      {components.map((component) => (
                        <div key={component.id}>
                          <EditableComponent
                            component={component}
                            isSelected={false}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Modo Edição
                    <DropZone onDrop={addComponent}>
                      {components.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                          <Plus className="w-12 h-12 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Comece criando seu template</h3>
                          <p className="text-center">
                            Arraste componentes da barra lateral para esta área<br />
                            ou clique nos componentes para adicioná-los
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 p-4">
                          {components.map((component) => (
                            <EditableComponent
                              key={component.id}
                              component={component}
                              isSelected={selectedComponent === component.id}
                              onSelect={setSelectedComponent}
                              onUpdate={updateComponent}
                              onDelete={deleteComponent}
                            />
                          ))}
                        </div>
                      )}
                    </DropZone>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};