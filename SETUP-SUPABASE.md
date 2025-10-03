# 🚀 Configuração Completa do Supabase

## 📋 Passo a Passo para Configurar o Banco

### 1. **Acessar o Supabase Dashboard**
1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto: `jesmcxructompxtawfhx`
4. Vá para **SQL Editor** no menu lateral

### 2. **Executar o Script Principal**
Copie e cole o código completo abaixo no **SQL Editor** e execute:

```sql
-- =============================================
-- Sistema de Eventos - Configuração Completa
-- =============================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS PRINCIPAIS

-- Tabela de usuários (estende auth.users)
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('birthday', 'wedding')) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  cover_image TEXT,
  logo TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  is_public BOOLEAN DEFAULT FALSE,
  custom_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de convidados
CREATE TABLE IF NOT EXISTS public.guests (
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
CREATE TABLE IF NOT EXISTS public.gifts (
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
CREATE TABLE IF NOT EXISTS public.subscriptions (
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

-- 3. FUNÇÕES E TRIGGERS

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guests_updated_at ON public.guests;
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gifts_updated_at ON public.gifts;
CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar usuário automaticamente
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_custom_url ON public.events(custom_url);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON public.guests(event_id);
CREATE INDEX IF NOT EXISTS idx_gifts_event_id ON public.gifts(event_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
```

### 3. **Configurar Políticas de Segurança (RLS)**
Execute este segundo script para configurar a segurança:

```sql
-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Users can manage guests of own events" ON public.guests;
DROP POLICY IF EXISTS "Guests can view public event guests" ON public.guests;
DROP POLICY IF EXISTS "Users can manage gifts of own events" ON public.gifts;
DROP POLICY IF EXISTS "Gifts can be viewed in public events" ON public.gifts;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;

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
```

### 4. **Dados de Teste (Opcional)**
Execute este script para criar dados de exemplo:

```sql
-- =============================================
-- DADOS DE TESTE (OPCIONAL)
-- =============================================

-- Inserir evento de exemplo (substitua USER_ID_AQUI pelo seu ID de usuário)
-- Para descobrir seu ID: SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';

/*
INSERT INTO public.events (user_id, title, type, description, event_date, location, primary_color, secondary_color, is_public) 
VALUES (
  'SEU_USER_ID_AQUI',
  'Aniversário de 25 anos da Maria',
  'birthday',
  'Celebração especial dos 25 anos da Maria com família e amigos!',
  '2025-12-15',
  'Salão de Festas Central',
  '#FF6B9D',
  '#C44B7A',
  true
);

-- Adicionar convidados de exemplo
INSERT INTO public.guests (event_id, name, email, confirmed, plus_one) 
SELECT 
  id,
  'João Silva',
  'joao@exemplo.com',
  true,
  false
FROM public.events WHERE title = 'Aniversário de 25 anos da Maria';

-- Adicionar presentes de exemplo
INSERT INTO public.gifts (event_id, name, description, price) 
SELECT 
  id,
  'Kit de Cozinha',
  'Conjunto completo de panelas e utensílios',
  250.00
FROM public.events WHERE title = 'Aniversário de 25 anos da Maria';
*/
```

## ⚙️ **Configurações Adicionais**

### 5. **Configurar Autenticação**
No Dashboard do Supabase:

1. Vá para **Authentication > Settings**
2. Configure:
   - ✅ **Enable email confirmations** (recomendado para produção)
   - ✅ **Enable secure email change**
   - ✅ **Enable sign ups** 

### 6. **Configurar Storage (Futuro)**
Para upload de imagens:

1. Vá para **Storage**
2. Criar bucket: `event-images`
3. Configurar políticas de acesso

## 🔍 **Verificar se Tudo Funcionou**

Execute estes comandos para verificar:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se as políticas RLS estão ativas
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## ✅ **Resultado Esperado**

Após executar tudo, você deve ter:
- ✅ 5 tabelas criadas (users, events, guests, gifts, subscriptions)
- ✅ Políticas RLS ativas e configuradas
- ✅ Triggers para updated_at funcionando
- ✅ Função automática para criar usuários
- ✅ Índices para performance

**Agora o sistema está pronto para funcionar completamente!** 🎉