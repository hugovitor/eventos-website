# Guia de Desenvolvimento - Sistema de Eventos

## 🚨 Problemas Comuns e Soluções

### 1. Limite de Taxa de Email (Rate Limit)

**Problema**: `over_email_send_rate_limit` ao tentar cadastrar usuários

**Causa**: O Supabase limita o envio de emails de confirmação para prevenir spam. Por padrão:
- 1 email por minuto para o mesmo endereço
- Máximo de 3-4 emails por hora

**Soluções**:

#### Para Desenvolvimento:
1. **Aguardar o tempo limite** (recomendado)
2. **Desabilitar confirmação de email temporariamente**:
   ```sql
   -- No Supabase SQL Editor
   UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'seu-email@teste.com';
   ```

3. **Configurar confirmação automática** (apenas desenvolvimento):
   - Vá para Authentication > Settings no Supabase
   - Desabilite "Enable email confirmations"

#### Para Produção:
1. **Configurar domínio personalizado** para emails
2. **Implementar retry logic** com backoff exponencial
3. **Mostrar mensagens claras** para o usuário (já implementado)

### 2. Configuração de Email Personalizado

```javascript
// No Supabase Dashboard > Authentication > Settings
// Configure SMTP personalizado para produção:
{
  "host": "smtp.gmail.com",
  "port": 587,
  "user": "noreply@seudominio.com",
  "pass": "sua-senha-app"
}
```

### 3. Templates de Email Customizados

No Supabase Dashboard > Authentication > Email Templates:

```html
<!-- Template de Confirmação -->
<h2>Bem-vindo ao Sistema de Eventos!</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Conta</a>
```

## 🔧 Configurações de Desenvolvimento

### Variáveis de Ambiente Recomendadas

```env
# .env.local
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-publica
VITE_ENVIRONMENT=development

# Para produção
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...
```

### Configuração do Supabase para Desenvolvimento

1. **Row Level Security (RLS)**:
   ```sql
   -- Permitir leitura para desenvolvimento (REMOVER EM PRODUÇÃO)
   CREATE POLICY "Allow read for development" ON public.events
   FOR SELECT USING (true);
   ```

2. **Dados de Teste**:
   ```sql
   -- Inserir usuário de teste
   INSERT INTO public.users (id, email, full_name, is_admin)
   VALUES (
     '00000000-0000-0000-0000-000000000001',
     'admin@teste.com',
     'Admin Teste',
     true
   );
   ```

## 📱 Testando o Sistema

### 1. Fluxo de Autenticação
```bash
# Teste com diferentes cenários:
# - Email válido/inválido
# - Senha forte/fraca
# - Usuário já existente
# - Rate limit de email
```

### 2. Criação de Eventos
```bash
# Teste:
# - Diferentes tipos (aniversário/casamento)
# - Cores personalizadas
# - Upload de imagens (quando implementado)
# - URLs customizadas
```

### 3. Páginas Públicas
```bash
# Teste:
# - Acesso sem autenticação
# - Confirmação de presença
# - Reserva de presentes
# - Layout responsivo
```

## 🚀 Deploy e Produção

### 1. Checklist Pré-Deploy
- [ ] Configurar domínio personalizado para emails
- [ ] Habilitar confirmação de email
- [ ] Configurar políticas RLS adequadas
- [ ] Testar em diferentes dispositivos
- [ ] Configurar monitoring (Sentry)
- [ ] Backup do banco de dados

### 2. Monitoramento
```javascript
// Adicionar métricas importantes:
// - Taxa de conversão de cadastros
// - Tempo de carregamento das páginas
// - Erros de API
// - Usage do Supabase
```

## 📧 Troubleshooting de Email

### Emails não chegam:
1. Verificar spam/lixo eletrônico
2. Verificar configurações SMTP
3. Verificar domain reputation
4. Verificar limites do Supabase

### Rate Limit constante:
1. Implementar cache no frontend
2. Debounce em formulários
3. Validação prévia antes do envio

## 🔐 Segurança

### 1. Políticas RLS Importantes
```sql
-- Usuários só veem próprios dados
CREATE POLICY "Users can only see own data" ON public.users
FOR ALL USING (auth.uid() = id);

-- Eventos públicos visíveis para todos
CREATE POLICY "Public events visible to all" ON public.events
FOR SELECT USING (is_public = true);
```

### 2. Validação de Dados
- Sempre validar no frontend E backend
- Sanitizar inputs do usuário
- Limitar tamanho de uploads
- Verificar permissões antes de operações

Este guia será atualizado conforme novos problemas e soluções são descobertos.