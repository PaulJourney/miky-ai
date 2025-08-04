# 🚀 Miky.ai Full-Stack Development Setup

## Current Status

✅ **Frontend**: Fully developed React application with all features
✅ **Backend**: Complete Node.js/Express API with PostgreSQL database
✅ **Dependencies**: All packages installed and configured
⏳ **Database**: Needs to be started and migrated
⏳ **API Keys**: Need to be configured for full functionality

## Quick Start Guide

### 1. Start the Database

Option A - Using Docker (Recommended):
```bash
npm run docker:up
```

Option B - Manual PostgreSQL setup:
Ensure PostgreSQL is running with the credentials in `backend/.env`

### 2. Configure API Keys

Edit `backend/.env` and add your actual API keys:

```bash
# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-openai-api-key

# Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your-actual-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-actual-stripe-publishable-key

# Configure your email for user verification
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Setup Database Schema

```bash
# Generate Prisma client
cd backend && npx prisma generate

# Run database migrations
npm run db:migrate

# Seed with initial data
npm run db:seed
```

### 4. Start Development Servers

Terminal 1 - Backend:
```bash
npm run backend:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database UI**: `npm run db:studio` → http://localhost:5555

## 🔧 Development Workflow

### Available Scripts

```bash
# Frontend
npm run dev              # Start frontend development server
npm run build           # Build frontend for production

# Backend
npm run backend:dev     # Start backend development server
npm run backend:build   # Build backend for production
npm run backend:start   # Start production backend

# Database
npm run db:migrate      # Run database migrations
npm run db:reset        # Reset database (dev only)
npm run db:seed         # Seed database with test data
npm run db:studio       # Open Prisma Studio

# Docker
npm run docker:up       # Start PostgreSQL and Redis
npm run docker:down     # Stop containers
npm run docker:logs     # View container logs
```

### Development Features

1. **Frontend Features** (All implemented):
   - 8 AI Personas (Academic, Marketer, Engineer, Coach, Sensei, Lawyer, Medical, God Mode)
   - Multi-language support (English, Italian, Spanish, German)
   - Authentication system with email verification
   - Real-time chat interface with voice input
   - Subscription plans and credit system
   - Referral program
   - Admin dashboard
   - Mobile-responsive design

2. **Backend Features** (Ready to use):
   - JWT authentication with refresh tokens
   - OpenAI integration for AI responses
   - Stripe payment processing
   - Email verification system
   - Rate limiting and security middleware
   - Comprehensive API endpoints
   - PostgreSQL database with Prisma ORM

### API Endpoints

Once the backend is running:

```bash
# Authentication
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/verify-email
POST /api/auth/forgot-password

# Chat & AI
POST /api/chat/message
GET /api/conversations
POST /api/conversations

# Payments
POST /api/payments/create-subscription
POST /api/payments/buy-credits
POST /api/payments/webhook

# User Management
GET /api/user/profile
PUT /api/user/profile
GET /api/user/transactions

# Admin
GET /api/admin/stats
GET /api/admin/users
PUT /api/admin/settings
```

## 🔑 Required API Keys

### 1. OpenAI API Key
- **Purpose**: Powers all AI persona responses
- **Get it**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use, typically $0.002 per 1K tokens
- **Setup**: Create account → API keys → Create new secret key

### 2. Stripe API Keys
- **Purpose**: Handles subscriptions and credit purchases
- **Get it**: https://dashboard.stripe.com/apikeys
- **Keys needed**:
  - Secret key (for backend)
  - Publishable key (for frontend)
  - Webhook secret (for payment confirmations)
- **Setup**: Create Stripe account → Developers → API keys

### 3. Email SMTP Configuration
- **Purpose**: User email verification and password resets
- **Gmail setup**:
  1. Enable 2-factor authentication
  2. Go to Google Account settings
  3. Security → App passwords
  4. Generate app password for "Mail"
  5. Use Gmail address and app password

## 🐛 Troubleshooting

### Database Issues
```bash
# Check if containers are running
npm run docker:logs

# Reset database if needed
npm run db:reset

# Check database connection
cd backend && npx prisma studio
```

### Backend Issues
```bash
# Check if all dependencies are installed
cd backend && npm install

# Verify environment variables
cat backend/.env

# Check if backend is running
curl http://localhost:3001/health
```

### Frontend Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## 🚀 Production Deployment

The backend includes:
- Docker configuration for easy deployment
- Environment variable validation
- Security headers and rate limiting
- Database migrations for production
- Comprehensive error handling

See `backend/DEPLOYMENT.md` for production setup instructions.

## 📚 Additional Resources

- **Backend Documentation**: `backend/README.md`
- **API Documentation**: Available in backend source code
- **Database Schema**: `backend/prisma/schema.prisma`
- **Frontend Components**: `src/components/`

The application is now ready for full development and testing! 🎉