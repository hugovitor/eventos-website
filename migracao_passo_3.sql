-- PASSO 3: Criar tabela event_sections
-- Execute apenas este bloco

CREATE TABLE IF NOT EXISTS public.event_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    position_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Verificar se foi criada
SELECT 'Tabela event_sections criada com sucesso!' as resultado;
SELECT count(*) as total_colunas FROM information_schema.columns 
WHERE table_name = 'event_sections' AND table_schema = 'public';