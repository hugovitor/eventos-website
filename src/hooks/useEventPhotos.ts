import { useState, useCallback, useEffect } from 'react';
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

// Função auxiliar para validar UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const useEventPhotos = (eventId: string) => {
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    loading: false,
    progress: 0,
    error: null
  });

  // Buscar fotos do evento
  const fetchPhotos = useCallback(async () => {
    if (!eventId) return;
    
    // Verificar se eventId é um UUID válido
    if (!isValidUUID(eventId)) {
      console.log('⚠️ EventId inválido (não é UUID). Usando modo simulado para:', eventId);
      setPhotos([]);
      setIsInitialized(true);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        // Se a tabela não existir, usar fotos vazias
        if (error.code === 'PGRST205') {
          console.log('⚠️ Tabela event_photos não encontrada. Execute a migração SQL no Supabase para ativar fotos persistentes.');
          setPhotos([]);
          setIsInitialized(true);
          return;
        }
        // Se erro de UUID inválido, usar modo simulado
        if (error.code === '22P02') {
          console.log('⚠️ EventId com formato inválido. Usando modo simulado para:', eventId);
          setPhotos([]);
          setIsInitialized(true);
          return;
        }
        throw error;
      }
      setPhotos(data || []);
      setIsInitialized(true);
      console.log('✅ Fotos carregadas do Supabase:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📷 URLs das fotos carregadas:');
        data.forEach((photo, index) => {
          console.log(`  ${index + 1}. ${photo.filename}: ${photo.url}`);
        });
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      setPhotos([]);
      setIsInitialized(true);
    }
  }, [eventId]);

  // Upload de uma foto - versão híbrida (Supabase + fallback simulado)
  const uploadPhoto = useCallback(async (
    file: File, 
    caption?: string
  ): Promise<EventPhoto | null> => {
    
    // Função auxiliar para modo simulado
    const uploadPhotoSimulated = async (file: File, caption?: string): Promise<EventPhoto | null> => {
      try {
        const dimensions = await getImageDimensions(file);

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

        setPhotos(prev => [photo, ...prev]);
        console.log('📷 Foto salva localmente (modo simulado):', photo.filename);
        return photo;
      } catch (error) {
        console.error('Erro no upload simulado:', error);
        return null;
      }
    };
    
    // Verificar se eventId é um UUID válido
    if (!isValidUUID(eventId)) {
      console.log('⚠️ EventId inválido para upload. Usando modo simulado para:', eventId);
      return uploadPhotoSimulated(file, caption);
    }

    setUploadProgress({ loading: true, progress: 0, error: null });

    try {
      // 1. Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storagePath = `event-photos/${fileName}`;

      setUploadProgress(prev => ({ ...prev, progress: 20 }));

      // 2. Tentar upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Se bucket não existir ou erro de acesso, usar modo simulado
        if (uploadError.message.includes('Bucket not found') || 
            uploadError.message.includes('row-level security') ||
            uploadError.message.includes('policy') ||
            uploadError.message.includes('Bad Request') ||
            uploadError.message.includes('400')) {
          console.log('⚠️ Supabase Storage não configurado. Usando modo simulado. Configure o bucket "event-photos" no Supabase.');
          console.log('💡 Erro detectado:', uploadError.message);
          setUploadProgress({ loading: false, progress: 100, error: null });
          return uploadPhotoSimulated(file, caption);
        }
        throw uploadError;
      }

      setUploadProgress(prev => ({ ...prev, progress: 50 }));

      // 3. Obter URL pública
      const { data: urlData } = supabase.storage
        .from('event-photos')
        .getPublicUrl(storagePath);

      // 4. Obter dimensões da imagem
      const dimensions = await getImageDimensions(file);

      setUploadProgress(prev => ({ ...prev, progress: 70 }));

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

      if (error) {
        // Se tabela não existir, usar modo simulado
        if (error.code === 'PGRST205') {
          console.log('⚠️ Tabela event_photos não encontrada. Usando modo simulado. Execute a migração SQL no Supabase.');
          setUploadProgress({ loading: false, progress: 100, error: null });
          return uploadPhotoSimulated(file, caption);
        }
        // Se erro de UUID inválido, usar modo simulado
        if (error.code === '22P02') {
          console.log('⚠️ EventId inválido detectado. Usando modo simulado...');
          setUploadProgress({ loading: false, progress: 100, error: null });
          return uploadPhotoSimulated(file, caption);
        }
        throw error;
      }

      setUploadProgress({ loading: false, progress: 100, error: null });
      
      // Atualizar lista local
      setPhotos(prev => [data, ...prev]);
      console.log('✅ Foto salva no Supabase:', data.filename);
      return data;

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      
      // Verificar se é erro de UUID inválido
      if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
        console.log('🔄 EventId inválido detectado. Usando modo simulado...');
        setUploadProgress({ loading: false, progress: 100, error: null });
        return uploadPhotoSimulated(file, caption);
      }
      
      setUploadProgress({ 
        loading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
      
      // Em caso de erro inesperado, tentar modo simulado
      console.log('🔄 Tentando modo simulado após erro...');
      setUploadProgress({ loading: false, progress: 100, error: null });
      return uploadPhotoSimulated(file, caption);
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

  // Deletar foto - versão híbrida
  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return false;

      // Se é uma foto local (simulada), apenas remover da lista
      if (photo.storage_path.startsWith('local/')) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        console.log('🗑️ Foto local removida:', photo.filename);
        return true;
      }

      // Tentar deletar do Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('event-photos')
        .remove([photo.storage_path]);

      if (storageError && !storageError.message.includes('not found')) {
        console.warn('Aviso ao deletar do Storage:', storageError);
      }

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('event_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) {
        if (dbError.code === 'PGRST205') {
          // Se tabela não existir, apenas remover da lista local
          setPhotos(prev => prev.filter(p => p.id !== photoId));
          console.log('🗑️ Foto removida localmente (tabela não existe):', photo.filename);
          return true;
        }
        throw dbError;
      }

      // Atualizar estado local
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      console.log('✅ Foto deletada do Supabase:', photo.filename);
      return true;

    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }
  }, [photos]);

  // Atualizar legenda - versão híbrida
  const updateCaption = useCallback(async (photoId: string, caption: string): Promise<boolean> => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return false;

      // Se é uma foto local (simulada), apenas atualizar na lista
      if (photo.storage_path.startsWith('local/')) {
        setPhotos(prev => prev.map(p => 
          p.id === photoId ? { ...p, caption } : p
        ));
        console.log('📝 Legenda atualizada localmente:', caption);
        return true;
      }

      // Tentar atualizar no banco
      const { error } = await supabase
        .from('event_photos')
        .update({ caption })
        .eq('id', photoId);

      if (error) {
        if (error.code === 'PGRST205') {
          // Se tabela não existir, apenas atualizar na lista local
          setPhotos(prev => prev.map(p => 
            p.id === photoId ? { ...p, caption } : p
          ));
          console.log('📝 Legenda atualizada localmente (tabela não existe):', caption);
          return true;
        }
        throw error;
      }

      // Atualizar estado local
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, caption } : p
      ));
      console.log('✅ Legenda atualizada no Supabase:', caption);
      return true;

    } catch (error) {
      console.error('Erro ao atualizar legenda:', error);
      return false;
    }
  }, [photos]);

  // Reordenar fotos
  const reorderPhotos = useCallback(async (photoIds: string[]): Promise<boolean> => {
    try {
      // Reordenar na lista local
      const reorderedPhotos = photoIds.map(id => 
        photos.find(p => p.id === id)!
      ).filter(Boolean);
      
      setPhotos(reorderedPhotos);
      console.log('🔄 Fotos reordenadas');
      return true;

    } catch (error) {
      console.error('Erro ao reordenar fotos:', error);
      return false;
    }
  }, [photos]);

  // Buscar fotos automaticamente quando eventId muda
  useEffect(() => {
    if (eventId && !isInitialized) {
      fetchPhotos();
    }
  }, [eventId, isInitialized, fetchPhotos]);

  // Reset quando eventId muda
  useEffect(() => {
    setIsInitialized(false);
    setPhotos([]);
  }, [eventId]);

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