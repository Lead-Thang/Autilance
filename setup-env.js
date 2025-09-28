#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envLocalPath)) {
  console.log('.env.local already exists. Skipping creation.');
  process.exit(0);
}

// Read the example file
const envExamplePath = path.join(__dirname, '.env.example');
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

// Write to .env.local
fs.writeFileSync(envLocalPath, envExampleContent);

console.log('.env.local has been created from .env.example');
console.log('Please update the values in .env.local with your actual configuration.');