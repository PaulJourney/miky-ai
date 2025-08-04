#!/usr/bin/env node

/**
 * Health Check Script for Miky.ai
 * 
 * Verifies that all services are running and properly configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkService(host, port) {
  return new Promise((resolve) => {
    const req = http.request({ host, port, timeout: 1000 }, () => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

function checkDocker(service) {
  try {
    const result = execSync(`docker-compose ps ${service}`, { encoding: 'utf8', stdio: 'pipe' });
    return result.includes('Up');
  } catch {
    return false;
  }
}

async function healthCheck() {
  log('cyan', '🏥 Miky.ai Health Check\n');

  let allGood = true;

  // Check environment files
  log('blue', '📋 Environment Configuration:');
  
  const envFiles = [
    { path: '.env', required: false },
    { path: 'backend/.env', required: true }
  ];

  for (const file of envFiles) {
    if (fs.existsSync(file.path)) {
      log('green', `   ✅ ${file.path} exists`);
    } else if (file.required) {
      log('red', `   ❌ ${file.path} missing (required)`);
      allGood = false;
    } else {
      log('yellow', `   ⚠️  ${file.path} missing (optional)`);
    }
  }

  // Check Docker services
  log('blue', '\n🐳 Docker Services:');
  
  const dockerServices = ['postgres', 'redis'];
  for (const service of dockerServices) {
    if (checkDocker(service)) {
      log('green', `   ✅ ${service} container running`);
    } else {
      log('yellow', `   ⚠️  ${service} container not running`);
    }
  }

  // Check database connection
  log('blue', '\n🗄️  Database:');
  try {
    process.chdir('backend');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'ignore' });
    log('green', '   ✅ PostgreSQL connection successful');
  } catch {
    log('red', '   ❌ PostgreSQL connection failed');
    allGood = false;
  }

  // Check network services
  log('blue', '\n🌐 Network Services:');
  
  const services = [
    { name: 'PostgreSQL', host: 'localhost', port: 5432 },
    { name: 'Redis', host: 'localhost', port: 6379 },
    { name: 'Backend API', host: 'localhost', port: 3001 },
    { name: 'Frontend', host: 'localhost', port: 5173 }
  ];

  for (const service of services) {
    const isUp = await checkService(service.host, service.port);
    if (isUp) {
      log('green', `   ✅ ${service.name} (${service.host}:${service.port})`);
    } else {
      log('red', `   ❌ ${service.name} (${service.host}:${service.port})`);
      if (service.name === 'PostgreSQL' || service.name === 'Backend API') {
        allGood = false;
      }
    }
  }

  // Check Node.js dependencies
  log('blue', '\n📦 Dependencies:');
  
  try {
    const frontendPackage = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    log('green', `   ✅ Frontend dependencies (${Object.keys(frontendPackage.dependencies || {}).length} packages)`);
  } catch {
    log('red', '   ❌ Frontend package.json not found');
    allGood = false;
  }

  try {
    const backendPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log('green', `   ✅ Backend dependencies (${Object.keys(backendPackage.dependencies || {}).length} packages)`);
  } catch {
    log('red', '   ❌ Backend package.json not found');
    allGood = false;
  }

  // Summary
  log('blue', '\n📊 Summary:');
  if (allGood) {
    log('green', '   🎉 All critical services are healthy!');
    log('cyan', '\n   Ready for development:');
    log('cyan', '   • Frontend: npm run dev');
    log('cyan', '   • Backend: npm run backend:dev');
    log('cyan', '   • Database Studio: npm run db:studio');
  } else {
    log('red', '   ❌ Some critical services need attention');
    log('yellow', '\n   Troubleshooting:');
    log('yellow', '   • Run setup: npm run setup');
    log('yellow', '   • Start Docker: npm run docker:up');
    log('yellow', '   • Check logs: npm run docker:logs');
    log('yellow', '   • Reset database: npm run db:reset');
  }

  return allGood;
}

// Run health check
healthCheck().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  log('red', `❌ Health check failed: ${error.message}`);
  process.exit(1);
});