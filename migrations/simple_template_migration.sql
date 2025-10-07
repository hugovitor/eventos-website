-- Migração simples: Adicionar colunas de template
-- Execute este script no SQL Editor do Supabase

-- Adicionar template_customization se não existir
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS template_customization JSONB;

-- Adicionar template_id se não existir  
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS template_id TEXT;

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_events_template_customization 
ON public.events USING GIN (template_customization);

-- Comentários
COMMENT ON COLUMN public.events.template_customization IS 'Configurações personalizadas do template em formato JSON';
COMMENT ON COLUMN public.events.template_id IS 'ID do template selecionado para o evento';