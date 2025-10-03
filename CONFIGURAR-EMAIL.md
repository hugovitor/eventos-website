# Configuração de Confirmação de Email no Supabase

## ⚠️ Problema: Link de confirmação não funciona

O problema ocorre porque o Supabase precisa saber para onde redirecionar o usuário após a confirmação do email.

## ✅ Solução Completa

### 1. Configurar URLs no Supabase Dashboard

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** → **URL Configuration**
3. Configure as seguintes URLs:

```
Site URL: http://localhost:5173
Redirect URLs: 
- http://localhost:5173/confirm-email
- http://localhost:5173/login
- http://localhost:5173/dashboard
```

### 2. Para Produção (quando fizer deploy)

Adicione também as URLs de produção:

```
Site URL: https://seudominio.com
Redirect URLs:
- https://seudominio.com/confirm-email
- https://seudominio.com/login
- https://seudominio.com/dashboard
```

### 3. Configurar Email Templates (Opcional)

1. Vá em **Authentication** → **Email Templates**
2. Edite o template "Confirm signup":

```html
<h2>Confirme sua conta</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Conta</a></p>
<p>Se você não criou uma conta, pode ignorar este email.</p>
```

### 4. Testar o Fluxo

1. Execute o projeto: `npm run dev`
2. Acesse: http://localhost:5173/login
3. Crie uma nova conta
4. Verifique seu email
5. Clique no link de confirmação
6. Você deve ser redirecionado para `/confirm-email`

## 🔧 Troubleshooting

### Se ainda não funcionar:

1. **Verifique as URLs no dashboard**:
   - Certifique-se que `http://localhost:5173/confirm-email` está nas Redirect URLs

2. **Limpe o cache do navegador**:
   - Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)

3. **Verifique o email**:
   - Procure na pasta de spam
   - Teste com diferentes provedores de email

4. **Para desenvolvimento, desabilite confirmação**:
   - No Supabase Dashboard: **Authentication** → **Settings**
   - Desmarque "Enable email confirmations"
   - ⚠️ **APENAS para desenvolvimento!**

### Confirmar conta manualmente (desenvolvimento):

```sql
-- Execute no SQL Editor do Supabase
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'seu-email@teste.com';
```

## 🎯 Como deve funcionar:

1. Usuário se cadastra → Recebe email
2. Clica no link → Vai para `/confirm-email`
3. Página processa confirmação → Redireciona para `/login`
4. Usuário pode fazer login normalmente

## 📋 Checklist de Configuração:

- [ ] URLs configuradas no Supabase Dashboard
- [ ] Projeto rodando em http://localhost:5173
- [ ] Rota `/confirm-email` funcionando
- [ ] Email chegando (verificar spam)
- [ ] Link do email redirecionando corretamente

Se seguir estes passos, o problema deve ser resolvido! 🚀