#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment configuration...\n');

// Check required files
const requiredFiles = [
  'netlify.toml',
  'next.config.js',
  '.nvmrc',
  '_headers',
  '_redirects'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

console.log('✅ All required configuration files are present');

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start'];
const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

if (missingScripts.length > 0) {
  console.error('❌ Missing required scripts in package.json:');
  missingScripts.forEach(script => console.error(`   - ${script}`));
  process.exit(1);
}

console.log('✅ All required npm scripts are present');

// Check API routes
const apiDir = 'src/app/api';
if (fs.existsSync(apiDir)) {
  const apiRoutes = fs.readdirSync(apiDir, { recursive: true })
    .filter(file => file.endsWith('route.ts') || file.endsWith('route.js'));

  console.log(`✅ Found ${apiRoutes.length} API routes`);
  apiRoutes.forEach(route => console.log(`   - ${route}`));
} else {
  console.log('⚠️  No API routes directory found');
}

// Check environment variables template
if (fs.existsSync('.env.example')) {
  console.log('✅ Environment variables template found');
} else {
  console.log('⚠️  No .env.example file found');
}

console.log('\n🚀 Deployment configuration check completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Ensure all environment variables are set in Netlify dashboard');
console.log('2. Verify custom domain (miky.ai) is configured');
console.log('3. Check that HTTPS/SSL certificate is active');
console.log('4. Test API routes after deployment');
