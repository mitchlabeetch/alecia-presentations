import { initDb } from './index.js';
import { mkdirSync } from 'fs';
import { join } from 'path';

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch {
  // Directory might already exist
}

// Initialize database
initDb();
console.log('🎉 Database initialization complete!');
