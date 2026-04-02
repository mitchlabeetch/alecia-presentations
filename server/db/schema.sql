-- ============================================
-- Alecia Presentations - Database Schema
-- ============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pin_hash TEXT,
  user_tag TEXT,
  target_company TEXT,
  target_sector TEXT,
  deal_type TEXT DEFAULT 'custom',
  potential_buyers TEXT DEFAULT '[]',
  key_individuals TEXT DEFAULT '[]',
  theme_primary_color TEXT DEFAULT '#061a40',
  theme_accent_color TEXT DEFAULT '#b80c09',
  theme_font_family TEXT DEFAULT 'Bierstadt',
  theme_logo_path TEXT,
  template_id TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Slides table
CREATE TABLE IF NOT EXISTS slides (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '{}',
  notes TEXT,
  image_path TEXT,
  data TEXT,
  docling_json TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom',
  slides TEXT NOT NULL DEFAULT '[]',
  is_custom INTEGER DEFAULT 0,
  thumbnail_path TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Deals table (from Datatable_Alecia CSV)
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  deal_id INTEGER NOT NULL,
  company TEXT NOT NULL,
  annee_deal INTEGER,
  type_deal TEXT,
  responsable_deal TEXT,
  equipier_deal TEXT,
  is_client_ou_contrepartie TEXT,
  description_deal TEXT,
  region_deal TEXT,
  sector_deal TEXT,
  taille_operation_m_euro REAL,
  ca_cible_m_euro REAL,
  afficher_site INTEGER DEFAULT 0,
  afficher_pitchdeck INTEGER DEFAULT 0,
  is_company INTEGER DEFAULT 1,
  is_alecia INTEGER DEFAULT 0,
  logo_filename TEXT
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  slide_id TEXT NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_tag TEXT,
  field TEXT,
  text TEXT NOT NULL,
  resolved INTEGER DEFAULT 0,
  ai_response TEXT,
  parent_comment_id TEXT REFERENCES comments(id),
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- AI Settings table
CREATE TABLE IF NOT EXISTS ai_settings (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  base_url TEXT,
  api_key TEXT,
  model TEXT NOT NULL,
  api_format TEXT DEFAULT 'openai',
  system_prompt_extra TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Variable presets table
CREATE TABLE IF NOT EXISTS variable_presets (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variables TEXT NOT NULL DEFAULT '[]',
  is_default INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_slides_project ON slides(project_id);
CREATE INDEX IF NOT EXISTS idx_slides_order ON slides(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_chat_project ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_slide ON comments(slide_id);
CREATE INDEX IF NOT EXISTS idx_deals_annee ON deals(annee_deal);
CREATE INDEX IF NOT EXISTS idx_deals_pitchdeck ON deals(afficher_pitchdeck);
CREATE INDEX IF NOT EXISTS idx_uploads_project ON uploads(project_id);
