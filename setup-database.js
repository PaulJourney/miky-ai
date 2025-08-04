#!/usr/bin/env node

/**
 * Database Setup Script for Miky.ai
 * 
 * This script helps set up the PostgreSQL database and environment
 * for both development and production environments.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function setupDatabase() {
  log('cyan', '🚀 Miky.ai Database Setup Starting...\n');

  // Check prerequisites
  log('blue', '📋 Checking prerequisites...');
  
  if (!checkCommand('node')) {
    log('red', '❌ Node.js is not installed. Please install Node.js 18+ first.');
    process.exit(1);
  }
  
  if (!checkCommand('docker')) {
    log('yellow', '⚠️  Docker not found. You can still proceed with manual PostgreSQL setup.');
  }

  // Check if we're in the right directory
  if (!fs.existsSync('backend/package.json')) {
    log('red', '❌ Please run this script from the project root directory.');
    process.exit(1);
  }

  // Create environment files if they don't exist
  log('blue', '📝 Setting up environment files...');
  
  const backendEnvExample = 'backend/.env.example';
  const backendEnv = 'backend/.env';
  const frontendEnvExample = '.env.example';
  const frontendEnv = '.env';

  if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvExample)) {
    fs.copyFileSync(backendEnvExample, backendEnv);
    log('green', '✅ Created backend/.env from example');
  }

  if (!fs.existsSync(frontendEnv) && fs.existsSync(frontendEnvExample)) {
    fs.copyFileSync(frontendEnvExample, frontendEnv);
    log('green', '✅ Created .env from example');
  }

  // Install backend dependencies
  log('blue', '📦 Installing backend dependencies...');
  try {
    process.chdir('backend');
    execSync('npm install', { stdio: 'inherit' });
    log('green', '✅ Backend dependencies installed');
  } catch (error) {
    log('red', '❌ Failed to install backend dependencies');
    process.exit(1);
  }

  // Start Docker containers if Docker is available
  if (checkCommand('docker') && checkCommand('docker-compose')) {
    log('blue', '🐳 Starting Docker containers...');
    try {
      process.chdir('..');
      execSync('docker-compose up -d postgres redis', { stdio: 'inherit' });
      log('green', '✅ Docker containers started');
      
      // Wait for PostgreSQL to be ready
      log('yellow', '⏳ Waiting for PostgreSQL to be ready...');
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        try {
          execSync('docker-compose exec -T postgres pg_isready -U postgres', { stdio: 'ignore' });
          break;
        } catch {
          attempts++;
          if (attempts >= maxAttempts) {
            log('red', '❌ PostgreSQL failed to start within 60 seconds');
            process.exit(1);
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      log('green', '✅ PostgreSQL is ready!');
      process.chdir('backend');
    } catch (error) {
      log('yellow', '⚠️  Failed to start Docker containers. Please start PostgreSQL manually.');
    }
  }

  // Generate Prisma client
  log('blue', '🔧 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('green', '✅ Prisma client generated');
  } catch (error) {
    log('red', '❌ Failed to generate Prisma client');
    process.exit(1);
  }

  // Run database migrations
  log('blue', '🗄️  Running database migrations...');
  try {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    log('green', '✅ Database migrations completed');
  } catch (error) {
    log('yellow', '⚠️  Migration failed. This might be normal if database already exists.');
  }

  // Seed the database
  log('blue', '🌱 Seeding database with initial data...');
  try {
    execSync('npm run seed', { stdio: 'inherit' });
    log('green', '✅ Database seeded successfully');
  } catch (error) {
    log('yellow', '⚠️  Database seeding failed. You can run "npm run seed" manually later.');
  }

  // Final instructions
  log('green', '\n🎉 Database setup completed successfully!\n');
  
  log('blue', '📋 Next Steps:');
  log('cyan', '   1. Update backend/.env with your actual API keys:');
  log('cyan', '      - OPENAI_API_KEY (required for AI responses)');
  log('cyan', '      - STRIPE_SECRET_KEY (required for payments)');
  log('cyan', '      - Email configuration (SMTP_* variables)');
  log('cyan', '   2. Start the backend server: npm run dev');
  log('cyan', '   3. Start the frontend: cd .. && npm run dev');
  
  log('blue', '\n🔗 Useful Commands:');
  log('cyan', '   • View database: npx prisma studio');
  log('cyan', '   • Reset database: npx prisma migrate reset');
  log('cyan', '   • View logs: docker-compose logs postgres');
  log('cyan', '   • Stop containers: docker-compose down');
  
  log('blue', '\n🌐 Test Accounts:');
  log('cyan', '   • Admin: support@miky.ai / 1234');
  log('cyan', '   • Demo: demo@miky.ai / demo123');
  
  log('blue', '\n📊 Services:');
  log('cyan', '   • Backend API: http://localhost:3001');
  log('cyan', '   • Frontend: http://localhost:5173');
  log('cyan', '   • PostgreSQL: localhost:5432');
  log('cyan', '   • Prisma Studio: http://localhost:5555');
}

// Run the setup
setupDatabase().catch(error => {
  log('red', `❌ Setup failed: ${error.message}`);
  process.exit(1);
});