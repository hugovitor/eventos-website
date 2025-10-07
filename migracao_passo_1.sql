-- MIGRAÇÃO SIMPLIFICADA - Execute PASSO A PASSO
-- Execute cada bloco separadamente no SQL Editor

-- PASSO 1: Verificar se a tabela events existe
SELECT * FROM information_schema.tables WHERE table_name = 'events' AND table_schema = 'public';

-- Se a tabela events NÃO existir, execute este bloco primeiro:
/*
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location TEXT,
    cover_image TEXT,
    logo TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#10B981',
    is_public BOOLEAN DEFAULT false,
    custom_url TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
*/