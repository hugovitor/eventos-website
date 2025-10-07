-- PASSO 2: Criar tabela event_photos
-- Execute apenas este bloco

CREATE TABLE IF NOT EXISTS public.event_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Verificar se foi criada
SELECT 'Tabela event_photos criada com sucesso!' as resultado;
SELECT count(*) as total_colunas FROM information_schema.columns 
WHERE table_name = 'event_photos' AND table_schema = 'public';