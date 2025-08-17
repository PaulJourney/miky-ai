#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify deployment process...\n');

// Check if we're in the right directory
if (!fs.existsSync('netlify.toml')) {
  console.error('❌ Error: netlify.toml not found. Make sure you\'re in the project root.');
  process.exit(1);
}

try {
  // Step 1: Clean previous build
  console.log('🧹 Cleaning previous build...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Step 2: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Step 3: Build project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Check if build was successful
  if (!fs.existsSync('.next')) {
    throw new Error('Build failed - .next directory not created');
  }
  
  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Next steps for deployment:');
  console.log('1. Push to GitHub: git push origin main');
  console.log('2. Or deploy manually to Netlify:');
  console.log('   - Drag and drop the .next folder to Netlify');
  console.log('   - Or use Netlify CLI: netlify deploy --prod --dir=.next');
  
  // Step 5: Create deployment package
  console.log('\n📦 Creating deployment package...');
  execSync('zip -r deployment-package.zip .next netlify.toml _headers _redirects', { stdio: 'inherit' });
  
  console.log('\n🎉 Deployment package created: deployment-package.zip');
  console.log('📁 You can now upload this to Netlify manually or push to GitHub for automatic deployment.');
  
} catch (error) {
  console.error('\n❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

