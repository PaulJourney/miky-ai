# 🤖 Miky.ai - Ultra-Skilled AI Personas Platform

Welcome to Miky.ai, a professional AI assistant platform featuring specialized personas for different domains. This full-stack application includes a React frontend, Node.js/Express backend, and PostgreSQL database.

## 🚀 Quick Start

### One-Command Setup
```bash
npm run setup
```

This will automatically:
- Start PostgreSQL and Redis containers
- Install all dependencies
- Set up the database schema
- Seed with test data
- Configure environment variables

### Manual Setup

1. **Prerequisites:**
   - Node.js 18+
   - Docker & Docker Compose
   - Git

2. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd miky-ai
   npm install
   cd backend && npm install && cd ..
   ```

3. **Database Setup:**
   ```bash
   npm run docker:up
   npm run db:migrate
   npm run db:seed
   ```

4. **Start Development:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   npm run backend:dev
   ```

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS v4 with shadcn/ui components
- **State:** React hooks with persistent KV storage
- **Animations:** Framer Motion
- **Internationalization:** Built-in i18n support (EN, IT, ES, DE)

### Backend (Node.js + Express)
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js with helmet, cors, rate limiting
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens with refresh token rotation
- **Payments:** Stripe integration
- **Email:** SMTP with nodemailer
- **AI:** OpenAI API integration

### Database (PostgreSQL)
- **Users:** Authentication, plans, credits, referrals
- **Conversations:** AI chat sessions with personas
- **Messages:** Individual chat messages with credit tracking
- **Transactions:** Payment and credit purchase history
- **Admin:** Configurable settings and content management

## 🎯 Features

### AI Personas
- **Academic:** Research and academic writing support
- **Engineer:** Code review and technical assistance  
- **Marketer:** Brand strategy and campaign planning
- **Coach:** Personal development and life coaching
- **Sensei:** Relationship and interpersonal advice
- **Lawyer:** Legal consultation and document review (Plus+)
- **Medical:** Health guidance and medical analysis (Plus+)
- **God Mode:** Philosophical and existential exploration (Plus+)
- **Richman:** Business ideas and wealth strategies

### User Management
- **Plans:** Free (100 credits), Plus ($19/1000 credits), Business ($49/5000 credits)
- **Authentication:** Email verification, password reset
- **Referrals:** $2 reward per successful referral, 300 bonus credits
- **Multilingual:** Full UI translation support

### Admin Dashboard
- **User Management:** View, suspend, modify credits
- **Content Management:** Edit personas, homepage text, SEO metadata
- **Configuration:** Feature flags, pricing, persona costs

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend
npm run backend:dev     # Start backend development server
npm run backend:build   # Build backend for production
npm run backend:start   # Start production backend

# Database
npm run db:migrate      # Run database migrations
npm run db:reset        # Reset database (destructive)
npm run db:seed         # Seed with test data
npm run db:studio       # Open Prisma Studio

# Docker
npm run docker:up       # Start PostgreSQL and Redis
npm run docker:down     # Stop all containers
npm run docker:logs     # View container logs

# Utilities
npm run setup           # Complete environment setup
npm run health          # Check all services status
```

### Environment Configuration

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

#### Backend (backend/.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/mikyai_db"
JWT_SECRET=your-super-secret-key
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
# ... see backend/.env.example for full configuration
```

### Test Accounts
- **Admin:** support@miky.ai / 1234 (Business plan, 10K credits)
- **Demo:** demo@miky.ai / demo123 (Plus plan, 500 credits)

## 📊 Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React development server |
| Backend API | http://localhost:3001 | Express API server |
| PostgreSQL | localhost:5432 | Main database |
| Redis | localhost:6379 | Caching and sessions |
| Prisma Studio | http://localhost:5555 | Database management UI |

## 🚀 Deployment

### Production Environment

1. **Database:** Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. **Environment:** Set production environment variables
3. **Migrations:** Run `npm run db:migrate:prod`
4. **Build:** `npm run build` for frontend, `npm run backend:build`
5. **SSL:** Enable HTTPS and database SSL connections

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
miky-ai/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   ├── contexts/               # React contexts (i18n, theme)
│   └── App.tsx                 # Main application
├── backend/                    # Backend Node.js application
│   ├── src/                   # Backend source code
│   ├── prisma/               # Database schema and migrations
│   └── package.json          # Backend dependencies
├── public/                    # Static assets
├── docker-compose.yml        # Development containers
├── setup-database.js        # Automated setup script
└── health-check.js          # Service health verification
```

## 🔒 Security Features

- **Authentication:** JWT with refresh tokens
- **Rate Limiting:** Protection against abuse
- **Input Validation:** Comprehensive request validation
- **CORS:** Configured for secure cross-origin requests
- **Helmet:** Security headers for Express
- **Password Hashing:** bcrypt with salt rounds
- **SQL Injection Prevention:** Prisma ORM protection

## 🌍 Internationalization

Supported languages with complete UI translation:
- **English** (en) - Default
- **Italiano** (it)
- **Español** (es) 
- **Deutsch** (de)

Add new languages by extending the translation files in `src/contexts/TranslationContext.tsx`.

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts:**
   ```bash
   # Kill processes on ports
   npm run kill
   fuser -k 3001/tcp  # Backend port
   ```

2. **Database Connection:**
   ```bash
   # Reset database
   npm run db:reset
   npm run db:migrate
   ```

3. **Service Health:**
   ```bash
   npm run health
   ```

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=miky:*
NODE_ENV=development
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- **Email:** support@miky.ai
- **Documentation:** See [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **Issues:** Create a GitHub issue for bugs or feature requests

---

**Built with ❤️ by the Miky.ai team**