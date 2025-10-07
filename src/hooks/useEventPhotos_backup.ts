import { useState, useCallback } from 'react';
import { supabase, type EventPhoto } from '../lib/supabase';

interface UploadProgress {
  loading: boolean;
  progress: number;
  error: string | null;
}

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

  // Upload de uma foto
  const uploadPhoto = useCallback(async (
    file: File, 
    caption?: string
  ): Promise<EventPhoto | null> => {
    setUploadProgress({ loading: true, progress: 0, error: null });

    try {
      // 1. Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storagePath = `event-photos/${fileName}`;

      // 2. Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(prev => ({ ...prev, progress: 50 }));

      // 3. Obter URL pública
      const { data: urlData } = supabase.storage
        .from('event-photos')
        .getPublicUrl(storagePath);

      // 4. Obter dimensões da imagem
      const dimensions = await getImageDimensions(file);

      // 5. Salvar metadados no banco
      const photoData = {
        event_id: eventId,
        url: urlData.publicUrl,
        filename: file.name,
        caption: caption || null,
        size_bytes: file.size,
        width: dimensions.width,
        height: dimensions.height,
        mime_type: file.type,
        storage_path: storagePath,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('event_photos')
        .insert(photoData)
        .select()
        .single();

      if (error) throw error;

      setUploadProgress({ loading: false, progress: 100, error: null });
      
      // Atualizar lista local
      setPhotos(prev => [data, ...prev]);
      
      return data;
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
      const photo = await uploadPhoto(files[i], captions?.[i]);
      if (photo) {
        uploadedPhotos.push(photo);
      }
    }

    return uploadedPhotos;
  }, [uploadPhoto]);

  // Deletar foto
  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    try {
      // 1. Buscar dados da foto
      const { data: photo, error: fetchError } = await supabase
        .from('event_photos')
        .select('storage_path')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('event-photos')
        .remove([photo.storage_path]);

      if (storageError) throw storageError;

      // 3. Deletar do banco
      const { error: dbError } = await supabase
        .from('event_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      // 4. Atualizar lista local
      setPhotos(prev => prev.filter(p => p.id !== photoId));

      return true;
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }
  }, []);

  // Atualizar legenda
  const updateCaption = useCallback(async (
    photoId: string, 
    caption: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_photos')
        .update({ caption, updated_at: new Date().toISOString() })
        .eq('id', photoId);

      if (error) throw error;

      // Atualizar lista local
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, caption } : p
      ));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar legenda:', error);
      return false;
    }
  }, []);

  return {
    photos,
    uploadProgress,
    fetchPhotos,
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    updateCaption
  };
};

// Função auxiliar para obter dimensões da imagem
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
};