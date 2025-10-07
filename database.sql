-- =============================================
-- Sistema de Eventos - Estrutura do Banco de Dados
-- =============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (estende auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  subscription_status TEXT CHECK (subscription_status IN ('free', 'monthly', 'per_event')) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('birthday', 'wedding', 'corporate', 'party')) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  cover_image TEXT,
  logo TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  template_id TEXT,
  template_customization JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  custom_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de convidados
CREATE TABLE public.guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de presentes
CREATE TABLE public.gifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image TEXT,
  reserved_by TEXT,
  reserved_at TIMESTAMP WITH TIME ZONE,
  purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'cancelled')) DEFAULT 'inactive',
  plan_type TEXT CHECK (plan_type IN ('monthly', 'per_event')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FUNÇÕES E TRIGGERS
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar usuário automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger para criar usuário automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para events
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public events are viewable by everyone" ON public.events
  FOR SELECT USING (is_public = true);

-- Políticas para guests
CREATE POLICY "Users can manage guests of own events" ON public.guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = guests.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Guests can view public event guests" ON public.guests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = guests.event_id 
      AND events.is_public = true
    )
  );

-- Políticas para gifts
CREATE POLICY "Users can manage gifts of own events" ON public.gifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = gifts.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Gifts can be viewed in public events" ON public.gifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = gifts.event_id 
      AND events.is_public = true
    )
  );

-- Políticas para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para consultas frequentes
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_custom_url ON public.events(custom_url);
CREATE INDEX idx_events_is_public ON public.events(is_public);
CREATE INDEX idx_guests_event_id ON public.guests(event_id);
CREATE INDEX idx_gifts_event_id ON public.gifts(event_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- =============================================
-- DADOS INICIAIS (OPCIONAL)
-- =============================================

-- Inserir dados de exemplo (descomente se necessário)
/*
-- Usuário admin exemplo
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@eventos.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO public.users (id, email, full_name, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@eventos.com',
  'Administrador',
  true
);
*/