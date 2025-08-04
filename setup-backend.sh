#!/bin/bash

# Miky.ai Backend Setup Script for Development Environment
echo "🚀 Setting up Miky.ai Backend Environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the correct directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is available (optional for development)
if command_exists docker; then
    echo "🐘 Docker found. Starting PostgreSQL and Redis containers..."
    
    # Start containers
    docker-compose up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
            echo "✅ PostgreSQL is ready!"
            break
        fi
        echo "⏳ PostgreSQL is starting up... (attempt $((attempt + 1))/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ PostgreSQL failed to start within expected time"
        exit 1
    fi
else
    echo "⚠️  Docker not found. Please ensure PostgreSQL is running on localhost:5432"
    echo "   Database: mikyai_db"
    echo "   User: postgres"
    echo "   Password: password"
fi

# Go to backend directory
cd backend

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
else
    echo "✅ Node.js dependencies already installed"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npm run seed

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update backend/.env with your actual API keys:"
echo "      - OPENAI_API_KEY: Get from https://platform.openai.com/api-keys"
echo "      - STRIPE_SECRET_KEY: Get from https://dashboard.stripe.com/apikeys"
echo "      - SMTP configuration for email sending"
echo ""
echo "   2. Start the development server:"
echo "      cd backend && npm run dev"
echo ""
echo "🔗 Useful commands:"
echo "   • View database: cd backend && npm run studio"
echo "   • Check logs: docker-compose logs postgres"
echo "   • Reset database: cd backend && npx prisma migrate reset"
echo ""
echo "🌐 Services will be available at:"
echo "   • Backend API: http://localhost:3001"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo "   • Prisma Studio: http://localhost:5555"