# CLAUDE.md - Documentação Técnica do Admin Panel

## 🎯 Objetivo do Projeto

Sistema administrativo web completo para gerenciar o aplicativo "Inglês Diário" com foco em:
- Gerenciamento de usuários e conteúdo
- Interface intuitiva para administradores
- Integração em tempo real com o app Flutter
- Deploy em produção com Cloudflare Pages

## 🏗️ Arquitetura Atual

### Stack Tecnológica
```
Next.js 15 (App Router)
├── React 18
├── TypeScript
├── Tailwind CSS
├── Firebase Admin SDK
├── Firebase Client SDK
├── Lucide React Icons
└── React Hot Toast
```

### Estrutura de Pastas
```
src/
├── app/                    # App Router Next.js 15
│   ├── login/              # Autenticação
│   ├── users/              # CRUD de usuários
│   ├── study-plans/        # Gerenciamento de conteúdo
│   ├── vocabulary/         # Vocabulary Challenge (NOVO)
│   ├── layout.tsx          # Layout global
│   └── page.tsx            # Dashboard
├── components/
│   ├── DashboardLayout.tsx # Layout administrativo
│   └── ProtectedRoute.tsx  # Proteção de rotas
├── lib/
│   ├── firebase.ts         # Cliente Firebase
│   ├── firebase-admin.ts   # Admin SDK
│   └── icons.ts            # Biblioteca de ícones (NOVO)
├── services/
│   ├── userService.ts      # Operações de usuários
│   ├── studyContentService.ts # Operações de conteúdo
│   └── vocabularyService.ts   # Vocabulary Challenge (NOVO)
└── types/
    ├── user.ts             # Tipos de usuário
    ├── study-content.ts    # Tipos de conteúdo
    └── vocabulary.ts       # Tipos de vocabulário (NOVO)
```

## 📋 Status do Desenvolvimento

### ✅ Funcionalidades Implementadas (v1.3.0)

#### Sistema de Autenticação
- [x] Firebase Auth com login administrativo
- [x] Verificação de permissão (isAdmin: true)
- [x] Proteção de todas as rotas
- [x] Logout com limpeza de sessão

#### CRUD de Usuários
- [x] Listagem com filtros e paginação
- [x] Visualização detalhada do perfil
- [x] Edição de dados pessoais
- [x] Controle de status premium
- [x] Exclusão de usuários
- [x] Estatísticas de XP, moedas e streak

#### Gerenciamento de Conteúdo (Study Plans)
- [x] Estrutura hierárquica (Pastas → Subpastas → Conteúdos)
- [x] CRUD completo para todos os níveis
- [x] Sistema de reordenação com botões up/down
- [x] Controle de conteúdo premium
- [x] Ícones e cores personalizáveis
- [x] Progress tracking automático

#### Vocabulary Challenge (NOVO - v1.3.0)
- [x] **Sistema completo de CRUD** para categorias
- [x] **Biblioteca de ícones** com 75+ opções organizadas
- [x] **Gerenciamento de perguntas** com interface intuitiva
- [x] **Sistema de busca** para navegação eficiente
- [x] **Compatibilidade Next.js 15** (Promise-based params)
- [x] **Padronização de display** (Inglês primeiro, Português segundo)
- [x] **10 categorias temáticas** pré-definidas
- [x] **Validação de formulários** com feedback visual
- [x] **Integração Firebase** com coleções otimizadas

#### Dashboard Administrativo
- [x] Estatísticas gerais do aplicativo
- [x] Total de usuários ativos
- [x] Conteúdos de estudo cadastrados
- [x] Progresso de usuários
- [x] Estatísticas de Vocabulary Challenge (NOVO)

## 🔧 Implementações Técnicas Detalhadas

### Next.js 15 Compatibility Fixes
```typescript
// Antes (Next.js 14)
function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// Depois (Next.js 15)
async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### Sistema de Ícones Organizados
```typescript
// lib/icons.ts
export const iconCategories = {
  general: ['Home', 'Settings', 'User', 'Info'],
  education: ['Book', 'GraduationCap', 'Brain', 'Lightbulb'],
  travel: ['Plane', 'MapPin', 'Globe', 'Camera'],
  food: ['UtensilsCrossed', 'Coffee', 'Pizza', 'Apple'],
  // ... mais 75+ ícones organizados
};
```

### VocabularyService (NOVO)
```typescript
class VocabularyService {
  // CRUD de categorias
  async getCategories(): Promise<VocabularyCategory[]>
  async createCategory(data: CreateCategoryData): Promise<string>
  async updateCategory(id: string, data: UpdateCategoryData): Promise<void>
  async deleteCategory(id: string): Promise<void>
  
  // CRUD de perguntas
  async getQuestions(categoryId: string): Promise<VocabularyQuestion[]>
  async createQuestion(data: CreateQuestionData): Promise<string>
  async updateQuestion(id: string, data: UpdateQuestionData): Promise<void>
  async deleteQuestion(id: string): Promise<void>
  
  // Busca e filtros
  async searchCategories(query: string): Promise<VocabularyCategory[]>
}
```

### Tipos TypeScript (NOVO)
```typescript
interface VocabularyCategory {
  id: string;
  titleEn: string;
  titlePt: string;
  icon: string;
  gradientColors: string[];
  totalLevels: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VocabularyQuestion {
  id: string;
  categoryId: string;
  level: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 UI/UX Improvements

### Biblioteca de Ícones Visual
- **75+ ícones Lucide React** organizados por categorias
- **Preview visual** com grade responsiva
- **Seleção intuitiva** com highlight e feedback
- **Categorização** (Geral, Educação, Viagem, Comida, etc.)

### Formulários Aprimorados
- **Validação em tempo real** com feedback visual
- **Loading states** durante submissão
- **Mensagens de erro** contextualizadas
- **Campos obrigatórios** claramente marcados

### Sistema de Busca
- **Filtro por nome** (inglês e português)
- **Busca instantânea** com debounce
- **Resultados destacados** com match highlighting
- **Estado vazio** com call-to-action

## 🔄 Integração com Flutter App

### Sincronização em Tempo Real
1. **Categorias criadas** aparecem imediatamente no app
2. **Perguntas editadas** refletem nas partidas
3. **Ordem das categorias** mantida consistente
4. **Status de ativação** controla visibilidade
5. **Ícones personalizados** renderizados corretamente

### Estrutura de Dados Firestore
```
vocabularyCategories/
  {categoryId}/
    - titleEn: "Home & Family"
    - titlePt: "Casa e Família"
    - icon: "Home"
    - gradientColors: ["#FF6B6B", "#4ECDC4"]
    - totalLevels: 3
    - order: 1
    - isActive: true

vocabularyQuestions/
  {questionId}/
    - categoryId: "home_family"
    - level: 1
    - questionText: "What do you call the room where you sleep?"
    - options: ["Bedroom", "Kitchen", "Bathroom", "Living Room"]
    - correctOptionIndex: 0
    - emoji: "🛏️"
    - difficulty: "easy"
```

## 🚀 Deploy e Infraestrutura

### Cloudflare Pages Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

### Environment Variables
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📊 Melhorias de Performance

### Otimizações Implementadas
- **Server-side rendering** para páginas estáticas
- **Client-side caching** com SWR pattern
- **Lazy loading** de componentes pesados
- **Debounced search** para reduzir calls API
- **Optimistic updates** para melhor UX

### Bundle Optimization
- **Tree shaking** automático do Next.js
- **Code splitting** por rota
- **Compression** automática do Cloudflare
- **Assets minification** em produção

## 🐛 Bugs Fixados (v1.3.0)

### Next.js 15 Compatibility
- **Promise-based params** em todas as rotas dinâmicas
- **Async/await** nos componentes que usam params
- **TypeScript errors** relacionados a mudanças de API

### Layout Issues
- **SafeArea handling** em componentes mobile-first
- **AppBar transparency** corrigida
- **Responsive design** melhorado para tablets

### Context Issues
- **Dialog context** separado do main context
- **Navigation context** preservado em modais
- **State management** otimizado

## 🔮 Próximos Passos

### Sprint 6 - Analytics e Reporting
- [ ] Dashboard com gráficos interativos
- [ ] Relatórios de performance por categoria
- [ ] Análise de dificuldade das perguntas
- [ ] Métricas de engajamento dos usuários

### Sprint 7 - Bulk Operations
- [ ] Importação em lote de perguntas (CSV/JSON)
- [ ] Operações em massa (ativar/desativar)
- [ ] Duplicação de categorias
- [ ] Backup e restore de dados

### Sprint 8 - Advanced Features
- [ ] Versionamento de conteúdo
- [ ] Aprovação de mudanças (workflow)
- [ ] Auditoria de ações administrativas
- [ ] Notificações push para admins

## 🔒 Segurança

### Implementações Atuais
- **Firebase Auth** com verificação de admin
- **Firestore Rules** restritivas
- **CORS configuration** adequada
- **Environment variables** seguras

### Medidas de Proteção
- **Rate limiting** implícito do Firebase
- **Input validation** em todos os formulários
- **XSS protection** via Next.js
- **CSRF protection** via SameSite cookies

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor local
npm run build           # Build para produção
npm run start           # Servidor de produção

# Deploy Cloudflare Pages
npm run pages:deploy    # Build otimizado para Pages
npm run pages:dev       # Dev com configuração Pages

# Manutenção
npm run lint            # Verificar code quality
npm run type-check      # Verificar tipos TypeScript
npm audit               # Verificar vulnerabilidades
```

## 📋 Changelog Detalhado

### v1.3.0 (07/07/2025)
#### 🎯 Vocabulary Challenge System
- **CRUD Completo**: Categorias e perguntas totalmente gerenciáveis
- **Interface Intuitiva**: Formulários validados e responsivos
- **Biblioteca de Ícones**: 75+ ícones organizados por categorias
- **Sistema de Busca**: Filtros instantâneos com debounce
- **Padronização**: Títulos em inglês primeiro, português segundo

#### 🔧 Technical Improvements
- **Next.js 15 Compatibility**: Todos os params Promise-based
- **TypeScript Strict**: Tipagem rigorosa em todo o projeto
- **Performance**: Otimizações de bundle e rendering
- **Error Handling**: Tratamento robusto de erros

#### 🎨 UI/UX Enhancements
- **Responsive Design**: Layout adaptável para todos os devices
- **Loading States**: Feedback visual em todas as operações
- **Form Validation**: Validação em tempo real com mensagens claras
- **Icon Library**: Interface visual para seleção de ícones

#### 🐛 Bug Fixes
- **SafeArea Issues**: Correção de layout em dispositivos mobile
- **AppBar Transparency**: Problema de sobreposição resolvido
- **Context Handling**: Melhor gestão de contexto em diálogos
- **Navigation**: Fluxo de navegação otimizado

---

**Última atualização**: 07/07/2025  
**Versão**: 1.3.0  
**Next.js**: 15.0.0  
**Deploy**: english.genneration.group (Cloudflare Pages)  
**Status**: Produção ✅  
**Maintainer**: Claude Assistant + Lucas