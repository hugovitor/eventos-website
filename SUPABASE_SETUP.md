# Configuração do Supabase - Sistema de Fotos e Seções Dinâmicas

## ⚠️ Status Atual
O sistema está funcionando em **modo simulado** porque as tabelas e configurações do Supabase ainda não foram criadas. Para ativar as funcionalidades completas, siga os passos abaixo.

## 📦 Tabelas Necessárias

### 1. Executar a Migração Principal
Execute o arquivo `migrations/002_add_photos_and_dynamic_content.sql` no SQL Editor do Supabase:

```sql
-- O arquivo contém:
-- ✅ Tabela event_photos (para galeria de fotos)
-- ✅ Tabela event_sections (para seções dinâmicas)
-- ✅ Colunas adicionais para guests e events
-- ✅ Índices para performance
-- ✅ Políticas RLS para segurança
-- ✅ Triggers para updated_at
```

### 2. Configurar Storage
1. Acesse **Storage** no painel do Supabase
2. Crie um bucket chamado `event-photos`
3. Configure as políticas de acesso:

```sql
-- Política para visualização pública
CREATE POLICY "Public can view event photos" ON storage.objects
FOR SELECT USING (bucket_id = 'event-photos');

-- Política para upload por usuários autenticados
CREATE POLICY "Authenticated users can upload event photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-photos' 
  AND auth.role() = 'authenticated'
);

-- Política para deletar próprias fotos
CREATE POLICY "Users can delete own event photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔧 Funcionalidades Disponíveis

### ✅ Funcionando Agora (Modo Simulado)
- ✅ Upload de fotos (armazenadas localmente na sessão)
- ✅ Visualização de galeria
- ✅ Criação de seções dinâmicas (armazenadas localmente)
- ✅ Sistema RSVP aprimorado
- ✅ Dashboard administrativo
- ✅ Todas as páginas funcionando

### 🚀 Após Configurar Supabase
- 📸 **Fotos persistentes** no Supabase Storage
- 💾 **Seções dinâmicas** salvas no banco
- 🔐 **Segurança RLS** para proteção de dados
- 📊 **Estatísticas reais** dos eventos
- 🔄 **Sincronização** entre dispositivos

## 📝 Como Ativar
1. Execute a migração SQL no Supabase
2. Configure o Storage bucket
3. Reinicie a aplicação
4. As funcionalidades serão automaticamente ativadas

## 🛠️ Desenvolvimento
- Para desenvolvimento local, as funcionalidades simuladas são suficientes
- Para produção, é necessário configurar o Supabase completamente
- O código está preparado para detectar automaticamente se as tabelas existem

## 📋 Checklist de Configuração
- [ ] Executar `migrations/002_add_photos_and_dynamic_content.sql`
- [ ] Criar bucket `event-photos` no Storage
- [ ] Configurar políticas RLS do Storage
- [ ] Testar upload de fotos
- [ ] Testar criação de seções dinâmicas
- [ ] Verificar políticas de segurança

---

**Nota**: O sistema funciona perfeitamente sem essas configurações, mas as funcionalidades de persistência estarão desabilitadas até que sejam configuradas.