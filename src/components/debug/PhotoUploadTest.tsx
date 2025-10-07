import React, { useState } from 'react';
import { useEventPhotos } from '../../hooks/useEventPhotos';
import { Button } from '../ui/Button';

interface PhotoUploadTestProps {
  eventId: string;
}

export const PhotoUploadTest: React.FC<PhotoUploadTestProps> = ({ eventId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { photos, uploadPhoto, uploadProgress } = useEventPhotos(eventId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTestResult(`Arquivo selecionado: ${file.name} (${file.size} bytes)`);
    }
  };

  const handleTestUpload = async () => {
    if (!selectedFile) {
      setTestResult('❌ Nenhum arquivo selecionado');
      return;
    }

    setIsUploading(true);
    setTestResult('🔄 Iniciando upload...');

    try {
      console.log('🧪 TESTE: Iniciando upload de', selectedFile.name);
      console.log('🧪 TESTE: EventId utilizado:', eventId);
      console.log('🧪 TESTE: É UUID válido:', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId));
      
      const result = await uploadPhoto(selectedFile);
      
      if (result) {
        setTestResult(`✅ Upload bem-sucedido! ID: ${result.id}`);
        console.log('🧪 TESTE: Upload bem-sucedido:', result);
      } else {
        setTestResult('❌ Upload falhou - resultado null');
        console.log('🧪 TESTE: Upload falhou - resultado null');
      }
    } catch (error) {
      setTestResult(`❌ Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('🧪 TESTE: Erro no upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-4">🧪 Teste de Upload de Fotos</h3>
      
      <div className="mb-4">
        <p><strong>EventId:</strong> {eventId}</p>
        <p><strong>É UUID válido:</strong> {/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId) ? '✅' : '❌'}</p>
        <p><strong>Fotos carregadas:</strong> {photos.length}</p>
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600">
            {selectedFile.name} - {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      <Button
        onClick={handleTestUpload}
        disabled={!selectedFile || isUploading}
        className="mb-4"
      >
        {isUploading ? 'Enviando...' : 'Testar Upload'}
      </Button>

      {uploadProgress.loading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Progresso: {uploadProgress.progress}%</p>
        </div>
      )}

      <div className="p-3 bg-white rounded border">
        <p className="text-sm font-mono">{testResult}</p>
      </div>

      {photos.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Fotos Carregadas:</h4>
          <div className="grid grid-cols-2 gap-2">
            {photos.map(photo => (
              <div key={photo.id} className="p-2 bg-white rounded border text-xs">
                <p><strong>ID:</strong> {photo.id}</p>
                <p><strong>Nome:</strong> {photo.filename}</p>
                <p><strong>URL:</strong> {photo.url.substring(0, 50)}...</p>
                <p><strong>Storage:</strong> {photo.storage_path}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};