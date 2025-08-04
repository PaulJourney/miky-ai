# Backend Development Strategy for Miky.ai

## Architettura Scelta: Node.js + Express + PostgreSQL

### Stack Tecnologico:
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL (per gestire utenti, conversazioni, referral, pagamenti)
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe Integration
- **AI Integration**: OpenAI API (GPT-4/GPT-4-mini)
- **Email**: SendGrid/Nodemailer
- **Hosting**: Railway/Vercel/DigitalOcean
- **CDN**: Cloudflare (per performance globali)

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- first_name (String)
- last_name (String)
- credits (Integer, Default: 100)
- plan (Enum: 'free', 'plus', 'business')
- referral_code (String, Unique)
- referred_by (UUID, Foreign Key)
- referrals_count (Integer, Default: 0)
- cash_earned (Decimal, Default: 0)
- cash_paid_out (Decimal, Default: 0)
- language (String, Default: 'en')
- created_at (Timestamp)
- updated_at (Timestamp)
- email_verified (Boolean, Default: false)
- stripe_customer_id (String)
- subscription_id (String)
- subscription_status (String)

### Conversations Table
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (String)
- persona (Enum: 'academic', 'marketer', 'engineer', 'coach', 'sensei', 'lawyer', 'medical', 'god-mode', 'richman', 'general')
- created_at (Timestamp)
- updated_at (Timestamp)

### Messages Table
- id (UUID, Primary Key)
- conversation_id (UUID, Foreign Key)
- content (Text)
- sender (Enum: 'user', 'assistant')
- persona (String)
- credits_consumed (Integer)
- created_at (Timestamp)

### Transactions Table
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- type (Enum: 'subscription', 'credits', 'referral', 'cashout')
- amount (Decimal)
- credits (Integer)
- stripe_payment_intent_id (String)
- status (Enum: 'pending', 'completed', 'failed')
- created_at (Timestamp)

### Referrals Table
- id (UUID, Primary Key)
- referrer_id (UUID, Foreign Key)
- referred_id (UUID, Foreign Key)
- credits_awarded (Integer, Default: 300)
- cash_awarded (Decimal, Default: 2.00)
- created_at (Timestamp)

### Admin_Settings Table
- id (UUID, Primary Key)
- key (String, Unique)
- value (JSON)
- updated_at (Timestamp)

## API Endpoints Structure

### Authentication
- POST `/api/auth/signup`
- POST `/api/auth/signin`
- POST `/api/auth/verify-email`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- POST `/api/auth/refresh-token`
- POST `/api/auth/logout`

### User Management
- GET `/api/user/profile`
- PUT `/api/user/profile`
- GET `/api/user/credits`
- POST `/api/user/verify-referral`

### Conversations
- GET `/api/conversations`
- POST `/api/conversations`
- GET `/api/conversations/:id`
- PUT `/api/conversations/:id`
- DELETE `/api/conversations/:id`
- POST `/api/conversations/:id/messages`

### AI Chat
- POST `/api/chat/send`
- POST `/api/chat/voice-to-text`

### Payments (Stripe)
- POST `/api/payments/create-subscription`
- POST `/api/payments/update-subscription`
- POST `/api/payments/cancel-subscription`
- POST `/api/payments/buy-credits`
- POST `/api/payments/webhook`

### Referrals
- GET `/api/referrals/stats`
- POST `/api/referrals/cashout`
- GET `/api/referrals/share-link`

### Admin
- GET `/api/admin/stats`
- GET `/api/admin/users`
- PUT `/api/admin/users/:id`
- GET `/api/admin/conversations`
- GET `/api/admin/transactions`
- PUT `/api/admin/settings`

## Development Steps

### Phase 1: Core Backend Setup
1. Initialize Node.js + Express project
2. Setup PostgreSQL database
3. Create database migrations
4. Implement authentication system
5. Create basic API structure

### Phase 2: Core Features
1. User registration/login with email verification
2. Basic conversation/message CRUD
3. AI integration with OpenAI
4. Credit system implementation
5. Referral system

### Phase 3: Payment Integration
1. Stripe integration for subscriptions
2. Credit purchasing system
3. Webhook handling
4. Referral payouts

### Phase 4: Admin Features
1. Admin dashboard API
2. User management
3. Analytics and reporting
4. Content management

### Phase 5: Production & Optimization
1. Rate limiting and security
2. Caching (Redis)
3. Monitoring and logging
4. Performance optimization
5. Deployment and CI/CD

## Security Considerations
- JWT token validation
- Rate limiting per user/IP
- SQL injection protection
- CORS configuration
- Environment variables for secrets
- Password strength validation
- Email verification mandatory
- Admin access protection

## Integration with Frontend
- Replace useKV with actual API calls
- Add loading states and error handling
- Implement authentication context
- Add real-time features (WebSocket for chat)
- Offline support considerations