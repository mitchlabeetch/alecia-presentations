import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { initDb, closeDb, resetDb } from '../server/db';
import path from 'path';
import fs from 'fs';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.APP_PIN_CODE = '1234';
process.env.APP_MASTER_PASSWORD = 'test-master-password';
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Ensure test database directory exists
const testDbDir = path.join(process.cwd(), 'test-data');
if (!fs.existsSync(testDbDir)) {
  fs.mkdirSync(testDbDir, { recursive: true });
}

process.env.DATABASE_PATH = path.join(testDbDir, 'test.db');

beforeAll(async () => {
  // Initialize test database
  initDb();
  console.log('Test database initialized');
});

afterEach(() => {
  // Reset database after each test for isolation
  resetDb();
});

afterAll(async () => {
  // Clean up
  await closeDb();
  console.log('Test database closed');

  // Clean up test database file
  const testDbPath = process.env.DATABASE_PATH;
  if (testDbPath && fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  // Clean up test data directory
  if (fs.existsSync(testDbDir)) {
    fs.rmSync(testDbDir, { recursive: true, force: true });
  }
});

// Mock console.error to reduce noise in tests
vi.spyOn(console, 'error').mockImplementation((...args) => {
  // Allow important errors through
  if (args[0]?.toString().includes('Error') || args[0]?.toString().includes('FAIL')) {
    console.log('[Test Error]', ...args);
  }
});
