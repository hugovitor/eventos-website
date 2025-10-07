import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useEventPhotos } from '../../hooks/useEventPhotos';
import { type EventPhoto } from '../../lib/supabase';
import {
  Camera,
  Upload,
  X,
  Eye,
  Edit3,
  Grid,
  List,
  Plus,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface PhotoGalleryProps {
  eventId: string;
  isPublic?: boolean;
  maxPhotos?: number;
  photos?: EventPhoto[]; // Usar tipo do Supabase
  onPhotosChange?: (photos: EventPhoto[]) => void;
  className?: string;
}

// Componente para lidar com erros de carregamento de imagem
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}> = ({ src, alt, className = '', fallbackText = 'Imagem não disponível' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error('❌ Erro ao carregar imagem:', src);
    console.error('📄 URL da imagem:', src);
    
    // Verificar se é uma URL blob expirada
    if (src.startsWith('blob:')) {
      console.warn('⚠️ URL blob detectada - pode ter expirado após recarregar a página');
    }
    
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('✅ Imagem carregada com sucesso:', src);
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
          <div className="animate-pulse">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  eventId,
  isPublic = false,
  maxPhotos = 12,
  photos: initialPhotos = [],
  onPhotosChange,
  className = ''
}) => {
  // Usar hook do Supabase para fotos quando não for público
  const supabasePhotos = useEventPhotos(eventId);
  
  // Usar fotos do Supabase se não for modo público, senão usar as fotos passadas por props
  const photos = isPublic ? initialPhotos : supabasePhotos.photos;
  const photosToDisplay = photos.length > 0 ? photos : initialPhotos;
  
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fotos são carregadas automaticamente pelo hook useEventPhotos

  // Upload de fotos usando Supabase
  const handleFileUpload = async (files: FileList) => {
    if (photosToDisplay.length + files.length > maxPhotos) {
      alert(`Máximo de ${maxPhotos} fotos permitidas`);
      return;
    }

    if (!isPublic) {
      setIsUploading(true);
      const filesArray = Array.from(files);
      
      // Se há callback onPhotosChange, usar modo local (durante criação)
      if (onPhotosChange) {
        const newPhotos: EventPhoto[] = [];
        
        for (const file of filesArray) {
          if (!file.type.startsWith('image/')) continue;

          const url = URL.createObjectURL(file);
          const dimensions = await getImageDimensions(file);
          
          const photo: EventPhoto = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            event_id: eventId,
            url,
            filename: file.name,
            caption: '',
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

          newPhotos.push(photo);
        }

        // Atualizar através do callback
        const updatedPhotos = [...photosToDisplay, ...newPhotos];
        onPhotosChange(updatedPhotos);
        
      } else {
        // Modo Supabase normal (após evento criado)
        for (const file of filesArray) {
          await supabasePhotos.uploadPhoto(file);
        }
      }
      
      setIsUploading(false);
      setShowUploadModal(false);
    } else {
      // Fallback para modo público (usar lógica anterior)
      const newPhotos: EventPhoto[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const url = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(file);
        
        const photo: EventPhoto = {
          id: `photo_${Date.now()}_${i}`,
          event_id: eventId,
          url,
          filename: file.name,
          caption: undefined,
          uploadedAt: new Date(),
          size: file.size,
          dimensions: { width: dimensions.width, height: dimensions.height },
          size_bytes: file.size,
          width: dimensions.width,
          height: dimensions.height,
          storage_path: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        newPhotos.push(photo);
      }

      const updatedPhotos = [...photosToDisplay, ...newPhotos];
      onPhotosChange?.(updatedPhotos);
      setShowUploadModal(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!isPublic) {
      // Se há callback onPhotosChange, usar modo local (durante criação)
      if (onPhotosChange) {
        const updatedPhotos = photosToDisplay.filter(p => p.id !== photoId);
        onPhotosChange(updatedPhotos);
      } else {
        // Modo Supabase normal (após evento criado)
        await supabasePhotos.deletePhoto(photoId);
      }
    } else {
      const updatedPhotos = photosToDisplay.filter(p => p.id !== photoId);
      onPhotosChange?.(updatedPhotos);
    }
    setSelectedPhoto(null);
  };

  const updateCaption = async (photoId: string, caption: string) => {
    if (!isPublic) {
      // Se há callback onPhotosChange, usar modo local (durante criação)
      if (onPhotosChange) {
        const updatedPhotos = photosToDisplay.map(p => 
          p.id === photoId ? { ...p, caption } : p
        );
        onPhotosChange(updatedPhotos);
      } else {
        // Modo Supabase normal (após evento criado)
        await supabasePhotos.updateCaption(photoId, caption);
      }
    } else {
      const updatedPhotos = photosToDisplay.map(p => 
        p.id === photoId ? { ...p, caption } : p
      );
      onPhotosChange?.(updatedPhotos);
    }
    setEditingCaption(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isPublic) {
    // Visualização pública - apenas exibir fotos
    return (
      <div className={`space-y-6 ${className}`}>
        {photos.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Galeria de Fotos
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <ImageWithFallback
                        src={photo.url}
                        alt={photo.caption || photo.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {photo.caption && (
                      <p className="mt-2 text-sm text-gray-600 text-center">{photo.caption}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de visualização */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-full p-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <X className="w-6 h-6" />
                </button>
                <ImageWithFallback
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || selectedPhoto.filename}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                {selectedPhoto.caption && (
                  <p className="text-white text-center mt-4 text-lg">{selectedPhoto.caption}</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Interface de administração
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Galeria de Fotos
              </h3>
              <p className="text-gray-600 text-sm">
                {photos.length} de {maxPhotos} fotos adicionadas
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                disabled={photos.length >= maxPhotos}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Fotos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma foto adicionada</h4>
              <p className="text-gray-500 mb-4">Adicione algumas fotos para tornar seu evento mais atrativo</p>
              <Button onClick={() => setShowUploadModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Foto
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 
              'space-y-4'
            }>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className={`relative group ${viewMode === 'list' ? 'flex items-center space-x-4 p-4 border rounded-lg' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-20 h-20'} overflow-hidden rounded-lg bg-gray-100 flex-shrink-0`}>
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.caption || photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="flex-1">
                      <h4 className="font-medium">{photo.filename}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(photo.size_bytes)}
                        {photo.width && photo.height && ` • ${photo.width}x${photo.height}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        Adicionada em {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className={`${viewMode === 'grid' ? 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center' : 'flex items-center space-x-2'}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPhoto(photo)}
                      className={viewMode === 'grid' ? 'opacity-0 group-hover:opacity-100 bg-white text-black' : ''}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCaption(photo.id);
                        setNewCaption(photo.caption || '');
                      }}
                      className={viewMode === 'grid' ? 'opacity-0 group-hover:opacity-100 bg-white text-black ml-2' : ''}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePhoto(photo.id)}
                      className={`${viewMode === 'grid' ? 'opacity-0 group-hover:opacity-100 bg-red-500 text-white ml-2 hover:bg-red-600' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {viewMode === 'grid' && photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
                      <p className="text-xs truncate">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Upload */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Adicionar Fotos</h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Arraste fotos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Máximo {maxPhotos - photos.length} fotos restantes
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Selecionar Arquivos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
              </div>

              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600 mt-2">Processando fotos...</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Visualização */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full p-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <X className="w-6 h-6" />
              </button>
              <ImageWithFallback
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || selectedPhoto.filename}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="mt-4 text-white text-center">
                <h4 className="font-medium">{selectedPhoto.filename}</h4>
                {selectedPhoto.caption && (
                  <p className="text-gray-300 mt-1">{selectedPhoto.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Edição de Legenda */}
      <AnimatePresence>
        {editingCaption && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Editar Legenda</h3>
              
              <Input
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Digite uma legenda para a foto..."
                autoFocus
              />

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditingCaption(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateCaption(editingCaption, newCaption)}
                >
                  Salvar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};