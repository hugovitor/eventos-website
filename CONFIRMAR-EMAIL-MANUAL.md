# Confirmar Email Manualmente no Supabase

## 🚀 Método 1: SQL Editor (Recomendado)

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Vá em**: SQL Editor
3. **Execute este comando**:

```sql
-- Confirmar email de um usuário específico
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'seu-email@teste.com';
```

**Substitua** `seu-email@teste.com` pelo email que você cadastrou.

## 🔍 Método 2: Verificar e Confirmar

Para ver todos os usuários não confirmados e depois confirmar:

```sql
-- 1. Ver usuários não confirmados
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- 2. Confirmar um usuário específico (use o email da consulta acima)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'seu-email@teste.com';

-- 3. Verificar se foi confirmado
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'seu-email@teste.com';
```

## 🎯 Método 3: Confirmar Último Usuário Criado

```sql
-- Confirmar o usuário mais recente
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE id = (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1
);
```

## 🛠️ Método 4: Interface do Supabase

1. **Vá em**: Authentication → Users
2. **Encontre seu usuário**
3. **Clique nos 3 pontinhos** (⋯) ao lado do usuário
4. **Selecione**: "Send confirmation email" OU edite manualmente

## ✅ Verificar se funcionou:

Após executar o SQL, teste fazer login na aplicação:

```bash
npm run dev
```

Acesse http://localhost:5173/login e tente fazer login com suas credenciais.

## 🔄 Script Completo para Teste:

```sql
-- Passo 1: Ver todos os usuários
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'NÃO CONFIRMADO'
    ELSE 'CONFIRMADO'
  END as status
FROM auth.users 
ORDER BY created_at DESC;

-- Passo 2: Confirmar email (substitua pelo seu email)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'SEU-EMAIL-AQUI@teste.com';

-- Passo 3: Verificar se foi confirmado
SELECT 
  email, 
  email_confirmed_at,
  'CONFIRMADO COM SUCESSO!' as resultado
FROM auth.users 
WHERE email = 'SEU-EMAIL-AQUI@teste.com';
```

## 🎉 Depois de confirmar:

1. O usuário pode fazer login normalmente
2. O trigger automático criará o registro na tabela `public.users`
3. Todas as funcionalidades do sistema estarão disponíveis

**Dica**: Para desenvolvimento, você também pode desabilitar a confirmação de email em Authentication → Settings → "Enable email confirmations" (desmarcar).