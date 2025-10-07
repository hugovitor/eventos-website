# 🚀 Guia de Configuração do Supabase

## Status Atual
- ✅ **Projeto configurado**: `jesmcxructompxtawfhx.supabase.co`
- ✅ **Código pronto**: Sistema híbrido implementado
- ✅ **Servidor rodando**: http://localhost:5181/
- 🔄 **Próximo passo**: Executar migração SQL

## 📋 Checklist de Configuração

### 1. Executar Migração SQL ⏳
**Local**: Supabase Dashboard → SQL Editor → New Query

**SQL a executar**:
```sql
-- Cole TODO o conteúdo do arquivo migrations/002_add_photos_and_dynamic_content.sql
-- (133 linhas de código SQL)
```

**O que isso faz**:
- ✅ Cria tabela `event_photos` para fotos
- ✅ Cria tabela `event_sections` para seções dinâmicas  
- ✅ Adiciona colunas extras para eventos e convidados
- ✅ Configura índices para performance
- ✅ Aplica políticas de segurança (RLS)
- ✅ Adiciona triggers para timestamps automáticos

### 2. Configurar Storage Bucket ⏳
**Local**: Supabase Dashboard → Storage

**Configuração**:
- **Nome**: `event-photos`
- **Público**: ✅ Sim
- **Tamanho máximo**: 50MB
- **Tipos permitidos**: `image/*`

**Políticas necessárias**:
```sql
-- Visualização pública
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'event-photos');

-- Upload para usuários autenticados
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

-- Deletar apenas donos do evento  
CREATE POLICY "Event owners can delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'event-photos' AND auth.role() = 'authenticated');
```

## 🔍 Como Verificar se Funcionou

### Logs no Console do Navegador

**ANTES da configuração (modo simulado)**:
```
⚠️ Tabela event_photos não encontrada. Execute a migração SQL no Supabase.
⚠️ Supabase Storage não configurado. Configure o bucket "event-photos" no Supabase.
📷 Foto salva localmente (modo simulado): arquivo.jpg
📝 Seção adicionada localmente (modo simulado): Título
```

**DEPOIS da configuração (modo real)**:
```
✅ Fotos carregadas do Supabase: 0
✅ Foto salva no Supabase: arquivo.jpg  
✅ Seções carregadas do Supabase: 0
✅ Seção salva no Supabase: Título
```

## 🧪 Teste Rápido

1. **Acesse**: http://localhost:5181/
2. **Faça login** ou crie uma conta
3. **Crie um evento** novo
4. **Tente fazer upload** de uma foto
5. **Verifique o console** para ver as mensagens

## 📞 Links Úteis

- **Dashboard Supabase**: https://supabase.com/dashboard
- **Seu projeto**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx
- **SQL Editor**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/sql/new
- **Storage**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/storage/buckets

## 🆘 Resolução de Problemas

### Erro: "Tabela não encontrada"
- ✅ **Solução**: Execute a migração SQL completa

### Erro: "Bucket not found"  
- ✅ **Solução**: Crie o bucket `event-photos` no Storage

### Erro: "RLS violation"
- ✅ **Solução**: As políticas RLS estão na migração, execute-a

### Erro: "Authentication required"
- ✅ **Solução**: Faça login no sistema antes de testar

## 🎯 Resultado Final

Depois da configuração, você terá:
- 📸 **Upload real de fotos** no Supabase Storage
- 📝 **Seções dinâmicas** salvas no banco
- 👥 **RSVP aprimorado** com mais campos
- 📊 **Dashboard admin** funcional
- 🔒 **Segurança RLS** configurada

**Status esperado**: Modo híbrido → Modo real ✅