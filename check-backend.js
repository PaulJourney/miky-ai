const fs = require('fs');
const path = require('path');

console.log('🔍 Miky.ai Backend Development Status Check\n');

// Check if we're in the right directory
const backendDir = path.join(process.cwd(), 'backend');
if (!fs.existsSync(backendDir)) {
  console.log('❌ Backend directory not found. Please run from project root.');
  process.exit(1);
}

// Check backend package.json
const packageJsonPath = path.join(backendDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ Backend package.json found');
} else {
  console.log('❌ Backend package.json not found');
}

// Check node_modules
const nodeModulesPath = path.join(backendDir, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ Backend dependencies installed');
} else {
  console.log('❌ Backend dependencies not installed');
  console.log('   Run: cd backend && npm install');
}

// Check .env file
const envPath = path.join(backendDir, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Environment configuration file exists');
  
  // Check for important environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const checks = [
    { key: 'OPENAI_API_KEY', name: 'OpenAI API Key' },
    { key: 'STRIPE_SECRET_KEY', name: 'Stripe Secret Key' },
    { key: 'SMTP_USER', name: 'Email Configuration' },
    { key: 'DATABASE_URL', name: 'Database URL' }
  ];
  
  console.log('\n📋 Environment Variable Status:');
  checks.forEach(check => {
    const hasKey = envContent.includes(`${check.key}=`) && 
                   !envContent.includes(`${check.key}=your-`) &&
                   !envContent.includes(`${check.key}=sk-your-`);
    console.log(`   ${hasKey ? '✅' : '⚠️ '} ${check.name}: ${hasKey ? 'Configured' : 'Needs configuration'}`);
  });
} else {
  console.log('❌ Environment configuration file not found');
}

// Check Prisma schema
const prismaPath = path.join(backendDir, 'prisma', 'schema.prisma');
if (fs.existsSync(prismaPath)) {
  console.log('✅ Prisma database schema found');
} else {
  console.log('❌ Prisma database schema not found');
}

// Check if Prisma client is generated
const prismaClientPath = path.join(backendDir, 'node_modules', '.prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
  console.log('✅ Prisma client generated');
} else {
  console.log('⚠️  Prisma client not generated');
  console.log('   Run: cd backend && npx prisma generate');
}

console.log('\n🚀 Quick Start Commands:');
console.log('   1. Start database: docker-compose up -d postgres redis');
console.log('   2. Generate Prisma client: cd backend && npx prisma generate');
console.log('   3. Run migrations: cd backend && npx prisma migrate dev');
console.log('   4. Seed database: cd backend && npm run seed');
console.log('   5. Start backend: cd backend && npm run dev');
console.log('   6. Start frontend: npm run dev');

console.log('\n📚 Documentation:');
console.log('   • Backend Setup: ./BACKEND_SETUP.md');
console.log('   • Development Status: ./DEVELOPMENT_STATUS.md');
console.log('   • API Documentation: backend/README.md');

console.log('\n🌐 URLs (when running):');
console.log('   • Frontend: http://localhost:5173');
console.log('   • Backend API: http://localhost:3001');
console.log('   • Database UI: http://localhost:5555 (npm run studio)');