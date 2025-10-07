import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Type,
  Clock,
  HelpCircle,
  MapPin
} from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SectionContent {
  text?: string;
  events?: TimelineEvent[];
  questions?: FAQItem[];
  address?: string;
  instructions?: string;
  parking?: string;
}

interface EventSection {
  id: string;
  event_id: string;
  title: string;
  type: 'text' | 'timeline' | 'faq' | 'location';
  content: SectionContent;
  order_index: number;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DynamicSectionManagerProps {
  eventId: string;
  isPublicView?: boolean;
  className?: string;
}

export const DynamicSectionManager: React.FC<DynamicSectionManagerProps> = ({ 
  eventId, 
  isPublicView = false, 
  className = '' 
}) => {
  const [sections, setSections] = useState<EventSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('event_sections')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index', { ascending: true });

      if (error) {
        // Se a tabela não existir, usar seções vazias
        if (error.code === 'PGRST205') {
          console.log('Tabela event_sections não encontrada. Usando seções vazias.');
          setSections([]);
          return;
        }
        throw error;
      }
      setSections(data || []);
    } catch (error) {
      console.error('Erro ao buscar seções:', error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const addSection = async (type: string, title: string) => {
    try {
      const defaultContent = getDefaultContent(type);
      const maxOrder = Math.max(...sections.map(s => s.order_index), 0);
      
      // Simulação de criação de seção
      const newSection: EventSection = {
        id: crypto.randomUUID(),
        event_id: eventId,
        title,
        type: type as 'text' | 'timeline' | 'faq' | 'location',
        content: defaultContent,
        order_index: maxOrder + 1,
        visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Seção simulada criada:', newSection.title);
      setSections([...sections, newSection]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar seção:', error);
    }
  };

  const getDefaultContent = (type: string): SectionContent => {
    switch (type) {
      case 'text':
        return { text: 'Digite seu texto aqui...' };
      case 'timeline':
        return { 
          events: [
            { time: '15:00', title: 'Cerimônia', description: 'Início da cerimônia' }
          ]
        };
      case 'faq':
        return { 
          questions: [
            { question: 'Pergunta exemplo?', answer: 'Resposta exemplo.' }
          ]
        };
      case 'location':
        return { 
          address: 'Endereço do evento',
          instructions: 'Como chegar',
          parking: 'Informações sobre estacionamento'
        };
      default:
        return {};
    }
  };

  const toggleVisibility = async (sectionId: string, visible: boolean) => {
    try {
      console.log('Toggle visibility simulado para seção:', sectionId, 'visível:', visible);
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, visible } : s
      ));
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      console.log('Delete simulado para seção:', sectionId);
      setSections(sections.filter(s => s.id !== sectionId));
    } catch (error) {
      console.error('Erro ao deletar seção:', error);
    }
  };

  const renderSectionContent = (section: EventSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{section.content.text}</p>
          </div>
        );
      
      case 'timeline':
        return (
          <div className="space-y-4">
            {section.content.events?.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                  {event.time}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'faq':
        return (
          <div className="space-y-4">
            {section.content.questions?.map((item, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900 mb-1">{item.question}</h4>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            {section.content.address && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Endereço</h4>
                <p className="text-gray-600">{section.content.address}</p>
              </div>
            )}
            {section.content.instructions && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Como Chegar</h4>
                <p className="text-gray-600">{section.content.instructions}</p>
              </div>
            )}
            {section.content.parking && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estacionamento</h4>
                <p className="text-gray-600">{section.content.parking}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando seções...</div>;
  }

  const visibleSections = isPublicView 
    ? sections.filter(s => s.visible)
    : sections;

  return (
    <div className={`space-y-6 ${className}`}>
      {visibleSections.map((section) => (
        <div 
          key={section.id} 
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {section.title}
            </h3>
            
            {!isPublicView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(section.id, !section.visible)}
                  className="p-1 rounded text-gray-500 hover:text-gray-700"
                >
                  {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 rounded text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {renderSectionContent(section)}
        </div>
      ))}

      {!isPublicView && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Seção
          </button>
        </div>
      )}

      {/* Modal de Adicionar Seção */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Nova Seção</h3>
            
            <div className="space-y-3">
              {[
                { type: 'text', title: 'Texto Livre', icon: Type },
                { type: 'timeline', title: 'Cronograma', icon: Clock },
                { type: 'faq', title: 'Perguntas Frequentes', icon: HelpCircle },
                { type: 'location', title: 'Localização', icon: MapPin }
              ].map(({ type, title, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addSection(type, title)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{title}</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};