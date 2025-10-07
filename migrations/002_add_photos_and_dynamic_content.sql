-- Migração: Adicionar tabelas para fotos e conteúdo dinâmico
-- Data: 2025-10-06

-- 1. Tabela para armazenar fotos dos eventos
CREATE TABLE IF NOT EXISTS public.event_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela para seções dinâmicas do evento
CREATE TABLE IF NOT EXISTS public.event_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'text', 'timeline', 'faq', 'location_map', 'custom'
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    position_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Melhorar tabela de convidados com mais informações
ALTER TABLE public.guests 
ADD COLUMN IF NOT EXISTS confirmation_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS will_attend_ceremony BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS will_attend_reception BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS plus_one_name TEXT,
ADD COLUMN IF NOT EXISTS plus_one_dietary_restrictions TEXT,
ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Tabela para informações adicionais do evento
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS ceremony_time TIME,
ADD COLUMN IF NOT EXISTS reception_time TIME,
ADD COLUMN IF NOT EXISTS dress_code TEXT,
ADD COLUMN IF NOT EXISTS special_instructions TEXT,
ADD COLUMN IF NOT EXISTS contact_info JSONB,
ADD COLUMN IF NOT EXISTS social_media JSONB,
ADD COLUMN IF NOT EXISTS rsvp_deadline DATE,
ADD COLUMN IF NOT EXISTS max_guests INTEGER,
ADD COLUMN IF NOT EXISTS allow_plus_one BOOLEAN DEFAULT true;

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON public.event_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sections_event_id ON public.event_sections(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sections_position ON public.event_sections(event_id, position_order);
CREATE INDEX IF NOT EXISTS idx_guests_confirmation_token ON public.guests(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_guests_event_confirmed ON public.guests(event_id, confirmed);

-- 6. Políticas de segurança (RLS)

-- Event Photos
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos of public events" ON public.event_photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_photos.event_id 
            AND events.is_public = true
        )
    );

CREATE POLICY "Event owners can manage photos" ON public.event_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_photos.event_id 
            AND events.user_id = auth.uid()
        )
    );

-- Event Sections
ALTER TABLE public.event_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sections of public events" ON public.event_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_sections.event_id 
            AND events.is_public = true
        )
    );

CREATE POLICY "Event owners can manage sections" ON public.event_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_sections.event_id 
            AND events.user_id = auth.uid()
        )
    );

-- 7. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_photos_updated_at BEFORE UPDATE ON public.event_photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_sections_updated_at BEFORE UPDATE ON public.event_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON public.guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Comentários para documentação
COMMENT ON TABLE public.event_photos IS 'Armazena fotos dos eventos com metadados';
COMMENT ON TABLE public.event_sections IS 'Seções dinâmicas personalizáveis dos eventos';
COMMENT ON COLUMN public.guests.confirmation_token IS 'Token único para confirmação de presença sem login';
COMMENT ON COLUMN public.guests.dietary_restrictions IS 'Restrições alimentares do convidado';
COMMENT ON COLUMN public.guests.special_requests IS 'Solicitações especiais do convidado';