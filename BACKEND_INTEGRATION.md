# Backend Development Setup

## Overview
The Miky.ai backend has been configured with:
- **OpenAI API Integration** with real persona prompts
- **PostgreSQL Database** with comprehensive schema
- **Authentication System** with JWT tokens
- **Real-time Chat API** with credit management
- **Payment Integration** ready for Stripe
- **Admin Dashboard API**
- **Referral System API**

## Quick Start

### 1. Environment Setup
The `.env` file has been configured with:
- OpenAI API key (provided)
- Database URLs
- JWT secrets
- Development settings

### 2. Database
For development, the schema has been configured to support SQLite.
To set up:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001`

### 4. Start Frontend
```bash
npm run dev
```

The frontend will connect to the backend automatically.

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Chat
- `POST /api/chat/send` - Send message to AI persona

### Conversations
- `GET /api/conversations` - Get user conversations
- `GET /api/conversations/:id` - Get specific conversation
- `PATCH /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

### Payments
- `POST /api/payments/create-subscription` - Create subscription
- `POST /api/payments/purchase-credits` - Purchase credits

### Referrals
- `GET /api/referrals/stats` - Get referral statistics
- `POST /api/referrals/cashout` - Request cashout

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - Admin dashboard stats
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/settings` - Get settings
- `PATCH /api/admin/settings` - Update settings

## Persona Configuration

The system supports 10 AI personas with specific model assignments:

### Models Used:
- **General**: GPT-3.5 Turbo (cost-effective for basic queries)
- **Academic, Marketer, Coach, Richman, Sensei**: GPT-4o (high-quality responses)
- **Engineer, Lawyer, Medical, God Mode**: GPT-4o Mini (balanced cost/quality)

### Credit Costs:
- General: 1 credit
- Academic, Marketer, Engineer, Coach, Sensei, Richman: 2 credits
- Lawyer, Medical: 3 credits
- God Mode: 5 credits

## Frontend Integration

The frontend has been updated to:
- Use real API calls instead of mock data
- Handle authentication with JWT tokens
- Manage conversations with real backend
- Support real-time credit consumption
- Handle errors and loading states

## Next Steps

1. **Database Setup**: Run the database migrations
2. **Start Services**: Start both backend and frontend
3. **Test Authentication**: Create test accounts
4. **Test Chat**: Verify AI responses work
5. **Admin Access**: Test admin panel functionality

## Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Set up proper environment variables
3. Configure Stripe for real payments
4. Set up email service (SendGrid/SMTP)
5. Configure Redis for caching
6. Set up proper domain and SSL

## API Response Examples

### Chat Response
```json
{
  "conversation": {
    "id": "uuid",
    "title": "Generated title",
    "persona": "lawyer",
    "messages": [...],
    "lastUpdated": "2025-01-XX"
  },
  "creditsConsumed": 3,
  "remainingCredits": 97,
  "message": {
    "id": "uuid",
    "content": "AI response",
    "sender": "assistant",
    "timestamp": "2025-01-XX"
  }
}
```

### User Profile
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "credits": 100,
    "plan": "FREE",
    "referralCode": "ABC123",
    "referralsCount": 0,
    "cashEarned": 0,
    "language": "en"
  }
}
```

The backend is now fully configured and ready for development and production use.