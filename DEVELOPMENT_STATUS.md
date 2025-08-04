# Development Configuration

## Backend API Configuration

The backend server will run on `http://localhost:3001` when started with `npm run dev`.

### Required API Keys

To get the backend fully functional, you'll need the following API keys:

#### 1. OpenAI API Key
- **Purpose**: Powers all AI responses from the personas
- **Where to get**: https://platform.openai.com/api-keys
- **Format**: `sk-proj-...` or `sk-...`
- **Environment variable**: `OPENAI_API_KEY`

#### 2. Stripe API Keys
- **Purpose**: Handles subscription payments and credit purchases
- **Where to get**: https://dashboard.stripe.com/apikeys
- **Required keys**:
  - Secret Key: `STRIPE_SECRET_KEY` (starts with `sk_test_`)
  - Publishable Key: `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
  - Webhook Secret: `STRIPE_WEBHOOK_SECRET` (configure webhook endpoint)

#### 3. Email SMTP Configuration
- **Purpose**: User email verification and password resets
- **Gmail setup**:
  - Enable 2FA on your Google account
  - Generate an App Password
  - Use your Gmail address and app password
- **Environment variables**:
  - `SMTP_USER`: Your email address
  - `SMTP_PASS`: Your app password or email password

### Database Setup

The application uses PostgreSQL with Prisma ORM. The database schema includes:
- Users (authentication, credits, plans, referrals)
- Conversations and Messages
- Transactions (payments, credits)
- Admin Settings

### Frontend Integration

The frontend is configured to connect to the backend API. Key integration points:

1. **Authentication**: JWT-based auth with refresh tokens
2. **Chat System**: Real-time messaging with AI personas
3. **Payment System**: Stripe integration for subscriptions and credits
4. **User Management**: Profile, settings, conversation history

### Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev` (from root)
3. Access application: http://localhost:5173
4. Backend API: http://localhost:3001
5. Database UI: `cd backend && npm run studio`

### API Testing

You can test the API endpoints using:
- Prisma Studio for database operations
- Postman or similar for API testing
- Frontend application for end-to-end testing

### Environment Status

✅ Backend dependencies installed
✅ Environment configuration file created
✅ Database schema defined
⏳ Database needs to be started and migrated
⏳ API keys need to be configured
⏳ Development server needs to be started

### Next Steps

1. **Configure API Keys**: Update `backend/.env` with your actual API keys
2. **Start Database**: Run `docker-compose up -d postgres redis` or start local PostgreSQL
3. **Migrate Database**: Run `cd backend && npm run generate && npm run migrate && npm run seed`
4. **Start Backend**: Run `cd backend && npm run dev`
5. **Test Integration**: Use the frontend to test backend functionality

The backend includes comprehensive error handling, rate limiting, security middleware, and proper API documentation through the codebase.