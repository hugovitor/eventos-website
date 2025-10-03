# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Sistema de Eventos Personalizados

Sistema web em React com Supabase para criação de páginas de eventos (aniversários e casamentos) com funcionalidades completas de gestão de convidados, lista de presentes e sistema de assinaturas.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Sistema completo de cadastro e login
- **Criação de Eventos**: Interface intuitiva para criar eventos personalizados
- **Personalização**: Cores, logos, fotos e layout customizáveis
- **Lista de Convidados**: Gestão completa com confirmação de presença
- **Lista de Presentes**: Sistema de reserva de presentes pelos convidados
- **Páginas Públicas**: URLs personalizadas para cada evento
- **Sistema de Assinaturas**: Integração com Stripe (mensal ou por evento)
- **Dashboard Administrativo**: Visão geral para proprietários do produto

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Pagamentos**: Stripe (planejado)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── ui/              # Componentes reutilizáveis
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/
│   └── useAuth.tsx      # Hook de autenticação
├── lib/
│   └── supabase.ts      # Configuração do Supabase
├── pages/
│   ├── LoginPage.tsx    # Página de login/cadastro
│   ├── DashboardPage.tsx # Dashboard do usuário
│   ├── CreateEventPage.tsx # Criação de eventos
│   └── PublicEventPage.tsx # Página pública do evento
├── utils/
│   └── cn.ts           # Utilitário para classes CSS
└── App.tsx             # Componente principal
```

## 🗄️ Estrutura do Banco de Dados

O arquivo `database.sql` contém todas as tabelas necessárias:

- **users**: Informações dos usuários
- **events**: Dados dos eventos
- **guests**: Lista de convidados
- **gifts**: Lista de presentes
- **subscriptions**: Informações de assinatura

## ⚙️ Configuração

### 1. Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

### 2. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `database.sql` no SQL Editor do Supabase
3. Configure as políticas de segurança (RLS)
4. Atualize as credenciais em `src/lib/supabase.ts` se necessário

### 3. Instalação

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://jesmcxructompxtawfhx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Como Usar

### 1. Cadastro/Login
- Acesse a aplicação
- Crie uma conta ou faça login
- Será redirecionado para o dashboard

### 2. Criar Evento
- No dashboard, clique em "Novo Evento"
- Preencha as informações básicas
- Personalize cores e layout
- Salve o evento

### 3. Gerenciar Evento
- Adicione convidados
- Configure lista de presentes
- Publique o evento
- Compartilhe a URL pública

### 4. Página Pública
- Acesse via `/event/:eventId`
- Convidados podem confirmar presença
- Sistema de reserva de presentes
- Layout personalizado

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📋 Próximas Funcionalidades

- [ ] Integração completa com Stripe
- [ ] Upload de imagens para Supabase Storage
- [ ] Dashboard administrativo
- [ ] Sistema de templates
- [ ] Notificações por email
- [ ] Análises e relatórios
- [ ] App mobile (React Native)
- [ ] Integração com redes sociais

## 🛡️ Segurança

O sistema utiliza:
- Row Level Security (RLS) do Supabase
- Autenticação JWT
- Validação de dados no frontend e backend
- Políticas de acesso granulares

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
