/**
 * Database connection and utilities
 * Uses better-sqlite3 for synchronous, high-performance SQLite operations
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../../data/alecia.db');

// Ensure data directory exists
const dataDir = dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database with schema
 */
export function initDatabase() {
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Split schema into individual statements and execute
  const statements = schema.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement + ';');
    }
  }
  
  console.log('✅ Database initialized successfully');
}

/**
 * Get database instance
 */
export function getDb() {
  return db;
}

/**
 * Run a query with parameters
 */
export function query(sql, params = []) {
  return db.prepare(sql).all(params);
}

/**
 * Run a single query with parameters
 */
export function queryOne(sql, params = []) {
  return db.prepare(sql).get(params);
}

/**
 * Execute an INSERT/UPDATE/DELETE statement
 */
export function run(sql, params = []) {
  return db.prepare(sql).run(params);
}

/**
 * Execute within a transaction
 */
export function transaction(fn) {
  return db.transaction(fn);
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  db.close();
}

export default db;
