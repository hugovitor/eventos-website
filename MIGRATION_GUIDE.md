# 🔧 Migração do Banco de Dados - Template System

## ❗ Erro Encontrado
```
{
    "code": "PGRST204",
    "details": null,
    "hint": null,
    "message": "Could not find the 'template_customization' column of 'events' in the schema cache"
}
```

## 🚀 Solução: Aplicar Migração

### Passo 1: Acessar o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor** na barra lateral

### Passo 2: Executar a Migração
Copie e cole o seguinte código SQL no editor:

```sql
-- Migração: Adicionar colunas de template
-- Execute este script no SQL Editor do Supabase

-- Adicionar template_customization se não existir
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS template_customization JSONB;

-- Adicionar template_id se não existir  
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS template_id TEXT;

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_events_template_customization 
ON public.events USING GIN (template_customization);

-- Comentários
COMMENT ON COLUMN public.events.template_customization IS 'Configurações personalizadas do template em formato JSON';
COMMENT ON COLUMN public.events.template_id IS 'ID do template selecionado para o evento';
```

### Passo 3: Executar o Script
1. Clique em **RUN** para executar o script
2. Verifique se não houve erros
3. O resultado deve mostrar que as colunas foram adicionadas com sucesso

### Passo 4: Verificar a Estrutura
Para confirmar que as colunas foram criadas, execute:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'events'
  AND column_name IN ('template_customization', 'template_id');
```

## ✅ Após a Migração

1. **Reinicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

2. **Teste a funcionalidade**:
   - Crie um novo evento
   - Personalize o template
   - Adicione fotos
   - Verifique se não há mais erros

## 🎯 O que foi Corrigido

### Código Mais Robusto
- ✅ **CreateEventPage**: Agora cria o evento em duas etapas (básico + template)
- ✅ **EditEventPage**: Trata casos onde as colunas ainda não existem  
- ✅ **Tratamento de Erro**: Logs informativos quando colunas não existem
- ✅ **Compatibilidade**: Funciona antes e depois da migração

### Estrutura do Banco
- ✅ **template_customization**: JSONB para configurações do template
- ✅ **template_id**: TEXT para ID do template selecionado
- ✅ **Índice GIN**: Para consultas eficientes no JSONB
- ✅ **Comentários**: Documentação das colunas

## 🔄 Atualizações Automáticas

O código agora é mais robusto e:
- Cria eventos mesmo se as colunas de template não existirem
- Exibe warnings informativos no console
- Mantém funcionalidade básica sempre disponível
- Aplica configurações de template quando possível

## 📱 Funcionalidades Disponíveis

Após a migração, todas as funcionalidades estarão disponíveis:
- 🎨 **Templates personalizáveis**
- 📸 **Galeria de fotos**
- 🎯 **Configurações avançadas**
- 💾 **Persistência completa**

---

⚠️ **Importante**: Execute a migração no Supabase para ter acesso completo a todas as funcionalidades!