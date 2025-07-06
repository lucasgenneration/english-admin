# English Admin Panel 🎛️

Painel administrativo para gerenciamento do aplicativo Inglês Diário, desenvolvido com Next.js 15 e TypeScript.

## 📋 Sobre o Projeto

Este é o sistema administrativo completo para gerenciar usuários, conteúdo e configurações do aplicativo Inglês Diário. Desenvolvido com as mais recentes tecnologias web para proporcionar uma experiência de gerenciamento eficiente e intuitiva.

## 🚀 Tecnologias

- **Next.js 15** com App Router
- **React 18** 
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Firebase Admin SDK** para operações privilegiadas
- **Firebase Client SDK** para autenticação
- **Lucide React** para ícones
- **React Hot Toast** para notificações
- **Date-fns** para formatação de datas

## ✨ Funcionalidades

### 👥 Gerenciamento de Usuários
- Listagem completa de usuários com filtros
- Visualização detalhada de perfil
- Edição de dados do usuário
- Controle de status premium
- Visualização de estatísticas (XP, moedas, streak, etc.)
- Exclusão de usuários

### 📚 Gerenciamento de Conteúdo (Study Plans)
- **Estrutura hierárquica em 3 níveis**:
  - Pastas (Study Folders)
  - Subpastas (Study Subfolders)  
  - Conteúdos (Study Contents)
- **CRUD completo** para todos os níveis
- **Reordenação drag-and-drop** com botões up/down
- **Sistema de ícones e cores** personalizáveis
- **Controle de conteúdo premium**
- **Progress tracking** automático

### 🔐 Sistema de Autenticação
- Login apenas para administradores (isAdmin: true)
- Proteção de todas as rotas administrativas
- Logout com limpeza de sessão

### 📊 Dashboard
- Estatísticas gerais do aplicativo
- Total de usuários e usuários ativos
- Total de conteúdos de estudo
- Conteúdos completados pelos usuários

## 🛠️ Instalação

```bash
# Clone o repositório
git clone git@github.com:lucasgenneration/english-admin.git

# Entre no diretório
cd english-admin

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em modo de desenvolvimento
npm run dev
```

### 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Firebase Client SDK (para autenticação)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (para operações privilegiadas)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## 📁 Estrutura do Projeto

```
src/
├── app/                      # App Router do Next.js 15
│   ├── (auth)/              # Grupo de rotas de autenticação
│   │   └── login/           # Tela de login
│   ├── users/               # Gerenciamento de usuários
│   │   ├── page.tsx         # Listagem
│   │   └── [id]/            # Detalhes/Edição
│   ├── study-plans/         # Gerenciamento de conteúdo
│   │   ├── page.tsx         # Listagem de pastas
│   │   ├── new/             # Criar nova pasta
│   │   ├── [id]/            # Subpastas
│   │   └── [id]/[subId]/    # Conteúdos
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Dashboard
│   └── globals.css          # Estilos globais
├── components/
│   ├── DashboardLayout.tsx  # Layout do admin
│   ├── ProtectedRoute.tsx   # Proteção de rotas
│   └── Sidebar.tsx          # Menu lateral
├── contexts/
│   └── AuthContext.tsx      # Contexto de autenticação
├── lib/
│   ├── firebase.ts          # Configuração Firebase Client
│   └── firebase-admin.ts    # Configuração Firebase Admin
├── services/
│   ├── userService.ts       # Operações de usuários
│   └── studyContentService.ts # Operações de conteúdo
└── types/
    ├── user.ts              # Tipos de usuário
    └── study-content.ts     # Tipos de conteúdo
```

## 🎨 UI/UX Features

- **Design moderno e limpo** com Tailwind CSS
- **Feedback visual** em todas as ações
- **Notificações toast** para sucesso/erro
- **Formulários validados** e responsivos
- **Tabelas com ações** inline
- **Confirmação de exclusão** com modal
- **Loading states** em todas as operações
- **Empty states** informativos
- **Breadcrumb navigation** para orientação

## 🔄 Integração com o App

O admin panel se integra perfeitamente com o aplicativo Flutter:

1. **Usuários criados/editados** refletem imediatamente no app
2. **Conteúdo organizado** aparece na estrutura correta
3. **Status premium** controla acesso no app
4. **Reordenação** mantém a ordem no app
5. **Estatísticas** são calculadas em tempo real

## 🚀 Deploy

O projeto está configurado para deploy no Vercel:

```bash
# Build de produção
npm run build

# Preview local da build
npm run start
```

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Todos os direitos reservados © 2024 English Group Genneration

---

**Desenvolvido com ❤️ usando Next.js 15 e TypeScript**