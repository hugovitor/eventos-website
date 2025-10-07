-- Script de Verificação - Execute no SQL Editor do Supabase
-- Para verificar se as tabelas foram criadas corretamente

-- 1. Verificar se as tabelas existem
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('event_photos', 'event_sections');

-- 2. Verificar estrutura da tabela event_photos (se existir)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'event_photos' 
AND table_schema = 'public';

-- 3. Verificar estrutura da tabela event_sections (se existir)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'event_sections' 
AND table_schema = 'public';

-- 4. Verificar se a tabela events existe (dependência)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'events';

-- 5. Listar todas as tabelas do projeto
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;