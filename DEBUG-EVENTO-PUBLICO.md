# 🔧 DIAGNÓSTICO: Problema com Evento Público

## 🔍 **Possíveis Causas:**

1. **Políticas de Segurança (RLS)** podem estar bloqueando a atualização
2. **Validação de dados** no frontend
3. **Erro silencioso** no Supabase

## 🚀 **Testes para Executar:**

### 1. **Verificar se a atualização está funcionando** (SQL Editor):

```sql
-- Ver o evento antes da atualização
SELECT id, title, is_public, user_id, updated_at 
FROM public.events 
WHERE user_id = 'SEU-USER-ID-AQUI'
ORDER BY created_at DESC;

-- Tentar atualizar manualmente
UPDATE public.events 
SET is_public = true 
WHERE id = 'ID-DO-EVENTO-AQUI' 
AND user_id = 'SEU-USER-ID-AQUI';

-- Verificar se atualizou
SELECT id, title, is_public, user_id, updated_at 
FROM public.events 
WHERE id = 'ID-DO-EVENTO-AQUI';
```

### 2. **Verificar políticas de segurança**:

```sql
-- Ver políticas ativas na tabela events
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events';

-- Verificar se o usuário pode atualizar
SELECT auth.uid() as current_user_id;
```

### 3. **Debug no Console do Navegador**:

1. **Abra Developer Tools** (F12)
2. **Vá na aba Console**
3. **Edite um evento** e marque como público
4. **Clique Salvar**
5. **Veja os logs**:
   - "Dados sendo enviados:" (deve mostrar `is_public: true`)
   - "Resposta do Supabase:" (deve mostrar sucesso ou erro)

## 🛠️ **Verificações Rápidas:**

### **No Painel do Supabase:**

1. **Table Editor** → **events**
2. **Encontre seu evento**
3. **Verifique a coluna** `is_public`
4. **Tente editar manualmente** para `true`

### **Na Aplicação:**

1. **Edite o evento**
2. **Marque "Tornar evento público"**
3. **Veja se aparece**: "🌐 Público" (status visual)
4. **Salve e verifique** se a notificação de sucesso aparece

## 🔧 **Se não funcionar:**

### **Desabilitar RLS temporariamente**:

```sql
-- CUIDADO: Só para teste de desenvolvimento
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Teste a atualização

-- Reabilitar depois
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
```

### **Política mais permissiva** (se necessário):

```sql
-- Política temporária mais permissiva
DROP POLICY IF EXISTS "Users can update own events" ON public.events;

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## 📋 **Checklist de Debug:**

- [ ] Console do navegador mostra dados corretos sendo enviados
- [ ] Resposta do Supabase não tem erro
- [ ] Evento atualiza no banco de dados
- [ ] Dashboard mostra status correto após atualização
- [ ] Botão "Ver Página" funciona para eventos públicos

## 🎯 **Solução Rápida:**

Se nada funcionar, teste **atualizar manualmente no Supabase**:

1. **Table Editor** → **events**
2. **Clique no evento**
3. **Mude `is_public` para `true`**
4. **Salve**
5. **Teste "Ver Página" no Dashboard**

**Use os logs do console para identificar exatamente onde está o problema!** 🔍