# 🔍 Diagnóstico de Upload de Fotos

## Problema Relatado
Usuário não consegue adicionar fotos na criação nem na edição de eventos.

## Componente de Debug Adicionado
Adicionei um componente `PhotoUploadTest` na página CreateEventPage que irá mostrar:
- ✅ Se o eventId é um UUID válido
- ✅ Número de fotos já carregadas
- ✅ Progresso do upload em tempo real
- ✅ Logs detalhados no console
- ✅ Resultado específico de cada tentativa

## Para Testar:

### 1. **Acesse a Criação de Evento**
```
http://localhost:5182/create-event
```

### 2. **Complete os Passos até "Photos"**
- Preencha Detalhes Básicos
- Escolha Template
- Complete Personalização
- **Clique em "Criar Evento"**
- Volte para a aba "Photos"

### 3. **Use o Componente de Debug**
Na seção "Photos", você verá duas áreas:
- **PhotoGallery original** (interface normal)
- **🧪 Teste de Upload de Fotos** (componente de debug)

### 4. **Teste com o Debug Component**
1. Selecione uma imagem no input de teste
2. Clique em "Testar Upload"
3. Observe os logs no console do navegador (F12)
4. Veja o resultado no componente

## Possíveis Cenários:

### ✅ **Cenário 1: UUID Válido + Modo Simulado**
```
EventId: bdfe8f59-6229-47bd-8a20-c8a920ed6ab8
É UUID válido: ✅
Console: "⚠️ Supabase Storage não configurado. Usando modo simulado."
Resultado: ✅ Upload bem-sucedido (local)
```

### ❌ **Cenário 2: UUID Inválido**
```
EventId: new-event
É UUID válido: ❌
Console: "⚠️ EventId inválido (não é UUID). Usando modo simulado"
Resultado: ✅ Upload bem-sucedido (local) ou ❌ falha
```

### ❌ **Cenário 3: Erro de Execução**
```
Console: Erro específico (network, permissions, etc.)
Resultado: ❌ Upload falhou com detalhes do erro
```

### ✅ **Cenário 4: Supabase Funcionando**
```
Console: "✅ Foto salva no Supabase: arquivo.png"
Resultado: ✅ Upload bem-sucedido (Supabase real)
```

## Debug Console Esperado:

### Logs Normais (Modo Simulado):
```
🧪 TESTE: Iniciando upload de imagem.jpg
🧪 TESTE: EventId utilizado: bdfe8f59-6229-47bd-8a20-c8a920ed6ab8
🧪 TESTE: É UUID válido: true
⚠️ Supabase Storage não configurado. Usando modo simulado.
💡 Erro detectado: Bucket not found
📷 Foto salva localmente (modo simulado): imagem.jpg
🧪 TESTE: Upload bem-sucedido: {id: '...', url: 'blob:...'}
```

### Logs de Erro:
```
🧪 TESTE: Erro no upload: [detalhes específicos]
```

## Para Corrigir Upload Real (Supabase):

### 1. **Criar Bucket no Supabase**
- Ir para Supabase Dashboard → Storage
- Criar bucket "event-photos"
- Configurar como público

### 2. **Executar Migration SQL**
- Ir para SQL Editor no Supabase
- Executar conteúdo de `migrations/002_add_photos_and_dynamic_content.sql`

### 3. **Configurar Políticas**
- Executar `storage_policies.sql` no SQL Editor

## Resultado Esperado:
Após o teste, você deve conseguir identificar exatamente onde está o problema e ver os uploads funcionando pelo menos em modo simulado (local).