-- Políticas para o Storage bucket "event-photos"
-- Execute no SQL Editor após criar o bucket

-- 1. Política para visualização pública
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'event-photos');

-- 2. Política para upload (usuários autenticados)
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'event-photos' 
  AND auth.role() = 'authenticated'
);

-- 3. Política para atualização (donos do arquivo)
CREATE POLICY "Users can update own files" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'event-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Política para deletar (donos do arquivo)
CREATE POLICY "Users can delete own files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'event-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';