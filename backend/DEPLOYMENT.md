# Production Deployment Guide for Miky.ai

## Overview
This guide covers deploying the Miky.ai backend to production using various hosting providers.

## Recommended Architecture

### Option 1: Railway (Recommended for simplicity)
- **App**: Railway (Node.js backend)
- **Database**: Railway PostgreSQL
- **Advantages**: Easy setup, built-in database, automatic deployments

### Option 2: Vercel + External Database
- **App**: Vercel (serverless functions)
- **Database**: Supabase or Railway PostgreSQL
- **Advantages**: Great performance, global CDN

### Option 3: DigitalOcean App Platform
- **App**: DigitalOcean App Platform
- **Database**: DigitalOcean Managed PostgreSQL
- **Advantages**: Full control, predictable pricing

## Pre-deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set in production:

```bash
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=super-secure-random-string-64-chars-minimum
REFRESH_TOKEN_SECRET=another-super-secure-random-string
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@miky.ai

# URLs
FRONTEND_URL=https://miky.ai
BACKEND_URL=https://api.miky.ai

# Other
NODE_ENV=production
PORT=3001
ADMIN_PASSWORD=secure-admin-password
```

### 2. Database Setup
```bash
# Run migrations in production
npm run migrate:prod

# Optional: Seed with initial data
npm run seed
```

### 3. Security Considerations
- Use strong, unique JWT secrets (64+ characters)
- Enable CORS only for your frontend domain
- Set up proper rate limiting
- Use HTTPS everywhere
- Regularly update dependencies

## Deployment Instructions

### Railway Deployment

1. **Create Railway Account**
   - Sign up at https://railway.app
   - Connect your GitHub account

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "Add Service"
   - Select "PostgreSQL"
   - Copy the connection string to `DATABASE_URL`

4. **Set Environment Variables**
   - Go to project settings
   - Add all required environment variables
   - Deploy again

### Vercel Deployment

1. **Prepare for Serverless**
   Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.ts"
       }
     ]
   }
   ```

2. **Deploy**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variables**
   - Use Vercel dashboard or CLI
   - Add external PostgreSQL database (Supabase recommended)

### DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Select Node.js environment

2. **Configure Build Settings**
   ```yaml
   name: miky-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/miky-ai
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
   ```

3. **Add Database**
   - Create managed PostgreSQL database
   - Add connection string to environment variables

## SSL/TLS Certificate

All hosting providers mentioned provide automatic SSL certificates. Ensure:
- HTTPS is enforced
- HTTP redirects to HTTPS
- Frontend uses HTTPS API URLs

## Domain Configuration

### Custom Domain Setup
1. **Add Domain to Hosting Provider**
   - Follow provider-specific instructions
   - Wait for DNS propagation

2. **Update Environment Variables**
   ```bash
   FRONTEND_URL=https://miky.ai
   BACKEND_URL=https://api.miky.ai
   ```

3. **Update CORS Settings**
   Ensure CORS allows your production domain.

## Monitoring and Logging

### Error Tracking
Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

### Performance Monitoring
- New Relic
- DataDog
- Railway/Vercel built-in monitoring

### Database Monitoring
- Monitor connection pool usage
- Track slow queries
- Set up automated backups

## Backup Strategy

### Database Backups
```bash
# Daily automated backups (set up via cron or hosting provider)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### File Backups
- Environment variable configurations
- SSL certificates (if self-managed)
- Application logs

## Scaling Considerations

### Horizontal Scaling
- Use load balancer if needed
- Consider Redis for session storage
- Implement database read replicas

### Vertical Scaling
- Monitor CPU and memory usage
- Upgrade instance sizes as needed
- Optimize database queries

## Security Hardening

### Additional Security Measures
1. **Rate Limiting**
   ```typescript
   // Increase rate limits for production
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 1000, // Increase for production
     message: 'Too many requests'
   });
   ```

2. **Helmet Configuration**
   ```typescript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"]
       }
     }
   }));
   ```

3. **CORS Configuration**
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
     optionsSuccessStatus: 200
   }));
   ```

## Post-Deployment Testing

### Health Checks
```bash
# Test API health
curl https://api.miky.ai/health

# Test authentication
curl -X POST https://api.miky.ai/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Load Testing
Use tools like:
- Artillery
- Apache Bench (ab)
- Postman/Newman

### Integration Testing
- Test Stripe webhooks
- Verify email sending
- Test AI API integration

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate secrets quarterly
- Monitor error rates and performance
- Review user feedback and feature requests

### Database Maintenance
- Regular VACUUM and ANALYZE
- Monitor index usage
- Optimize slow queries
- Plan for data archival

## Rollback Strategy

### Blue-Green Deployment
- Keep previous version running
- Test new version thoroughly
- Switch traffic only when confident
- Keep rollback plan ready

### Database Migrations
- Always backup before migrations
- Test migrations on staging first
- Use reversible migrations when possible
- Monitor application after migrations

## Support and Monitoring

### Alerting
Set up alerts for:
- High error rates (>5%)
- Response time > 2 seconds
- Database connection issues
- Payment processing failures

### Log Analysis
- Centralize logs (ELK stack, Splunk)
- Monitor API usage patterns
- Track user behavior
- Identify performance bottlenecks

This completes the production deployment guide. Follow these steps carefully and test thoroughly in a staging environment before deploying to production.