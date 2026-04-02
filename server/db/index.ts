import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db: SqlJsDatabase | null = null;
let dbPath: string = '';

export async function getDb(): Promise<SqlJsDatabase> {
  if (!db) {
    dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'alecia.db');
    
    const dataDir = dirname(dbPath);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    
    const SQL = await initSqlJs();
    
    if (existsSync(dbPath)) {
      const buffer = readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

export function saveDb(): void {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(dbPath, buffer);
  }
}

export async function initDb(): Promise<void> {
  const database = await getDb();
  
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  
  database.run(schema);
  saveDb();
  console.log('✅ Base de données initialisée');
}

export function closeDb(): void {
  if (db) {
    saveDb();
    db.close();
    db = null;
    console.log('🔒 Base de données fermée');
  }
}

export function runQuery(sql: string, params?: unknown[]): void {
  if (db) {
    db.run(sql, params as (string | number | null | Uint8Array)[]);
    saveDb();
  }
}

export function execQuery<T>(sql: string, params?: unknown[]): T[] {
  if (!db) return [];
  
  const stmt = db.prepare(sql);
  if (params) {
    stmt.bind(params as (string | number | null | Uint8Array)[]);
  }
  
  const results: T[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row as T);
  }
  stmt.free();
  return results;
}

export function getOne<T>(sql: string, params?: unknown[]): T | null {
  const results = execQuery<T>(sql, params);
  return results[0] || null;
}
