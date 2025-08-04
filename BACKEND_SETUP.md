# Miky.ai Backend Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose (recommended) or PostgreSQL installed locally
- API keys for OpenAI and Stripe

### 2. Environment Setup

The backend is already configured with necessary dependencies. Follow these steps:

#### Step 1: Configure Environment Variables
Update the `backend/.env` file with your actual API keys:

```bash
# OpenAI API (Required for AI responses)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_test_your-actual-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-actual-webhook-secret-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-actual-stripe-publishable-key-here

# Email Configuration (Required for user verification)
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-actual-app-password
```

#### Step 2: Start Database
Option A - Using Docker (Recommended):
```bash
docker-compose up -d postgres redis
```

Option B - Local PostgreSQL:
Ensure PostgreSQL is running with:
- Database: `mikyai_db`
- User: `postgres` 
- Password: `password`
- Port: `5432`

#### Step 3: Setup Database Schema
```bash
cd backend
npm run generate
npm run migrate
npm run seed
```

#### Step 4: Start Development Server
```bash
cd backend
npm run dev
```

## 🔑 API Keys Setup

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy and paste into `OPENAI_API_KEY` in `.env`

### Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy the secret key (starts with `sk_test_`)
3. For webhook secret, create a webhook endpoint in Stripe dashboard
4. Update the keys in `.env`

### Email Configuration
For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app password
3. Use your Gmail address and app password

## 🌐 API Endpoints

Once running, the backend will be available at `http://localhost:3001`

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### Chat & Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `POST /api/chat/message` - Send message to AI

### Payments
- `POST /api/payments/create-subscription` - Create subscription
- `POST /api/payments/buy-credits` - Purchase credits
- `POST /api/payments/webhook` - Stripe webhook

### Admin
- `GET /api/admin/stats` - Admin dashboard statistics
- `GET /api/admin/users` - User management
- `PUT /api/admin/settings` - Update settings

## 🛠️ Development Tools

### Prisma Studio
View and edit database data:
```bash
cd backend
npm run studio
```
Access at: http://localhost:5555

### Database Management
```bash
# View current migrations
npm run migrate:status

# Reset database (development only)
npm run migrate:reset

# Create new migration
npm run migrate:dev --name migration-name
```

## 🔧 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `mikyai_db`

### Missing Dependencies
```bash
cd backend
npm install
```

### Prisma Client Issues
```bash
cd backend
npm run generate
```

### API Key Issues
- Verify keys are correctly copied (no extra spaces)
- Check API key permissions and limits
- Ensure keys are for the correct environment (test vs live)

## 📝 Next Steps

After setup:
1. Test API endpoints using Prisma Studio or Postman
2. Verify email sending functionality
3. Test Stripe payment integration
4. Configure frontend to connect to backend API

## 🚨 Security Notes

- Never commit real API keys to version control
- Use test keys for development
- Generate new JWT secrets for production
- Set up proper CORS origins
- Enable rate limiting for production

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
npm run studio       # Open Prisma Studio
npm run seed         # Seed database with test data
npm run test         # Run tests
npm run lint         # Lint code
```