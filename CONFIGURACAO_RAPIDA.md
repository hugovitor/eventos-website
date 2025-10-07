# 🚀 Configuração Rápida do Supabase Storage

## ✅ Status Atual
- **Sistema funcionando**: Modo simulado ativo
- **Erro identificado**: Bucket `event-photos` não existe
- **Solução**: 3 passos simples

---

## 📋 Passo a Passo

### 1️⃣ **Executar Migração SQL**
**Link**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/sql/new

**Ação**: Cole TODO o conteúdo do arquivo `002_add_photos_and_dynamic_content.sql` e clique **"Run"**

### 2️⃣ **Criar Bucket Storage**
**Link**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/storage/buckets

**Ação**: 
- Clique **"Create a new bucket"**
- **Name**: `event-photos`
- **Public bucket**: ✅ **ATIVADO** (obrigatório!)
- Clique **"Create bucket"**

### 3️⃣ **Configurar Políticas**
**Link**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/sql/new

**SQL para executar**:
```sql
-- Visualização pública
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'event-photos');

-- Upload para usuários autenticados  
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'event-photos' 
  AND auth.role() = 'authenticated'
);

-- Deletar próprios arquivos
CREATE POLICY "Users can delete own files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'event-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🔍 **Como Verificar se Funcionou**

### **ANTES** (modo simulado):
```
⚠️ Supabase Storage não configurado. Usando modo simulado.
📷 Foto salva localmente (modo simulado): arquivo.png
```

### **DEPOIS** (modo real):
```
✅ Foto salva no Supabase: arquivo.png
✅ Fotos carregadas do Supabase: 1
```

---

## 🆘 **Links Diretos**

- **Dashboard**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx
- **SQL Editor**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/sql/new
- **Storage**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/storage/buckets
- **Seu App**: http://localhost:5181/

---

## ⚡ **Teste Rápido**

1. Configure conforme acima
2. Volte ao seu app: http://localhost:5181/
3. Faça upload de uma foto
4. Verifique o console - deve mostrar ✅ ao invés de ⚠️

**Tempo estimado**: 5 minutos ⏱️