# Memneo Backend - Sistema de Flashcards

Este é o backend do sistema de flashcards Memneo, desenvolvido com Node.js, Express e MongoDB.

## 📋 Funcionalidades

- **Autenticação de usuários** (registro e login)
- **Gerenciamento de flashcards** (CRUD completo)
- **Categorias** para organizar os flashcards
- **Sessões de estudo** com tracking de performance
- **Analytics avançados** com várias consultas
- **Sistema de performance** e progresso do usuário

## 🚀 Como executar

### Pré-requisitos
- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
MONGODB_URI=mongodb://localhost:27017/memneo
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
PORT=5000
NODE_ENV=development
```

3. Popule o banco de dados com dados de exemplo:
```bash
npm run seed
```

4. Inicie o servidor:
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Obter perfil (autenticado)
- `PUT /api/users/profile` - Atualizar perfil (autenticado)
- `GET /api/users/stats` - Estatísticas do usuário (autenticado)

### Flashcards
- `GET /api/flashcards` - Listar flashcards (com filtros)
- `GET /api/flashcards/:id` - Obter flashcard por ID
- `POST /api/flashcards` - Criar flashcard (autenticado)
- `PUT /api/flashcards/:id` - Atualizar flashcard (autenticado)
- `DELETE /api/flashcards/:id` - Deletar flashcard (autenticado)
- `PATCH /api/flashcards/:id/performance` - Atualizar performance
- `GET /api/flashcards/study/random` - Flashcards aleatórios para estudo

### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Obter categoria por ID
- `POST /api/categories` - Criar categoria (autenticado)
- `PUT /api/categories/:id` - Atualizar categoria (autenticado)
- `DELETE /api/categories/:id` - Deletar categoria (autenticado)
- `GET /api/categories/:id/stats` - Estatísticas da categoria
- `GET /api/categories/:id/flashcards` - Flashcards da categoria

### Sessões de Estudo
- `POST /api/sessions/start` - Iniciar sessão (autenticado)
- `PUT /api/sessions/:id/finish` - Finalizar sessão (autenticado)
- `GET /api/sessions/my-sessions` - Minhas sessões (autenticado)
- `GET /api/sessions/:id` - Detalhes da sessão (autenticado)
- `GET /api/sessions/stats/overview` - Estatísticas das sessões (autenticado)
- `DELETE /api/sessions/:id` - Deletar sessão (autenticado)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard geral
- `GET /api/analytics/categories-stats` - Estatísticas das categorias
- `GET /api/analytics/frequent-sessions` - Sessões mais frequentes
- `GET /api/analytics/top-users` - Usuários com melhor taxa de acerto
- `GET /api/analytics/most-missed-cards` - Cartões mais errados
- `GET /api/analytics/progress-over-time` - Progresso ao longo do tempo
- `GET /api/analytics/user-report/:userId` - Relatório do usuário (autenticado)

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer seu_jwt_token_aqui
```

## 📊 Consultas Analytics Implementadas

1. **Categorias com mais acertos/erros** - Ranking das categorias por performance
2. **Sessões mais frequentes** - Usuários e categorias com mais sessões de estudo
3. **Usuário com melhor taxa de acerto** - Top 10 usuários por accuracy
4. **Cartões mais errados** - Flashcards com maior taxa de erro
5. **Progresso ao longo do tempo** - Evolução da performance por período

## 🗃️ Estrutura do Banco de Dados

### Entidades principais:
- **Users** - Usuários do sistema
- **Flashcards** - Cartões de estudo
- **Categories** - Categorias para organizar flashcards
- **StudySessions** - Sessões de estudo dos usuários
- **Performance** - Registro diário de performance dos usuários

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **cors** - Política de CORS
- **dotenv** - Variáveis de ambiente

## 📝 Próximos Passos

- [ ] Implementar sistema de badges/conquistas
- [ ] Adicionar notificações push
- [ ] Sistema de ranking global
- [ ] Integração com calendário de estudos
- [ ] API de importação/exportação de flashcards
