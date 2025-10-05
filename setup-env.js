#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Handle __dirname for different environments
// For environments where __dirname is not available (like some deployment platforms),
// we fall back to process.cwd() which should be the project root
const currentDirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Check if .env.local already exists
const envLocalPath = path.join(currentDirname, '.env.local');

if (fs.existsSync(envLocalPath)) {
  console.log('.env.local already exists. Skipping creation.');
  process.exit(0);
}

// Read the example file
const envExamplePath = path.join(currentDirname, '.env.example');
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

// Write to .env.local
fs.writeFileSync(envLocalPath, envExampleContent);

console.log('.env.local has been created from .env.example');
console.log('Please update the values in .env.local with your actual configuration.');