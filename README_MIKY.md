# 🤖 Miky.ai - Ultra-Skilled AI Personas Platform

Welcome to Miky.ai, a sophisticated AI assistant platform featuring specialized AI personas for different domains and expertise areas.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Check environment status
bash check-env.sh

# Start database (requires Docker)
npm run docker:up

# Setup backend database
cd backend && npx prisma generate && npx prisma migrate dev && npm run seed

# Start development servers
npm run backend:dev  # Terminal 1 - Backend API
npm run dev          # Terminal 2 - Frontend App
```

### 2. Configure API Keys
Edit `backend/.env` with your actual API keys:
- **OpenAI**: Get from https://platform.openai.com/api-keys
- **Stripe**: Get from https://dashboard.stripe.com/apikeys  
- **Email SMTP**: Configure for user verification

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database UI**: `npm run db:studio`

## 🤖 AI Personas

### Free Personas
- **Academic**: Research and academic writing assistance
- **Marketer**: Marketing strategies and brand growth
- **Engineer**: Technical help and code review
- **Coach**: Personal development and life coaching
- **Sensei**: Relationship and interpersonal dynamics

### Plus Personas (Paid Plans)
- **Lawyer**: Legal advice and contract analysis
- **Medical**: Health tips and wellness guidance
- **God Mode**: Deep philosophical and existential questions

## 🎯 Features

### User Features
- **Multi-language Support**: English, Italian, Spanish, German
- **Voice Input**: Browser-based speech recognition
- **File Upload**: Images, documents, PDFs
- **Conversation History**: Organized by persona
- **Credit System**: Usage-based pricing
- **Referral Program**: Earn credits and cash rewards

### Plans & Pricing
- **Free**: 100 credits/month, basic personas
- **Plus**: 1,000 credits/month, all personas, voice input
- **Business**: 5,000 credits/month, priority support

### Admin Dashboard
- User management and analytics
- Payment and subscription tracking
- Content and persona configuration
- System settings and monitoring

## 🛠️ Technical Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/ui** component library
- **Multi-language** i18n support

### Backend
- **Node.js/Express** API server
- **PostgreSQL** with Prisma ORM
- **JWT** authentication
- **Stripe** payment processing
- **OpenAI** integration
- **Email** verification system

### Infrastructure
- **Docker** for local development
- **GitHub Pages** deployment ready
- **Environment-based** configuration
- **Rate limiting** and security

## 📚 Documentation

- **[Development Guide](./DEVELOPMENT_GUIDE.md)**: Complete setup and workflow
- **[Backend Setup](./BACKEND_SETUP.md)**: Database and API configuration
- **[Development Status](./DEVELOPMENT_STATUS.md)**: Current project status

## 🔧 Development Scripts

```bash
# Frontend
npm run dev              # Start development server
npm run build           # Build for production

# Backend  
npm run backend:dev     # Start backend development
npm run backend:build   # Build backend

# Database
npm run db:migrate      # Run migrations
npm run db:studio       # Open database UI
npm run db:seed         # Seed test data

# Docker
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
```

## 🌐 Live Demo

The application supports full production deployment with:
- Secure authentication and payments
- Real-time AI conversations
- Multi-tenant user management
- Comprehensive admin controls

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the future of AI assistance