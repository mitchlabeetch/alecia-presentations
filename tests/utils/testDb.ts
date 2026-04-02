import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initTestDb() first.');
  }
  return db;
}

export function initTestDb(dbPath?: string): Database.Database {
  const testDbDir = path.join(process.cwd(), 'test-data');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }

  const finalDbPath = dbPath || path.join(testDbDir, `test-${Date.now()}.db`);
  db = new Database(finalDbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables based on schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      pin_code TEXT,
      is_template INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS slides (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      title TEXT,
      layout TEXT,
      background_color TEXT,
      background_image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      slide_id TEXT NOT NULL,
      type TEXT NOT NULL,
      position INTEGER NOT NULL,
      content TEXT,
      style TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (slide_id) REFERENCES slides(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      slide_id TEXT,
      user_id TEXT,
      user_name TEXT,
      content TEXT NOT NULL,
      position_x REAL,
      position_y REAL,
      resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT,
      type TEXT DEFAULT 'text',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      thumbnail TEXT,
      slides_data TEXT,
      is_builtin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS export_history (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      format TEXT NOT NULL,
      file_path TEXT,
      status TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  return db;
}

export function closeTestDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function createTestProject(overrides: Partial<{
  id: string;
  name: string;
  description: string;
  pin_code: string;
  is_template: number;
}> = {}): string {
  const projectDb = getDb();
  const id = overrides.id || uuidv4();
  const now = new Date().toISOString();

  projectDb.prepare(`
    INSERT INTO projects (id, name, description, pin_code, is_template, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    overrides.name || 'Test Project',
    overrides.description || 'Test Description',
    overrides.pin_code || null,
    overrides.is_template || 0,
    now,
    now
  );

  return id;
}

export function createTestSlide(projectId: string, overrides: Partial<{
  id: string;
  position: number;
  title: string;
  layout: string;
}> = {}): string {
  const projectDb = getDb();
  const id = overrides.id || uuidv4();
  const now = new Date().toISOString();
  const position = overrides.position ?? 0;

  projectDb.prepare(`
    INSERT INTO slides (id, project_id, position, title, layout, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    projectId,
    position,
    overrides.title || 'Test Slide',
    overrides.layout || 'blank',
    now,
    now
  );

  return id;
}

export function createTestBlock(slideId: string, overrides: Partial<{
  id: string;
  type: string;
  position: number;
  content: string;
  style: string;
}> = {}): string {
  const projectDb = getDb();
  const id = overrides.id || uuidv4();
  const now = new Date().toISOString();

  projectDb.prepare(`
    INSERT INTO blocks (id, slide_id, type, position, content, style, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    slideId,
    overrides.type || 'text',
    overrides.position ?? 0,
    overrides.content || '{}',
    overrides.style || '{}',
    now,
    now
  );

  return id;
}

export function createTestTemplate(overrides: Partial<{
  id: string;
  name: string;
  description: string;
  category: string;
  slides_data: string;
}> = {}): string {
  const projectDb = getDb();
  const id = overrides.id || uuidv4();
  const now = new Date().toISOString();

  projectDb.prepare(`
    INSERT INTO templates (id, name, description, category, slides_data, is_builtin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    overrides.name || 'Test Template',
    overrides.description || 'Template description',
    overrides.category || 'general',
    overrides.slides_data || '[]',
    0,
    now
  );

  return id;
}
