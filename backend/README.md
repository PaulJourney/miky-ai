# Miky.ai Backend

REST API backend for Miky.ai - Ultra-Skilled AI Personas Platform

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Database setup:**
   ```bash
   # Run migrations
   npm run migrate
   
   # Optional: seed with sample data
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Server runs on: `http://localhost:3001`

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens (use a strong random string)
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key

### Email Configuration
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - From email address

### Optional
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `ADMIN_PASSWORD` - Admin dashboard password (default: 1234)

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Endpoints (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/credits` - Get credit balance

### Conversation Endpoints (Protected)
- `GET /api/conversations` - List user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get specific conversation
- `PUT /api/conversations/:id` - Update conversation title
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/search` - Search conversations

### Chat Endpoints (Protected)
- `POST /api/chat/send` - Send message and get AI response

### Payment Endpoints
- `POST /api/payments/create-subscription` - Create Stripe subscription
- `POST /api/payments/buy-credits` - Purchase credits
- `POST /api/payments/webhook` - Stripe webhook handler

### Referral Endpoints (Protected)
- `GET /api/referrals/stats` - Get referral statistics
- `POST /api/referrals/cashout` - Request cashout

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `PUT /api/admin/settings` - Update system settings

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

- **User** - User accounts, credits, plans, referrals
- **Conversation** - Chat conversations
- **Message** - Individual messages within conversations
- **Transaction** - Payment and credit transactions
- **Referral** - Referral tracking
- **AdminSetting** - System configuration

## AI Persona System

The system supports multiple AI personas with different costs and capabilities:

- **General** (1 credit) - Basic AI assistant
- **Academic** (2 credits) - Academic and research assistance
- **Marketer** (2 credits) - Marketing and business growth
- **Engineer** (2 credits) - Technical and coding help
- **Coach** (2 credits) - Life coaching and personal development
- **Sensei** (2 credits) - Relationship and social advice
- **Richman** (2 credits) - Business and wealth building
- **Lawyer** (3 credits) - Legal advice and document review [Plus+]
- **Medical** (3 credits) - Health and medical guidance [Plus+]
- **God Mode** (5 credits) - Philosophical and existential discussions [Plus+]

## Security Features

- JWT-based authentication with refresh tokens
- Email verification required
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection protection via Prisma ORM

## Deployment

### Production Setup

1. **Environment:**
   - Set `NODE_ENV=production`
   - Use secure JWT secrets
   - Configure production database
   - Set up proper SMTP service

2. **Database:**
   ```bash
   npm run migrate:prod
   ```

3. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

### Recommended Hosting
- **App**: Railway, Vercel, DigitalOcean App Platform
- **Database**: Railway PostgreSQL, Supabase, AWS RDS
- **File Storage**: AWS S3, Cloudinary (for future file uploads)

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run studio` - Open Prisma Studio
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Credits System

### Plan Credits
- **Free**: 100 credits/month
- **Plus**: 1,000 credits/month
- **Business**: 5,000 credits/month

### Credit Costs by Persona
- General: 1 credit
- Academic, Marketer, Engineer, Coach, Sensei, Richman: 2 credits
- Lawyer, Medical: 3 credits (Plus+ required)
- God Mode: 5 credits (Plus+ required)

### Additional Credits
Users can purchase additional credits that never expire.

## Referral System

- New users get 300 bonus credits when using a referral code
- Referrers earn $2 per successful signup
- Minimum cashout: $10
- Payments processed via PayPal (manual for now)

## Support

For technical issues or questions:
- Email: support@miky.ai
- Review logs for error details
- Check database connections
- Verify environment variables