#!/usr/bin/env node

// Use ES modules approach to get the current directory
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if .env.local already exists
const envLocalPath = join(__dirname, '.env.local');

if (existsSync(envLocalPath)) {
  console.log('.env.local already exists. Skipping creation.');
  process.exit(0);
}

// Read the example file
const envExamplePath = join(__dirname, '.env.example');
const envExampleContent = readFileSync(envExamplePath, 'utf8');

// Write to .env.local
writeFileSync(envLocalPath, envExampleContent);

console.log('.env.local has been created from .env.example');
console.log('Please update the values in .env.local with your actual configuration.');