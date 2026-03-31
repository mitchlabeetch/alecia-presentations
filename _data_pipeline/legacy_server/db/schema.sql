-- Database schema for Alecia Presentations

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_modified_by TEXT,
  template_id TEXT,
  settings_json TEXT,
  variables_json TEXT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (last_modified_by) REFERENCES users(id)
);

-- Slides table
CREATE TABLE IF NOT EXISTS slides (
  id TEXT PRIMARY KEY,
  presentation_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  content_json TEXT NOT NULL,
  layout_json TEXT,
  "order" INTEGER NOT NULL,
  is_hidden BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  slides_json TEXT NOT NULL,
  variables_json TEXT,
  settings_json TEXT,
  is_default BOOLEAN DEFAULT 0,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Assets table (images, logos)
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags_json TEXT,
  uploaded_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Variable presets table
CREATE TABLE IF NOT EXISTS variable_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  variables_json TEXT NOT NULL,
  is_default BOOLEAN DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Collaboration sessions table
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id TEXT PRIMARY KEY,
  presentation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  cursor_position_json TEXT,
  is_active BOOLEAN DEFAULT 1,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  presentation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_slides_presentation ON slides(presentation_id);
CREATE INDEX IF NOT EXISTS idx_slides_order ON slides("order");
CREATE INDEX IF NOT EXISTS idx_presentations_created_by ON presentations(created_by);
CREATE INDEX IF NOT EXISTS idx_presentations_updated ON presentations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_activity_presentation ON activity_log(presentation_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_session ON collaboration_sessions(presentation_id, user_id);
