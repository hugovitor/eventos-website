# 🛠️ SOLUÇÃO: Criar Tabelas Manualmente no Supabase

## 🔍 **Diagnóstico**
Erro `404 (Not Found)` = Tabela `event_photos` não existe no banco

## 📋 **Solução Passo a Passo**

### **PASSO 1: Verificar Tabelas Existentes**
**Link**: https://supabase.com/dashboard/project/jesmcxructompxtawfhx/sql/new

**Execute este SQL**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### **PASSO 2: Criar Tabela event_photos**
**No mesmo SQL Editor, execute**:
```sql
CREATE TABLE public.event_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **PASSO 3: Criar Tabela event_sections**
**Execute em seguida**:
```sql
CREATE TABLE public.event_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    position_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **PASSO 4: Aplicar RLS (Segurança)**
**Execute**:
```sql
-- Ativar RLS
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sections ENABLE ROW LEVEL SECURITY;

-- Política básica (acesso público para testes)
CREATE POLICY "Allow all access" ON public.event_photos FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.event_sections FOR ALL USING (true);
```

### **PASSO 5: Verificar Criação**
**Execute para confirmar**:
```sql
SELECT 'event_photos' as tabela, count(*) as colunas 
FROM information_schema.columns 
WHERE table_name = 'event_photos'
UNION ALL
SELECT 'event_sections' as tabela, count(*) as colunas 
FROM information_schema.columns 
WHERE table_name = 'event_sections';
```

**Resultado esperado**:
```
tabela         | colunas
event_photos   | 13
event_sections | 9
```

---

## 🎯 **Resultado Esperado no Console**

**ANTES**:
```
❌ POST .../event_photos 404 (Not Found)
⚠️ Tabela event_photos não encontrada. Usando modo simulado.
```

**DEPOIS**:
```
✅ Fotos carregadas do Supabase: 0
✅ Foto salva no Supabase: arquivo.png
```

---

## ⚡ **Teste Rápido**

1. Execute os passos acima
2. Volte ao app: http://localhost:5181/
3. Tente fazer upload de uma foto
4. Verifique o console - deve mostrar sucesso ✅

**Tempo estimado**: 3 minutos ⏱️