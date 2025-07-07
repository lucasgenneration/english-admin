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

### 🎯 Gerenciamento de Vocabulary Challenge
- **Sistema completo de CRUD** para desafios de vocabulário
- **Categorias temáticas** com 10 opções pré-definidas
- **Biblioteca de ícones** com 75+ opções organizadas por categorias
- **Gestão de perguntas** com 4 opções de resposta
- **Busca e filtros** para navegação eficiente
- **Compatibilidade com Next.js 15** (Promise-based params)
- **Exibição padronizada** com título em inglês primeiro, português segundo

### 🔐 Sistema de Autenticação
- Login apenas para administradores (isAdmin: true)
- Proteção de todas as rotas administrativas
- Logout com limpeza de sessão

### 📊 Dashboard
- Estatísticas gerais do aplicativo
- Total de usuários e usuários ativos
- Total de conteúdos de estudo
- Conteúdos completados pelos usuários
- Estatísticas de Vocabulary Challenge
- Categorias e perguntas cadastradas

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
│   ├── vocabulary/          # Gerenciamento de Vocabulary Challenge
│   │   ├── page.tsx         # Listagem de categorias
│   │   ├── new/             # Criar nova categoria
│   │   └── [id]/            # Gerenciar perguntas
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
│   ├── firebase-admin.ts    # Configuração Firebase Admin
│   └── icons.ts             # Biblioteca de ícones (75+ opções)
├── services/
│   ├── userService.ts       # Operações de usuários
│   ├── studyContentService.ts # Operações de conteúdo
│   └── vocabularyService.ts # Operações de Vocabulary Challenge
└── types/
    ├── user.ts              # Tipos de usuário
    ├── study-content.ts     # Tipos de conteúdo
    └── vocabulary.ts        # Tipos de Vocabulary Challenge
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
6. **Vocabulary Challenge** sincroniza categorias e perguntas
7. **Ícones customizados** são aplicados automaticamente

## 🚀 Deploy no Cloudflare Pages

### Passo 1: Configurar no Cloudflare Dashboard

1. Acesse [Cloudflare Pages](https://pages.cloudflare.com)
2. Clique em "Create a project"
3. Conecte sua conta do GitHub
4. Selecione o repositório `english-admin`
5. Configure as seguintes opções:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:deploy`
   - **Build output directory**: `.vercel/output/static`
   - **Environment variables**: Adicione todas as variáveis do `.env.example`

### Passo 2: Variáveis de Ambiente no Cloudflare

No dashboard do Cloudflare Pages, vá em Settings > Environment variables e adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY=seu_valor_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_valor_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_valor_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_valor_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_valor_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=seu_valor_aqui
FIREBASE_PROJECT_ID=seu_valor_aqui
FIREBASE_CLIENT_EMAIL=seu_valor_aqui
FIREBASE_PRIVATE_KEY=sua_chave_privada_aqui
```

**Importante**: Para `FIREBASE_PRIVATE_KEY`, certifique-se de incluir as quebras de linha `\n` corretamente.

### Passo 3: Configurar Domínio Customizado

1. No dashboard do projeto, vá em "Custom domains"
2. Adicione `english.genneration.group`
3. Siga as instruções para configurar o DNS

### Build Local para Teste

```bash
# Testar build do Cloudflare localmente
npm run pages:deploy

# Executar em modo dev com Cloudflare
npm run pages:dev
```

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com a equipe de desenvolvimento.

## 📋 Changelog Recente

### v1.3.0 (07/07/2025)
- **🎯 Vocabulary Challenge CRUD**: Sistema completo de gerenciamento
- **🔧 Next.js 15 Compatibility**: Correção de params Promise-based
- **🔍 Sistema de Busca**: Filtros para categorias de vocabulário
- **🎨 Biblioteca de Ícones**: 75+ ícones organizados por categorias
- **📝 Gestão de Perguntas**: Interface completa para criar/editar perguntas
- **🌐 Padronização**: Títulos em inglês primeiro, português segundo
- **🔄 Fixes de Layout**: Correções de SafeArea e AppBar transparente
- **⚡ Otimizações**: Melhor handling de contexto em diálogos

## 📄 Licença

Todos os direitos reservados © 2024 English Group Genneration

---

**Desenvolvido com ❤️ usando Next.js 15 e TypeScript**