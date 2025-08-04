#!/bin/bash

# Miky.ai Backend Setup Script
echo "🚀 Setting up Miky.ai Backend Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual configuration values"
fi

# Start PostgreSQL and Redis containers
echo "🐘 Starting PostgreSQL and Redis containers..."
cd ..
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "⏳ PostgreSQL is starting up..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Go back to backend directory
cd backend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

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
echo "   1. Update the .env file with your actual API keys and configuration"
echo "   2. Start the development server: npm run dev"
echo "   3. Access Prisma Studio: npm run studio"
echo ""
echo "🔗 Useful commands:"
echo "   • Start containers: docker-compose up -d"
echo "   • Stop containers: docker-compose down"
echo "   • View logs: docker-compose logs postgres"
echo "   • Database shell: docker-compose exec postgres psql -U postgres -d mikyai_db"
echo ""
echo "🌐 Services:"
echo "   • Backend API: http://localhost:3001"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo "   • Prisma Studio: http://localhost:5555"