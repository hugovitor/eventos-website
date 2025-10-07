-- Migração: Adicionar coluna template_customization se não existir
-- Data: 2025-10-06

-- Verificar se a coluna existe e adicionar se necessário
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'events' 
        AND column_name = 'template_customization'
    ) THEN
        ALTER TABLE public.events 
        ADD COLUMN template_customization JSONB;
    END IF;
END $$;

-- Verificar se a coluna template_id existe e adicionar se necessário
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'events' 
        AND column_name = 'template_id'
    ) THEN
        ALTER TABLE public.events 
        ADD COLUMN template_id TEXT;
    END IF;
END $$;

-- Adicionar índice para melhorar performance nas consultas de customização
CREATE INDEX IF NOT EXISTS idx_events_template_customization 
ON public.events USING GIN (template_customization);

-- Comentários para documentação
COMMENT ON COLUMN public.events.template_customization IS 'Configurações personalizadas do template em formato JSON';
COMMENT ON COLUMN public.events.template_id IS 'ID do template selecionado para o evento';