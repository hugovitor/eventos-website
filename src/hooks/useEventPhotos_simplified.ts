import { useState, useCallback } from 'react';
import { supabase, type EventPhoto } from '../lib/supabase';

interface UploadProgress {
  loading: boolean;
  progress: number;
  error: string | null;
}

// Função auxiliar para obter dimensões da imagem
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 }); // fallback
    };
    img.src = URL.createObjectURL(file);
  });
};

export const useEventPhotos = (eventId: string) => {
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    loading: false,
    progress: 0,
    error: null
  });

  // Buscar fotos do evento
  const fetchPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        // Se a tabela não existir, usar fotos vazias
        if (error.code === 'PGRST205') {
          console.log('Tabela event_photos não encontrada. Usando fotos vazias.');
          setPhotos([]);
          return;
        }
        throw error;
      }
      setPhotos(data || []);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      // Em caso de erro, definir fotos vazias
      setPhotos([]);
    }
  }, [eventId]);

  // Upload de uma foto - versão simplificada sem Supabase Storage
  const uploadPhoto = useCallback(async (
    file: File, 
    caption?: string
  ): Promise<EventPhoto | null> => {
    setUploadProgress({ loading: true, progress: 0, error: null });

    try {
      console.log('Upload simulado para o arquivo:', file.name);
      
      setUploadProgress(prev => ({ ...prev, progress: 50 }));

      // Obter dimensões da imagem
      const dimensions = await getImageDimensions(file);

      // Criar uma foto de exemplo com URL local
      const photo: EventPhoto = {
        id: crypto.randomUUID(),
        event_id: eventId,
        url: URL.createObjectURL(file),
        filename: file.name,
        caption: caption || '',
        uploadedAt: new Date(),
        size: file.size,
        dimensions: { width: dimensions.width, height: dimensions.height },
        size_bytes: file.size,
        width: dimensions.width,
        height: dimensions.height,
        storage_path: `local/${file.name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUploadProgress({ loading: false, progress: 100, error: null });
      
      // Adicionar à lista local
      setPhotos(prev => [photo, ...prev]);
      return photo;

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setUploadProgress({ 
        loading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
      return null;
    }
  }, [eventId]);

  // Upload múltiplo
  const uploadMultiplePhotos = useCallback(async (
    files: FileList,
    captions?: string[]
  ): Promise<EventPhoto[]> => {
    const uploadedPhotos: EventPhoto[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const caption = captions && captions[i] ? captions[i] : undefined;
        const photo = await uploadPhoto(file, caption);
        if (photo) {
          uploadedPhotos.push(photo);
        }
      }
    }
    
    return uploadedPhotos;
  }, [uploadPhoto]);

  // Deletar foto - versão simplificada
  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    try {
      console.log('Delete simulado para foto:', photoId);
      
      // Remover da lista local
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      return true;

    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }
  }, []);

  // Atualizar legenda - versão simplificada
  const updateCaption = useCallback(async (photoId: string, caption: string): Promise<boolean> => {
    try {
      console.log('Update caption simulado para foto:', photoId, 'nova legenda:', caption);
      
      // Atualizar na lista local
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, caption } : p
      ));
      return true;

    } catch (error) {
      console.error('Erro ao atualizar legenda:', error);
      return false;
    }
  }, []);

  // Reordenar fotos
  const reorderPhotos = useCallback(async (photoIds: string[]): Promise<boolean> => {
    try {
      console.log('Reorder simulado para fotos:', photoIds);
      
      // Reordenar na lista local
      const reorderedPhotos = photoIds.map(id => 
        photos.find(p => p.id === id)!
      ).filter(Boolean);
      
      setPhotos(reorderedPhotos);
      return true;

    } catch (error) {
      console.error('Erro ao reordenar fotos:', error);
      return false;
    }
  }, [photos]);

  return {
    photos,
    uploadProgress,
    fetchPhotos,
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    updateCaption,
    reorderPhotos
  };
};