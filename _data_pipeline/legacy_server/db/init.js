/**
 * Database initialization script
 */

import { initDatabase } from './database.js';

console.log('🔄 Initializing database...');

try {
  initDatabase();
  console.log('✅ Database ready');
  process.exit(0);
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}
