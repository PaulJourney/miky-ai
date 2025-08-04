# Database Configuration Guide

This guide will help you set up PostgreSQL for the Miky.ai backend.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- Git

## Quick Setup (Recommended)

1. **Start the database containers:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Manual PostgreSQL Setup

If you prefer to install PostgreSQL manually:

1. **Install PostgreSQL 15+**
2. **Create database:**
   ```sql
   CREATE DATABASE mikyai_db;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE mikyai_db TO postgres;
   ```

3. **Update DATABASE_URL in backend/.env:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/mikyai_db?schema=public"
   ```

## Environment Variables

### Backend (.env)
Copy `backend/.env.example` to `backend/.env` and update these required values:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string for JWT tokens
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key (for payments)
- `SMTP_*`: Email configuration for notifications

### Frontend (.env)
Copy `.env.example` to `.env` and update:

- `VITE_API_URL`: Backend API URL (http://localhost:3001/api)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## Database Schema

The database includes these main tables:

- **users**: User accounts, plans, credits, referrals
- **conversations**: Chat conversations with AI personas
- **messages**: Individual messages in conversations
- **transactions**: Payment and credit transactions
- **referrals**: Referral relationships and rewards
- **admin_settings**: Configurable application settings

## Test Accounts

The seed script creates test accounts:

1. **Admin Account:**
   - Email: support@miky.ai
   - Password: 1234
   - Plan: Business (10,000 credits)

2. **Demo Account:**
   - Email: demo@miky.ai
   - Password: demo123
   - Plan: Plus (500 credits)

## Useful Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View PostgreSQL logs
docker-compose logs postgres

# Access database shell
docker-compose exec postgres psql -U postgres -d mikyai_db

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate new migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

## Troubleshooting

### Port Conflicts
If port 5432 is already in use:
1. Stop existing PostgreSQL service
2. Or change port in docker-compose.yml and update DATABASE_URL

### Connection Issues
1. Ensure PostgreSQL container is running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Verify DATABASE_URL format

### Migration Errors
1. Reset database: `npx prisma migrate reset`
2. Regenerate client: `npx prisma generate`
3. Re-run migrations: `npx prisma migrate dev`

## Production Deployment

For production:

1. Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
2. Update DATABASE_URL with production credentials
3. Run: `npx prisma migrate deploy`
4. Ensure all environment variables are properly set
5. Use Redis for caching (optional but recommended)

## Security Notes

- Change default passwords in production
- Use environment variables for all secrets
- Enable SSL for database connections in production
- Regularly backup your database
- Monitor database performance and queries