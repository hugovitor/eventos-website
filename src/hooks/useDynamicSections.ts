import { useState, useEffect, useCallback } from 'react';
import { supabase, type EventSection } from '../lib/supabase';

export interface DynamicSection {
  id: string;
  type: 'text' | 'list' | 'timeline' | 'gallery' | 'map' | 'countdown' | 'gift_list';
  title: string;
  content: string;
  isVisible: boolean;
  order: number;
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    alignment?: 'left' | 'center' | 'right';
    showBorder?: boolean;
    borderColor?: string;
    icon?: string;
    mapLocation?: string;
    countdownDate?: string;
    listItems?: string[];
    timelineEvents?: { date: string; title: string; description: string }[];
    giftItems?: { name: string; price: number; purchased: boolean; purchasedBy?: string }[];
  };
}

export const useDynamicSections = (eventId: string) => {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Converter EventSection para DynamicSection
  const convertEventSection = (eventSection: EventSection): DynamicSection => ({
    id: eventSection.id,
    type: eventSection.section_type === 'location_map' ? 'map' : 
          eventSection.section_type === 'faq' ? 'list' :
          eventSection.section_type === 'custom' ? 'text' :
          eventSection.section_type as DynamicSection['type'],
    title: eventSection.title,
    content: typeof eventSection.content === 'string' ? eventSection.content : 
             eventSection.content?.text as string || JSON.stringify(eventSection.content),
    isVisible: eventSection.is_visible,
    order: eventSection.position_order,
    settings: typeof eventSection.content === 'object' && eventSection.content?.settings ? 
              eventSection.content.settings as DynamicSection['settings'] : undefined
  });

  // Converter DynamicSection para EventSection
  const convertDynamicSection = (dynamicSection: Omit<DynamicSection, 'id'>): Omit<EventSection, 'id' | 'event_id' | 'created_at' | 'updated_at'> => ({
    section_type: dynamicSection.type === 'map' ? 'location_map' :
                  dynamicSection.type === 'list' ? 'faq' :
                  dynamicSection.type === 'gallery' ? 'custom' :
                  dynamicSection.type === 'countdown' ? 'custom' :
                  dynamicSection.type === 'gift_list' ? 'custom' :
                  dynamicSection.type,
    title: dynamicSection.title,
    content: { 
      text: dynamicSection.content,
      settings: dynamicSection.settings 
    },
    is_visible: dynamicSection.isVisible,
    position_order: dynamicSection.order
  });

  // Buscar seções do evento
  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('event_sections')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index', { ascending: true });

      if (error) {
        // Se a tabela não existir, usar modo simulado
        if (error.code === 'PGRST205') {
          console.log('⚠️ Tabela event_sections não encontrada. Execute a migração SQL no Supabase para ativar seções persistentes.');
          setSections([]);
          return;
        }
        throw error;
      }

      const convertedSections = (data || []).map(convertEventSection);
      setSections(convertedSections);
      console.log('✅ Seções carregadas do Supabase:', convertedSections.length);

    } catch (err) {
      console.error('Erro ao buscar seções:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setSections([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Adicionar nova seção - versão híbrida
  const addSection = useCallback(async (section: Omit<DynamicSection, 'id'>): Promise<DynamicSection | null> => {
    try {
      const newSection = convertDynamicSection(section);
      
      const { data, error } = await supabase
        .from('event_sections')
        .insert({
          ...newSection,
          event_id: eventId
        })
        .select()
        .single();

      if (error) {
        // Se tabela não existir, usar modo simulado
        if (error.code === 'PGRST205') {
          console.log('⚠️ Tabela event_sections não encontrada. Usando modo simulado.');
          const simulatedSection: DynamicSection = {
            ...section,
            id: crypto.randomUUID()
          };
          setSections(prev => [...prev, simulatedSection]);
          console.log('📝 Seção adicionada localmente (modo simulado):', simulatedSection.title);
          return simulatedSection;
        }
        throw error;
      }

      const convertedSection = convertEventSection(data);
      setSections(prev => [...prev, convertedSection]);
      console.log('✅ Seção salva no Supabase:', convertedSection.title);
      return convertedSection;

    } catch (err) {
      console.error('Erro ao adicionar seção:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para modo simulado
      const simulatedSection: DynamicSection = {
        ...section,
        id: crypto.randomUUID()
      };
      setSections(prev => [...prev, simulatedSection]);
      console.log('📝 Seção adicionada localmente (fallback):', simulatedSection.title);
      return simulatedSection;
    }
  }, [eventId]);

  // Atualizar seção - versão híbrida
  const updateSection = useCallback(async (sectionId: string, updates: Partial<DynamicSection>): Promise<boolean> => {
    try {
      const currentSection = sections.find(s => s.id === sectionId);
      if (!currentSection) return false;

      // Verificar se é uma seção simulada (local)
      const isSimulated = currentSection.id.includes('-') && currentSection.id.length === 36;

      if (isSimulated) {
        // Atualizar localmente
        setSections(prev => prev.map(s => 
          s.id === sectionId ? { ...s, ...updates } : s
        ));
        console.log('📝 Seção atualizada localmente:', updates.title || currentSection.title);
        return true;
      }

      // Tentar atualizar no banco
      const updateData = convertDynamicSection({ ...currentSection, ...updates });
      
      const { error } = await supabase
        .from('event_sections')
        .update(updateData)
        .eq('id', sectionId);

      if (error) {
        if (error.code === 'PGRST205') {
          // Se tabela não existir, apenas atualizar localmente
          setSections(prev => prev.map(s => 
            s.id === sectionId ? { ...s, ...updates } : s
          ));
          console.log('📝 Seção atualizada localmente (tabela não existe):', updates.title || currentSection.title);
          return true;
        }
        throw error;
      }

      // Atualizar estado local
      setSections(prev => prev.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      ));
      console.log('✅ Seção atualizada no Supabase:', updates.title || currentSection.title);
      return true;

    } catch (err) {
      console.error('Erro ao atualizar seção:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [sections]);

  // Deletar seção - versão híbrida
  const deleteSection = useCallback(async (sectionId: string): Promise<boolean> => {
    try {
      const currentSection = sections.find(s => s.id === sectionId);
      if (!currentSection) return false;

      // Verificar se é uma seção simulada (local)
      const isSimulated = currentSection.id.includes('-') && currentSection.id.length === 36;

      if (isSimulated) {
        // Remover localmente
        setSections(prev => prev.filter(s => s.id !== sectionId));
        console.log('🗑️ Seção removida localmente:', currentSection.title);
        return true;
      }

      // Tentar deletar do banco
      const { error } = await supabase
        .from('event_sections')
        .delete()
        .eq('id', sectionId);

      if (error) {
        if (error.code === 'PGRST205') {
          // Se tabela não existir, apenas remover localmente
          setSections(prev => prev.filter(s => s.id !== sectionId));
          console.log('🗑️ Seção removida localmente (tabela não existe):', currentSection.title);
          return true;
        }
        throw error;
      }

      // Atualizar estado local
      setSections(prev => prev.filter(s => s.id !== sectionId));
      console.log('✅ Seção deletada do Supabase:', currentSection.title);
      return true;

    } catch (err) {
      console.error('Erro ao deletar seção:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [sections]);

  // Alternar visibilidade - versão híbrida
  const toggleVisibility = useCallback(async (sectionId: string): Promise<boolean> => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;

    return updateSection(sectionId, { isVisible: !section.isVisible });
  }, [sections, updateSection]);

  // Reordenar seções
  const reorderSections = useCallback(async (sectionIds: string[]): Promise<boolean> => {
    try {
      const reorderedSections = sectionIds.map((id, index) => {
        const section = sections.find(s => s.id === id);
        return section ? { ...section, order: index } : null;
      }).filter(Boolean) as DynamicSection[];

      // Atualizar estado local imediatamente
      setSections(reorderedSections);
      
      // Tentar salvar no banco (melhor esforço)
      for (const section of reorderedSections) {
        await updateSection(section.id, { order: section.order });
      }

      console.log('🔄 Seções reordenadas');
      return true;

    } catch (err) {
      console.error('Erro ao reordenar seções:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [sections, updateSection]);

  // Carregar seções ao montar o componente
  useEffect(() => {
    if (eventId) {
      fetchSections();
    }
  }, [eventId, fetchSections]);

  return {
    sections,
    isLoading,
    error,
    fetchSections,
    addSection,
    updateSection,
    deleteSection,
    toggleVisibility,
    reorderSections
  };
};