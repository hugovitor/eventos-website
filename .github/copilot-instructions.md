<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Sistema de Eventos Personalizados - Instruções de Desenvolvimento

Este projeto é um sistema web completo em React com Supabase para criação de páginas de eventos personalizados.

### Status do Projeto: ✅ CONCLUÍDO

- [x] **Estrutura do Projeto**: Vite + React + TypeScript configurado
- [x] **Autenticação**: Sistema completo com Supabase Auth
- [x] **Interface**: Componentes UI reutilizáveis com Tailwind CSS
- [x] **Páginas Principais**: Login, Dashboard, Criar Evento, Página Pública
- [x] **Banco de Dados**: Schema SQL completo para Supabase
- [x] **Roteamento**: React Router com proteção de rotas
- [x] **Build**: Projeto compila sem erros

### Funcionalidades Implementadas

1. **Autenticação e Usuários**
   - Sistema de cadastro e login
   - Context API para gerenciamento de estado
   - Proteção de rotas

2. **Gestão de Eventos**
   - Criação de eventos (aniversário/casamento)
   - Personalização de cores e layout
   - Dashboard com visão geral

3. **Páginas Públicas**
   - URLs personalizadas para eventos
   - Interface responsiva
   - Confirmação de presença
   - Sistema de reserva de presentes

4. **Infraestrutura**
   - Configuração completa do Supabase
   - Políticas de segurança (RLS)
   - Estrutura de banco otimizada

### Próximos Passos Sugeridos

1. **Integração Stripe**: Implementar sistema de pagamentos
2. **Upload de Imagens**: Configurar Supabase Storage
3. **Dashboard Admin**: Painel administrativo
4. **Templates**: Sistema de templates predefinidos
5. **Notificações**: Email e push notifications

### Como Executar

```bash
npm install
npm run dev
```

### Arquivos Importantes

- `src/lib/supabase.ts` - Configuração do Supabase
- `database.sql` - Schema completo do banco
- `src/hooks/useAuth.tsx` - Hook de autenticação
- `README.md` - Documentação completa