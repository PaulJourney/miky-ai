#!/bin/bash

# Miky.ai Environment Validation Script
echo "🔍 Miky.ai Development Environment Check"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        return 1
    fi
}

check_env_var() {
    if grep -q "^$1=" backend/.env && ! grep -q "^$1=your-" backend/.env && ! grep -q "^$1=sk-your-" backend/.env; then
        echo -e "${GREEN}✅${NC} $2 configured"
        return 0
    else
        echo -e "${YELLOW}⚠️ ${NC} $2 needs configuration"
        return 1
    fi
}

echo ""
echo "📂 File Structure Check:"
check_file "backend/package.json" "Backend package.json"
check_file "backend/.env" "Environment configuration"
check_file "backend/prisma/schema.prisma" "Database schema"
check_file "package.json" "Frontend package.json"
check_file "docker-compose.yml" "Docker configuration"

echo ""
echo "📦 Dependencies Check:"
check_dir "backend/node_modules" "Backend dependencies"
check_dir "node_modules" "Frontend dependencies"
check_dir "backend/node_modules/.prisma" "Prisma client generated"

echo ""
echo "🔑 API Keys Check:"
if [ -f "backend/.env" ]; then
    check_env_var "OPENAI_API_KEY" "OpenAI API Key"
    check_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key"
    check_env_var "SMTP_USER" "Email SMTP User"
    check_env_var "SMTP_PASS" "Email SMTP Password"
else
    echo -e "${RED}❌${NC} Environment file not found"
fi

echo ""
echo "🐳 Docker Check:"
if command -v docker >/dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Docker available"
    if docker-compose ps postgres 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}✅${NC} PostgreSQL container running"
    else
        echo -e "${YELLOW}⚠️ ${NC} PostgreSQL container not running"
        echo "   Start with: npm run docker:up"
    fi
else
    echo -e "${YELLOW}⚠️ ${NC} Docker not available (manual PostgreSQL setup needed)"
fi

echo ""
echo "🚀 Quick Start Commands:"
echo "1. Configure API keys: edit backend/.env"
echo "2. Start database: npm run docker:up"
echo "3. Setup database: cd backend && npx prisma generate && npx prisma migrate dev"
echo "4. Start backend: npm run backend:dev"
echo "5. Start frontend: npm run dev"

echo ""
echo "📚 Documentation:"
echo "• Development Guide: ./DEVELOPMENT_GUIDE.md"
echo "• Backend Setup: ./BACKEND_SETUP.md"
echo "• Environment Status: ./DEVELOPMENT_STATUS.md"

echo ""
echo "🌐 URLs (when running):"
echo "• Frontend: http://localhost:5173"
echo "• Backend: http://localhost:3001"
echo "• Database UI: http://localhost:5555"