# 🔧 CORREÇÃO: Erro de Foreign Key ao Criar Evento

## ❌ **Problema:**
```
insert or update on table "events" violates foreign key constraint "events_user_id_fkey"
```

**Causa**: O usuário existe em `auth.users` mas não em `public.users`.

## ✅ **Solução:**

### 1. **Verificar o problema** (Execute no SQL Editor do Supabase):

```sql
-- Ver usuários em auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Ver usuários em public.users
SELECT id, email, full_name 
FROM public.users 
ORDER BY created_at DESC;

-- Verificar se há usuários em auth mas não em public
SELECT a.id, a.email 
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL;
```

### 2. **Corrigir inserindo o usuário manualmente**:

```sql
-- Substitua pelo ID e email do seu usuário
INSERT INTO public.users (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.users);
```

### 3. **Ou para um usuário específico**:

```sql
-- Use o ID do usuário que você viu na primeira consulta
INSERT INTO public.users (id, email, full_name)
VALUES (
  'ID-DO-USUARIO-AQUI',
  'email@exemplo.com',
  'Nome do Usuário'
);
```

## 🔄 **Script Completo para Resolver:**

```sql
-- Passo 1: Identificar usuários problemáticos
WITH missing_users AS (
  SELECT a.id, a.email, a.raw_user_meta_data
  FROM auth.users a
  LEFT JOIN public.users p ON a.id = p.id
  WHERE p.id IS NULL
)
SELECT 
  id as user_id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  'USUÁRIO FALTANDO EM public.users' as status
FROM missing_users;

-- Passo 2: Corrigir automaticamente
INSERT INTO public.users (id, email, full_name)
SELECT 
  a.id, 
  a.email, 
  COALESCE(a.raw_user_meta_data->>'full_name', split_part(a.email, '@', 1))
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL;

-- Passo 3: Verificar se foi corrigido
SELECT 
  'SUCESSO!' as resultado,
  COUNT(*) as usuarios_corrigidos
FROM public.users;
```

## 🛠️ **Para evitar no futuro:**

Verifique se o trigger está funcionando:

```sql
-- Verificar se o trigger existe
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Se não existir, recriar:
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## ✅ **Teste após a correção:**

1. Execute o script de correção
2. Volte na aplicação: `npm run dev`
3. Tente criar um evento novamente

Agora deve funcionar! 🚀