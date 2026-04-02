# Alecia Presentations — Implementation Roadmap

## From Current State to Client-Ready Deployment

**Document Version**: 2.0  
**Date**: 2026-04-02  
**Status**: Master Planning Document — KEY PRINCIPLES COMPLIANT  
**Target**: Production-ready, client-handoff deploy with FULL ALECIA BRANDING

---

## Executive Summary

This roadmap transitions the Alecia Presentations project from its current ~70% completion state (scattered across 3 former projects with INCORRECT branding) to a fully functional, client-ready M&A pitch deck builder with **COMPLETE ALECIA BRAND IDENTITY**.

**Current Reality**: Features exist but are not integrated, connected, or correctly branded. Former projects used:
- ❌ Project 1: Navy `#1a3a5c`, Gold `#c9a84c` — **WRONG**
- ❌ Project 2: Navy `#0a1628`, Pink `#e91e63` — **WRONG**  
- ❌ Project 3: Same as Project 1 — **WRONG**

**Target State**: Self-hosted, PIN-protected, 100% French-language tool with:
- ✅ **Alecia Navy** `#061a40` (946 uses in reference deck)
- ✅ **Alecia Red** `#b80c09` (35 uses)
- ✅ **Bierstadt font** for presentations
- ✅ **Inter font** for UI chrome
- ✅ **Ampersand `&`** watermark on every slide

**Design References** (NOT from `Reference_for_Blocks/` which will be removed):
- `ALECIA_DESIGN_SYSTEM.md` — Typography, colors, layout patterns
- `BLOCK_LIBRARY.md` — Component specifications, spacing, block definitions
- `alecia_components_spec.json` — Canvas dimensions, responsive tokens

**Branding Assets** (from `Reference_for_branding/`):
- `alecia.png` — Logo for UI and PPTX export
- `color_palette_analysis.json` — 24-color verified palette
- `2510 - Projet XXX - Pitch vX.pptx` — Source presentation (116 slides by Louise Pini)
- `2026.03.09 - Data opérations.xlsx` — M&A reference data

---

## Key Principles Compliance Checklist

From `/Users/utilisateur/Desktop/Ales2/KEY PRINCIPLES FOR THE NEW VERSION.md`:

| Principle | Implementation | Verification |
|-----------|---------------|------------|
| **Fully self-sufficient (SQLite DB)** | `better-sqlite3` — NO external backend | `server/db/schema.sql` |
| **No Auth system with accounts** | PINCODE from env vars only | `APP_PIN_CODE` env var |
| **100% French UI** | Zero English strings visible | French translation audit |
| **Full Alecia branding** | `#061a40`, `#b80c09`, Bierstadt font | Brand compliance check |
| **Use all resources (forks + projects)** | Cherry-pick only, no direct implementation | Source attribution table |
| **NO Convex** | Express + SQLite only | Zero Convex imports |
| **Native Pipedrive + MSOffice** | REST API integration | Phase 11 |
| **AI BYOK with master password** | 20 providers, env var API keys | `APP_MASTER_PASSWORD` gates AI |
| **Drag-and-drop state-of-the-art UI** | @dnd-kit/core + sortable | Phase 5 |
| **Gallery with PIN per project** | Grid layout, user name tag | Phase 4 |
| **WYSIWIG live previews** | Real-time slide rendering | Phase 3 |
| **PPTX import/export** | Docling import, PptxGenJS v4 export | Phase 6 |
| **PNG & PDF export** | html2canvas + jsPDF | Phase 6 |
| **Seeded templates** | 10 French M&A templates | `server/db/seed.ts` |
| **Presentation variables** | `{{client}}`, `{{target}}`, etc. | Phase 8 |
| **Every roadmap used, documented** | This document + progress tracking | Living documentation |

---

## Phase 0: Foundation & Brand Asset Integration

### Duration: 4-5 days
### Success Criteria: Clean workspace with verified Alecia brand assets

#### 0.1 Environment Setup & Verification
| Task | Priority | Owner | Verification |
|------|----------|-------|--------------|
| Verify Node.js 18+ and Python 3.11+ availability | P0 | DevOps | `node -v && python3 --version` |
| Initialize `Build_New_Version_Here/` as clean workspace | P0 | Lead | Empty directory, ready for scaffolding |
| Set up Git repository with proper `.gitignore` | P0 | Lead | SQLite, node_modules, uploads/ excluded |
| Verify Docker availability | P1 | DevOps | `docker --version` |
| **REMOVE `Reference_for_Blocks/` from git tracking** | P0 | Lead | Images too large for coding phase |

#### 0.2 Alecia Brand Asset Inventory
| Asset | Source File | Destination | Usage |
|-------|-------------|-------------|-------|
| **Logo** | `Reference_for_branding/alecia.png` | `public/assets/logo/alecia.png` | UI header, PPTX export |
| **Color Palette** | `Reference_for_branding/color_palette_analysis.json` | `src/styles/alecia-colors.ts` | 24 verified colors |
| **Source Presentation** | `Reference_for_branding/2510 - Projet XXX - Pitch vX.pptx` | `docs/reference/` | Design reference |
| **M&A Data** | `Reference_for_branding/2026.03.09 - Data opérations.xlsx` | `docs/reference/` | Domain reference |
| **OpenGraph** | `Reference_for_branding/661557309bfed1905f39309d_opengraph.png` | `public/assets/` | Social sharing |

#### 0.3 Alecia Color System Implementation

From `color_palette_analysis.json` (24 colors, 1,222 total usages):

**Core Palette (from reference 116-slide deck):**
```typescript
// src/styles/alecia-colors.ts
export const ALECIA_COLORS = {
  // Primary Navy (946 uses — dominant)
  navy: {
    DEFAULT: '#061a40',      // Primary background, dominant text
    medium: '#0a2a68',       // Secondary headers
    light: '#163e64',        // Accent backgrounds
    deep: '#0e2841',         // Darkest variant
  },
  
  // Accent Red (35 uses — brand accent)
  red: {
    DEFAULT: '#b80c09',      // Primary accent, highlights
    bright: '#c00000',       // Negative indicators, warnings
  },
  
  // Success Green (8 uses)
  green: '#92d050',          // Positive KPI indicators
  
  // Neutral Scale
  neutral: {
    white: '#ffffff',        // White text on dark
    offWhite: '#fafafc',     // Card/panel backgrounds (49 uses)
    lightGray: '#ecf0f6',    // Light backgrounds
    mediumGray: '#e6e8ec',   // Borders, dividers
    steel: '#aab1be',        // Table headers, secondary text
  },
  
  // Semantic Blues
  blue: {
    lightest: '#e3f2fd',     // Info backgrounds
    light: '#bfd7ea',        // Table alternates (4 uses)
    medium: '#749ac7',       // Process elements
    deep: '#4370a7',         // Strategy diagrams
  },
  
  // Semantic Reds
  error: {
    light: '#fee9e8',        // Error backgrounds
  },
  
  // Functional
  highlight: '#ffff00',      // Yellow highlight (1 use)
} as const;
```

#### 0.4 Typography System (Alecia-Correct)

From `ALECIA_DESIGN_SYSTEM.md` — CRITICAL: Two-font system:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        // PRESENTATION CONTENT — Bierstadt (1,486 uses in reference)
        'bierstadt': ['Bierstadt', 'Calibri', 'Arial', 'Segoe UI', 'sans-serif'],
        
        // UI CHROME — Inter (editor interface only)
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // From alecia_components_spec.json
        'slide-title': ['42px', { lineHeight: '1.2', fontWeight: '700' }],
        'section-header': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'card-title': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'footnote': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      }
    }
  }
}
```

**⚠️ CRITICAL DISCREPANCY CORRECTED:**
- Previous AGENTS.md incorrectly stated "Inter" as the font
- Reference PPTX uses **Bierstadt** for all presentation content (1,486 uses)
- **Inter** is for UI chrome only (menus, modals, buttons)
- **Bierstadt** must be embedded in PPTX export via `fontFace: 'Bierstadt'`

#### 0.5 Canvas Dimensions (from alecia_components_spec.json)

```typescript
// src/types/canvas.ts
export const ALECIA_CANVAS = {
  // 16:9 aspect ratio
  width: 4000,      // pixels
  height: 2250,     // pixels
  aspectRatio: '16:9',
  
  // Margins (from spec)
  margins: {
    top: 80,        // px
    bottom: 60,     // px
    left: 80,       // px
    right: 80,      // px
  },
  
  // Content area
  contentWidth: 3840,   // 4000 - 80 - 80
  contentHeight: 2110,  // 2250 - 80 - 60
} as const;
```

#### 0.6 Technology Stack Verification

**Frontend Dependencies:**
```bash
# Core (React 18 — NOT 19)
npm install react@18.2.0 react-dom@18.2.0

# Build tool
npm install -D vite@5.x typescript@5.x

# Styling (Tailwind 3.x)
npm install -D tailwindcss@3.x postcss autoprefixer
npm install @tailwindcss/forms

# State management
npm install zustand@4.x

# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Animation
npm install framer-motion@11.x

# Routing
npm install react-router-dom@6.x

# Notifications
npm install sonner@2.x

# Rich text editor
npm install @blocknote/core@0.47.x

# PPTX export (CRITICAL: v4, NOT v3)
npm install pptxgenjs@4.x

# PDF/PNG export
npm install html2canvas@1.x jspdf@2.x

# Validation
npm install zod@4.x

# Error tracking
npm install @sentry/react@10.x
```

**Backend Dependencies:**
```bash
# Server framework
npm install express@4.x

# Database (SQLite)
npm install better-sqlite3@9.x

# Real-time
npm install socket.io@4.x

# File upload
npm install multer@1.x

# Auth (PIN hashing)
npm install bcryptjs@2.x jsonwebtoken@9.x

# CORS
npm install cors@2.x

# Environment
npm install dotenv@16.x

# AI SDK
npm install openai@4.x

# Template engine (variable substitution)
npm install docxtemplater@3.x pizzip angular-expressions
```

#### 0.7 Critical Caveats for Phase 0

From `FORMER_PROJECTS_ANALYSIS.md`:

| Issue | Former Projects | New Version | Impact |
|-------|-----------------|-------------|--------|
| **Brand Colors** | `#1a3a5c`/`#c9a84c` (P1), `#0a1628`/`#e91e63` (P2) | `#061a40`/`#b80c09` | Complete rebrand required |
| **Font** | Not specified | Bierstadt (PPTX), Inter (UI) | Must embed Bierstadt |
| **React Version** | 19.2.1 (P1), 18.2.0 (P2, P3) | 18.2.0 | Downgrade P1 components |
| **PptxGenJS** | v3.12.0 (P2) | v4.0.1 | Breaking API changes |
| **Backend** | Convex (all) | Express + SQLite | Complete rewrite |
| **Auth** | Convex Auth | PIN only | New implementation |

---

## Phase 1: Backend Foundation (SQLite + Express)

### Duration: 6-8 days
### Success Criteria: REST API serving all CRUD operations

#### 1.1 Database Schema (SQLite — Self-Sufficient)

From `AGENTS.md` and `FORMER_PROJECTS_ANALYSIS.md`:

```sql
-- server/db/schema.sql
-- CRITICAL: NO Convex — SQLite only

CREATE TABLE projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  pin_hash TEXT,                     -- bcryptjs hash; NULL = public
  user_tag TEXT,                     -- author name tag (free text)
  target_company TEXT,
  target_sector TEXT,
  deal_type TEXT CHECK(deal_type IN ('cession_vente', 'lbo_levee_fonds', 'acquisition_achats', 'custom')),
  potential_buyers TEXT,             -- JSON array
  key_individuals TEXT,              -- JSON array
  -- Alecia branding (correct colors from color_palette_analysis.json)
  theme_primary_color TEXT DEFAULT '#061a40',
  theme_accent_color TEXT DEFAULT '#b80c09',
  theme_font_family TEXT DEFAULT 'Bierstadt',
  theme_logo_path TEXT,
  template_id TEXT REFERENCES templates(id),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE slides (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL,                -- Block type from BLOCK_LIBRARY.md
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',           -- JSON for block-based content
  notes TEXT,
  image_path TEXT,
  data TEXT,                         -- JSON extra data (charts, tables)
  docling_json TEXT,                 -- Raw DoclingDocument for round-trip
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,                     -- cession_vente | lbo_levee_fonds | acquisition_achats | custom
  slides TEXT NOT NULL,              -- JSON array of slide objects
  is_custom INTEGER DEFAULT 0,
  thumbnail_path TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- M&A Deal Database (from Datatable_Alecia - data.csv)
CREATE TABLE deals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  deal_id INTEGER NOT NULL,
  company TEXT NOT NULL,
  annee_deal INTEGER,
  type_deal TEXT,                    -- Cession | Levée de fonds | Acquisition | Financements structurés
  responsable_deal TEXT,             -- GC, TC, JB, SF, CB, ME, GdS
  equipier_deal TEXT,
  is_client_ou_contrepartie TEXT,    -- client | contrepartie
  description_deal TEXT,
  region_deal TEXT,
  sector_deal TEXT,                  -- 13 sectors
  taille_operation_m_euro REAL,
  ca_cible_m_euro REAL,
  afficher_site INTEGER DEFAULT 0,
  afficher_pitchdeck INTEGER DEFAULT 0,  -- Filter for Trackrecord_Block
  is_company INTEGER DEFAULT 1,
  is_alecia INTEGER DEFAULT 0,
  logo_filename TEXT
);

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE comments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slide_id TEXT NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_tag TEXT,                   -- User tag (no auth)
  field TEXT,                        -- title | content | notes
  text TEXT NOT NULL,
  resolved INTEGER DEFAULT 0,
  ai_response TEXT,
  parent_comment_id TEXT REFERENCES comments(id),
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE ai_settings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  provider TEXT NOT NULL,            -- 20 providers
  base_url TEXT,
  api_key TEXT,                      -- From env var (BYOK)
  model TEXT NOT NULL,
  api_format TEXT DEFAULT 'openai',
  system_prompt_extra TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE variable_presets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variables TEXT NOT NULL,           -- JSON array of Variable objects
  is_default INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE uploads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,           -- Local path under uploads/
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);
```

#### 1.2 Express Server Architecture

```
server/
├── index.ts                    # Express + Socket.io entry
├── db/
│   ├── index.ts               # better-sqlite3 connection
│   ├── schema.sql             # Database schema
│   ├── seed.ts                # 10 templates + 67 deals
│   └── seeds/
│       └── deals.csv          # From Reference_for_Blocks/
├── routes/
│   ├── projects.ts            # CRUD projects
│   ├── slides.ts              # CRUD slides
│   ├── templates.ts           # CRUD templates
│   ├── deals.ts               # Read trackrecord data
│   ├── import.ts              # POST /import/pptx
│   ├── export.ts              # GET /export/pptx/:id, /export/pdf/:id
│   ├── chat.ts                # AI chat streaming
│   ├── variables.ts           # Variable presets
│   └── auth.ts                # PIN validation
├── middleware/
│   ├── cors.ts
│   ├── auth.ts                # PIN + master password
│   ├── upload.ts              # multer config
│   └── error.ts               # Error handling
├── services/
│   ├── docling.ts             # Docling sidecar client
│   ├── export-pptx.ts         # PptxGenJS v4 export
│   └── variables.ts           # Variable substitution
└── types/
    └── index.ts               # TypeScript types
```

#### 1.3 REST API Routes

| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/api/projects` | GET | List all projects (gallery) | Gallery PIN |
| `/api/projects` | POST | Create new project | Gallery PIN |
| `/api/projects/:id` | GET | Get project details | Project PIN |
| `/api/projects/:id` | PATCH | Update project | Project PIN |
| `/api/projects/:id` | DELETE | Delete project | Project PIN |
| `/api/projects/:id/unlock` | POST | Validate PIN | — |
| `/api/projects/:id/slides` | GET | List slides | Project PIN |
| `/api/projects/:id/slides` | POST | Create slide | Project PIN |
| `/api/projects/:id/slides/reorder` | POST | Reorder | Project PIN |
| `/api/slides/:id` | GET/PATCH/DELETE | Slide ops | Project PIN |
| `/api/templates` | GET | List templates | Gallery PIN |
| `/api/deals` | GET | Trackrecord data | Gallery PIN |
| `/api/import/pptx` | POST | Import PPTX | Gallery PIN |
| `/api/export/pptx/:id` | GET | Export PPTX | Project PIN |
| `/api/export/pdf/:id` | GET | Export PDF | Project PIN |
| `/api/export/png/:id` | GET | Export PNG | Project PIN |
| `/api/chat/:projectId` | POST | AI chat | Master Password |
| `/api/variables/:projectId` | GET/POST/PATCH/DELETE | Variables | Project PIN |

---

## Phase 2: Python Docling Sidecar (PPTX Import)

### Duration: 3-4 days
### Success Criteria: HTTP service converting PPTX → structured JSON

#### 2.1 Docling Sidecar Implementation

```python
# docling-sidecar/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from docling.document_converter import DocumentConverter
from docling.pipeline.simple_pipeline import SimplePipeline
from docling.datamodel.base_models import InputFormat
import logging

app = FastAPI(title="Alecia Docling Import Service")

# Use SimplePipeline — NO ML models, pure python-pptx
converter = DocumentConverter()

@app.post("/convert/pptx")
async def convert_pptx(file: UploadFile = File(...)):
    """
    Convert PPTX to DoclingDocument JSON for Alecia import.
    Uses SimplePipeline (no torch/ML dependencies).
    """
    try:
        result = converter.convert(
            file.file,
            input_format=InputFormat.PPTX
        )
        return {
            "document": result.document.export_to_dict(),
            "status": "success"
        }
    except Exception as e:
        logging.error(f"Conversion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "service": "alecia-docling"}
```

#### 2.2 Docker Configuration

```dockerfile
# docling-sidecar/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install only SimplePipeline dependencies (NO torch ~2GB)
RUN pip install \
    docling \
    python-pptx \
    fastapi \
    uvicorn

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2.3 Docling → Alecia Block Mapping

From `FORKS_ANALYSIS.md` (Fork 3):

| Docling Label | Alecia Block Type | Block Library Reference |
|---------------|-------------------|------------------------|
| `TITLE` | `Titre` | BLOCK_LIBRARY.md C1 |
| `SECTION_HEADER` | `Sous-titre` | BLOCK_LIBRARY.md C1 variant |
| `TEXT` | `Paragraphe` | BLOCK_LIBRARY.md C6 |
| `LIST_ITEM` | `Liste` | BLOCK_LIBRARY.md C6 |
| `TABLE` | `Table_Block` | BLOCK_LIBRARY.md C4, C5 |
| `PICTURE` | `Image` | Visual asset |

---

## Phase 3: Frontend Foundation with Alecia Brand

### Duration: 6-8 days
### Success Criteria: Vite + React 18 + Tailwind with full Alecia styling

#### 3.1 Project Structure

```
Build_New_Version_Here/
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Router + PIN auth gate
│   ├── index.css                  # Tailwind + Alecia fonts
│   ├── types/
│   │   └── index.ts
│   ├── store/
│   │   └── index.ts               # Zustand (from Project 2)
│   ├── hooks/
│   │   ├── useUndoRedo.ts         # From Project 2 (P0)
│   │   ├── useKeyboardShortcuts.ts # From Project 2 (P0)
│   │   └── useCollaboration.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── offlineStorage.ts      # From Project 2 (P0)
│   │   └── validation.ts
│   ├── styles/
│   │   ├── alecia-colors.ts       # From color_palette_analysis.json
│   │   └── alecia-typography.ts   # Bierstadt + Inter
│   └── components/
│       ├── ui/                    # Base UI (Inter font)
│       ├── auth/                  # PIN screens
│       ├── gallery/               # Project grid
│       ├── editor/                # Main editor
│       ├── blocks/                # 21 block renderers (Bierstadt)
│       ├── dnd/                   # Drag and drop
│       ├── variables/             # From Project 2 (P0)
│       ├── ai/                    # Chat panel
│       └── import-export/         # Export modals
├── server/                        # Express backend
├── docling-sidecar/               # Python service
├── public/
│   └── assets/
│       └── logo/
│           └── alecia.png         # From Reference_for_branding
├── tailwind.config.ts
└── vite.config.ts
```

#### 3.2 Tailwind Configuration (Alecia Brand)

```typescript
// tailwind.config.ts
import { ALECIA_COLORS } from './src/styles/alecia-colors'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: ALECIA_COLORS,
      fontFamily: {
        'bierstadt': ['Bierstadt', 'Calibri', 'Arial', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // From alecia_components_spec.json
        'page-margin': '80px',
        'page-margin-bottom': '60px',
        'card-padding': '24px',
        'section-spacing': '40px',
      },
      borderRadius: {
        'card': '12px',
        'pill': '9999px',
      }
    }
  }
}
```

#### 3.3 Global CSS with Alecia Fonts

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Bierstadt must be loaded locally or from CDN */
@font-face {
  font-family: 'Bierstadt';
  src: url('/fonts/Bierstadt-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Bierstadt';
  src: url('/fonts/Bierstadt-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

@tailwind base;
@tailwind components;
@tailwind utilities;

/* UI uses Inter */
body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Presentation blocks use Bierstadt */
.font-presentation {
  font-family: 'Bierstadt', 'Calibri', 'Arial', sans-serif;
}
```

---

## Phase 4: PIN Authentication (Per KEY PRINCIPLES)

### Duration: 4-5 days
### Success Criteria: Gallery PIN + per-project PIN + master password for AI

#### 4.1 Auth Flow (from KEY PRINCIPLES)

```
1. Landing → Enter Gallery PIN (APP_PIN_CODE env var)
2. Gallery → Grid layout of all projects
3. Create Project → Required: name, user tag, PIN
4. Open Project → Enter project PIN (if protected)
5. In Editor → Can edit PIN, delete project, or make public
6. AI Features → Requires master password (APP_MASTER_PASSWORD)
```

#### 4.2 Components

| Component | Priority | Description |
|-----------|----------|-------------|
| `GalleryPINScreen.tsx` | P0 | Initial PIN entry |
| `ProjectGrid.tsx` | P0 | Gallery with user tags |
| `ProjectPINDialog.tsx` | P0 | Per-project PIN modal |
| `CreateProjectWizard.tsx` | P0 | 4-step + PIN creation |
| `ProjectSettingsPanel.tsx` | P1 | Edit PIN / visibility |

#### 4.3 Backend Auth Middleware

```typescript
// server/middleware/auth.ts
import bcrypt from 'bcryptjs';

// Gallery PIN from env
const GALLERY_PIN = process.env.APP_PIN_CODE;

export const validateGalleryPIN = (req, res, next) => {
  const { pin } = req.body;
  if (pin !== GALLERY_PIN) {
    return res.status(401).json({ 
      error: 'Code PIN galerie invalide' // French UI
    });
  }
  next();
};

export const validateProjectPIN = (req, res, next) => {
  const project = db.prepare('SELECT pin_hash FROM projects WHERE id = ?')
    .get(req.params.id);
  
  if (!project.pin_hash) return next(); // Public project
  
  const { pin } = req.body;
  if (!bcrypt.compareSync(pin, project.pin_hash)) {
    return res.status(401).json({ 
      error: 'Code PIN projet invalide' 
    });
  }
  next();
};

// Master password gates AI
export const requireMasterPassword = (req, res, next) => {
  const { masterPassword } = req.headers;
  if (masterPassword !== process.env.APP_MASTER_PASSWORD) {
    return res.status(403).json({ 
      error: 'Mot de passe maître requis pour l\'IA' 
    });
  }
  next();
};
```

#### 4.4 Environment Variables (from KEY PRINCIPLES)

```env
# ── Application Auth ──────────────────────────────
APP_PIN_CODE=1234                    # Gallery access PIN (shared)
APP_MASTER_PASSWORD=secret123        # Enables AI API keys

# ── AI Providers (BYOK) ───────────────────────────
OPENROUTER_API_KEY=
MINIMAX_API_KEY=
KIMI_API_KEY=
OPENCODE_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
# ... 20 total providers

# ── Server ────────────────────────────────────────
APP_PORT=3000
FRONTEND_PORT=3000
BACKEND_PORT=3001
NODE_ENV=development

# ── Docling Sidecar ───────────────────────────────
DOCLING_SIDECAR_URL=http://localhost:8000
```

---

## Phase 5: Block System Implementation

### Duration: 12-16 days
### Success Criteria: All 21 blocks renderable with Alecia styling

#### 5.1 Block Status (from AGENTS.md + BLOCK_LIBRARY.md)

**✅ Existing Blocks (from Project 2):**
| Block | Font | Reference |
|-------|------|-----------|
| `Titre` | Bierstadt | BLOCK_LIBRARY.md C1 |
| `Sous-titre` | Bierstadt | BLOCK_LIBRARY.md C1 variant |
| `Paragraphe` | Bierstadt | BLOCK_LIBRARY.md C6 |
| `Liste` | Bierstadt | BLOCK_LIBRARY.md C6 |
| `Citation` | Bierstadt | — |
| `Image` | — | Visual asset |
| `Two_Column` | Bierstadt | BLOCK_LIBRARY.md L2 |

**🔴 Missing Blocks (build from BLOCK_LIBRARY.md):**
| Block | Priority | Reference |
|-------|----------|-----------|
| `Section_Navigator` | P0 | BLOCK_LIBRARY.md C11 — appears 7× |
| `Cover` | P0 | BLOCK_LIBRARY.md L6 + ALECIA_DESIGN_SYSTEM.md §4.1 |
| `KPI_Card` | P0 | BLOCK_LIBRARY.md C7 — metrics display |
| `Table_Block` | P0 | BLOCK_LIBRARY.md C4, C5 — data tables |
| `Chart_Block` | P0 | BLOCK_LIBRARY.md — charts |
| `Company_Overview` | P1 | ALECIA_DESIGN_SYSTEM.md §4.3 |
| `Deal_Rationale` | P1 | ALECIA_DESIGN_SYSTEM.md §4.4 |
| `SWOT` | P1 | BLOCK_LIBRARY.md C3 comparison |
| `Key_Metrics` | P1 | BLOCK_LIBRARY.md C7 |
| `Process_Timeline` | P1 | BLOCK_LIBRARY.md C7 — horizontal flow |
| `Team_Grid` | P1 | BLOCK_LIBRARY.md L4 |
| `Team_Row` | P1 | BLOCK_LIBRARY.md L2 |
| `Advisor_List` | P1 | BLOCK_LIBRARY.md C8 |
| `Logo_Grid` | P1 | BLOCK_LIBRARY.md L5 |
| `Icon_Text` | P1 | BLOCK_LIBRARY.md C2 |
| `Trackrecord_Block` | P1 | Data-driven from deals table |
| `Section_Divider` | P2 | ALECIA_DESIGN_SYSTEM.md §4.13 |
| `Disclaimer` | P2 | ALECIA_DESIGN_SYSTEM.md §4.10 |

#### 5.2 Block Specifications (from BLOCK_LIBRARY.md)

**C1: Section Header Bar** (most common)
```typescript
interface SectionHeaderProps {
  sectionNumber: string;  // Roman numeral: I, II, III...
  sectionTitle: string;   // e.g., "Présentation d'alecia"
  variant?: 'default' | 'compact';
}

// Styling (from BLOCK_LIBRARY.md):
// - Pill: 48 x 32px, border-radius: 16px
// - Pill background: #b80c09 (Alecia Red)
// - Pill text: White, 14px, Bold
// - Background bar: #e6e8ec, height: 32px
// - Title: #061a40 (Alecia Navy), 16px, Semi-bold
```

**C2: Content Card with Icon**
```typescript
interface ContentCardProps {
  icon?: string;           // Icon name
  header: string;          // Card title
  headerColor?: 'navy' | 'blue' | 'red';
  bullets: string[];       // Bullet points
  accent?: 'none' | 'red-triangle';
}

// Styling:
// - Card: White bg, 12px radius, 24px padding
// - Header: #061a40 bg, white text, 18px Bold
// - Bullets: › Red chevron (#b80c09)
// - Icon: 64px centered above header
```

**C4: Data Table**
```typescript
interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlightCells?: {row: number, col: number}[];
  variant?: 'simple' | 'matrix' | 'comparison';
}

// Styling:
// - Header: #061a40 bg, white text, 14px semi-bold
// - Rows: White alternating with #bfd7ea
// - Cell padding: 10px 16px
// - Border: 1px solid #e6e8ec
```

**C7: Process Step Indicator**
```typescript
interface ProcessStepProps {
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  orientation: 'horizontal' | 'vertical';
}

// Styling:
// - Circle: 48px, #061a40 bg, white number
// - Number: 18px bold
// - Connecting line: #e6e8ec, 3px thick
```

#### 5.3 Block File Structure

```
src/components/blocks/
├── index.ts                      # Export all
├── BlockRenderer.tsx             # Switch on block type
├── BaseBlock.tsx                 # Common wrapper
├── Titre.tsx                     # ✅ Existing
├── SousTitre.tsx                 # ✅ Existing
├── Paragraphe.tsx                # ✅ Existing
├── Liste.tsx                     # ✅ Existing
├── Citation.tsx                  # ✅ Existing
├── Image.tsx                     # ✅ Existing
├── TwoColumn.tsx                 # ✅ Existing
├── SectionNavigator.tsx          # 🔴 NEW — C11, most reused
├── CoverBlock.tsx                # 🔴 NEW — L6
├── KPICard.tsx                   # 🔴 NEW — C7
├── TableBlock.tsx                # 🔴 NEW — C4, C5
├── ChartBlock.tsx                # 🔴 NEW
├── CompanyOverview.tsx           # 🔴 NEW
├── DealRationale.tsx             # 🔴 NEW
├── SWOTBlock.tsx                 # 🔴 NEW
├── KeyMetrics.tsx                # 🔴 NEW
├── ProcessTimeline.tsx           # 🔴 NEW — C7
├── TeamGrid.tsx                  # 🔴 NEW
├── TeamRow.tsx                   # 🔴 NEW
├── AdvisorList.tsx               # 🔴 NEW — C8
├── LogoGrid.tsx                  # 🔴 NEW
├── IconText.tsx                  # 🔴 NEW — C2
├── TrackrecordBlock.tsx          # 🔴 NEW — data-driven
├── SectionDivider.tsx            # 🔴 NEW
└── DisclaimerBlock.tsx           # 🔴 NEW
```

---

## Phase 6: Import/Export with Alecia Brand

### Duration: 6-8 days
### Success Criteria: PPTX import, PPTX/PDF/PNG export with correct branding

#### 6.1 PPTX Export Pipeline (PptxGenJS v4)

**CRITICAL: v4 API Changes from v3:**
```typescript
// ❌ WRONG (v3 style from Project 2)
slide.bkgd = '061a40';

// ✅ CORRECT (v4 style)
slide.background = { fill: '061a40' };

// ✅ Alecia Slide Master
pptx.defineSlideMaster({
  title: 'ALECIA_MASTER',
  background: { fill: '061a40' },  // Alecia Navy
  slideNumber: { 
    x: 9.0, 
    y: 7.0, 
    color: 'aab1be',  // Steel gray
    fontSize: 10 
  },
  objects: [
    {
      text: {
        text: '&',  // Ampersand watermark
        options: {
          x: 6.5, 
          y: 1.5,
          fontSize: 200,
          transparency: 90,
          color: 'ffffff',
          fontFace: 'Bierstadt'  // Alecia font
        }
      }
    }
  ]
});
```

#### 6.2 Export Service Structure

```typescript
// server/services/export-pptx.ts
import pptxgen from 'pptxgenjs';

export async function exportToPPTX(projectId: string): Promise<Buffer> {
  const project = getProject(projectId);
  const slides = getSlides(projectId);
  
  const pptx = new pptxgen();
  
  // Apply Alecia master
  pptx.defineSlideMaster({
    title: 'ALECIA_MASTER',
    background: { fill: project.theme_primary_color || '061a40' },
    // ... watermark, footer
  });
  
  for (const slide of slides) {
    const s = pptx.addSlide({ masterName: 'ALECIA_MASTER' });
    
    // Render blocks based on type
    switch (slide.type) {
      case 'Titre':
        s.addText(slide.title, {
          x: 0.5, y: 0.5, w: 9, h: 1,
          fontSize: 28,
          fontFace: 'Bierstadt',  // CRITICAL
          color: 'ffffff',
          bold: true
        });
        break;
      case 'Table_Block':
        s.addTable(slide.data.rows, {
          autoPage: true,
          autoPageRepeatHeader: true,
          // Alecia styling
        });
        break;
      // ... etc
    }
  }
  
  return pptx.write('nodebuffer');
}
```

#### 6.3 PDF/PNG Export

| Format | Library | Source |
|--------|---------|--------|
| PDF | html2canvas + jsPDF | Project 1 `ExportButton.tsx` |
| PNG | html2canvas + JSZip | Project 2 `ImageExport.tsx` |

---

## Phase 7: AI Integration (BYOK)

### Duration: 4-5 days
### Success Criteria: 20 providers, French M&A prompts, JSON slide parsing

#### 7.1 AI System (from Project 1 + KEY PRINCIPLES)

```typescript
// French M&A System Prompt (from AGENTS.md)
const SYSTEM_PROMPT = `Tu es un expert en M&A pour PME et ETI françaises. 
Tu travailles pour alecia, un cabinet de conseil financier indépendant. 
Tu aides à créer des pitch decks professionnels pour des opérations 
de cession, levée de fonds, et acquisition.

Réponds toujours en français. 
Utilise la terminologie M&A française standard.

Tu peux générer des slides en utilisant le format JSON suivant:
\`\`\`slides
[
  {
    "type": "Titre",
    "title": "Titre du slide",
    "content": "..."
  }
]
\`\`\``;
```

#### 7.2 20 AI Providers (from Project 1)

1. OpenAI
2. Anthropic
3. xAI
4. Google
5. Mistral
6. Groq
7. Cerebras
8. Perplexity
9. Together
10. Fireworks
11. DeepSeek
12. Azure
13. Cohere
14. NVIDIA
15. **OpenRouter** (primary BYOK)
16. HuggingFace
17. Ollama
18. LM Studio
19. Jan
20. Custom

#### 7.3 Master Password Flow (from KEY PRINCIPLES)

```
User clicks AI panel
    ↓
Prompt for master password (APP_MASTER_PASSWORD)
    ↓
If valid → Show AI settings, enable chat
    ↓
User selects provider (API key from env vars)
    ↓
Stream response with French M&A prompt
```

---

## Phase 8: Variable System

### Duration: 3-4 days
### Success Criteria: `{{variable}}` substitution across all slides

#### 8.1 Variable System (from Project 2)

**Copy directly (P0):**
- `src/components/variables/types.ts`
- `src/components/variables/useVariables.ts` (localStorage → API)
- `src/components/variables/VariablePanel.tsx`
- `src/components/variables/VariableRow.tsx`
- `src/components/variables/PresetManager.tsx`
- `src/components/variables/BulkReplaceModal.tsx`
- `src/components/variables/VariableHighlighter.tsx`

#### 8.2 System Variables

```typescript
const SYSTEM_VARIABLES = [
  'client_name',
  'client_sector', 
  'deal_amount',
  'ebitda',
  'ebitda_multiple',
  'advisor_name',
  'target_company',
  'date',
  'confidentiality_level'
];
```

---

## Phase 9: Collaboration

### Duration: 4-5 days
### Success Criteria: Socket.io presence, comments

#### 9.1 Components (from Project 2)

| Component | Source | Adaptation |
|-----------|--------|------------|
| `PresenceBar.tsx` | Project 2 | Socket.io events |
| `CommentsPanel.tsx` | Project 1 | SQLite storage |
| `CommentBubble.tsx` | Project 1 | SQLite storage |

---

## Phase 10: Testing & Quality

### Duration: 6-8 days
### Success Criteria: 80% coverage, all critical paths tested

#### 10.1 Critical Test Paths

```
1. PIN Authentication
   - Gallery PIN correct/incorrect
   - Project PIN correct/incorrect  
   - Master password for AI

2. Brand Compliance
   - #061a40 navy on all backgrounds
   - #b80c09 red on accents
   - Bierstadt font in PPTX export
   - Ampersand watermark present
   - Zero English strings in UI

3. Block Rendering
   - All 21 blocks render correctly
   - Section_Navigator appears correctly
   - Trackrecord pulls from deals table

4. Import/Export
   - PPTX import via Docling
   - PPTX export with Alecia branding
   - PDF export
```

---

## Phase 11: Pipedrive + MSOffice Integration

### Duration: 5-6 days
### Priority: Post-MVP (from KEY PRINCIPLES)

#### 11.1 Pipedrive REST API
- OAuth connection
- Import organizations → `{{client_name}}` variables
- Import deals → project data

#### 11.2 MSOffice Integration
| Format | Support |
|--------|---------|
| DOCX | Docling import |
| XLSX | Chart data import |
| PPTX | Native (primary) |

---

## Phase 12: Deployment

### Duration: 4-5 days
### Success Criteria: Docker deployment, Coolify ready

#### 12.1 Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - APP_PIN_CODE=${APP_PIN_CODE}
      - APP_MASTER_PASSWORD=${APP_MASTER_PASSWORD}
      - DATABASE_URL=/data/alecia.db
    volumes:
      - ./data:/data
      - ./uploads:/uploads
  
  docling:
    build: ./docling-sidecar
    ports:
      - "8000:8000"
```

#### 12.2 Coolify Configuration

From Project 2 `nixpacks.toml`, updated for new structure.

---

## Phase 13: Documentation

### Duration: 4-5 days
### Success Criteria: Complete client handoff package

#### 13.1 Documentation Set

| Document | Purpose |
|----------|---------|
| `README.md` | Quick start |
| `DEPLOYMENT.md` | Docker, Coolify |
| `ENVIRONMENT.md` | All env vars |
| `API.md` | REST reference |
| `BLOCKS.md` | Block system |
| `BRANDING.md` | Alecia brand guidelines |

#### 13.2 Client Handoff

```
alecia-handoff/
├── README.md
├── docker-compose.yml
├── .env.example
├── docs/
│   ├── deployment.md
│   ├── user-guide.pdf (French)
│   └── admin-guide.pdf (French)
└── assets/
    └── alecia-logo-kit.zip
```

---

## Cherry-Picking Guide (from FORMER_PROJECTS_ANALYSIS.md)

### P0 — Copy Directly
| File | Source | Target |
|------|--------|--------|
| `useUndoRedo.ts` | Project 2 | `src/hooks/` |
| `useKeyboardShortcuts.ts` | Project 2 | `src/hooks/` |
| `offlineStorage.ts` | Project 2 | `src/lib/` |
| `variables/` | Project 2 | `src/components/` |
| `ColorPicker.tsx` | Project 1 | `src/components/` |
| `BlockLibrary.tsx` | Project 2 | `src/components/dnd/` |
| `SortableSlideList.tsx` | Project 2 | `src/components/dnd/` |
| `ImageExport.tsx` | Project 2 | `src/components/import-export/` |
| `ErrorBoundary.tsx` | Project 2 | `src/components/ui/` |
| `VirtualScroll.tsx` | Project 2 | `src/components/ui/` |

### P1 — Adapt (Convex → Express, Rebrand)
| File | Source | Changes |
|------|--------|---------|
| `AIChatPanel.tsx` | Project 1 | Replace Convex, keep 20 providers |
| `exportAction.ts` | Project 2 | PptxGenJS v4, `#061a40`/`#b80c09` |
| `SlidePreview.tsx` | Project 1 | Retheme Alecia colors |
| `NewProjectWizard.tsx` | Project 1 | Add PIN step |

### P2 — Heavy Adaptation
| Feature | Source | Changes |
|---------|--------|---------|
| `ProjectEditor.tsx` | P1 + P2 | Zustand, pushSnapshot |
| `Dashboard.tsx` | P1 + P2 | PIN gate, grid layout |
| `DraggableBlock.tsx` | P2 | Add 13 missing renderers |

### P3 — Build from Scratch
| Feature | Notes |
|---------|-------|
| PIN auth screen | Replace SignInForm |
| 13 block renderers | From BLOCK_LIBRARY.md |
| Docling sidecar | Python FastAPI |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| PptxGenJS v4 breaking changes | Test export day 1 of Phase 6 |
| Brand color inconsistency | Audit with `color_palette_analysis.json` |
| French localization gaps | Native speaker review |
| Block complexity | Prioritize P0 blocks |

---

## Success Criteria

### MVP (Must Have)
- [ ] PIN auth (gallery + per-project)
- [ ] All 21 blocks with Alecia styling
- [ ] PPTX import/export
- [ ] Variable system
- [ ] 10 French M&A templates
- [ ] 67 deals trackrecord
- [ ] **100% French UI**
- [ ] **Full Alecia branding** (`#061a40`, `#b80c09`, Bierstadt)

### Client-Ready
- [ ] AI BYOK (20 providers)
- [ ] Comments/collaboration
- [ ] PDF/PNG export
- [ ] Undo/redo (50 snapshots)
- [ ] Docker deployment
- [ ] Complete documentation

---

*Roadmap complies with all requirements from:*
- `KEY PRINCIPLES FOR THE NEW VERSION.md` (all principles)
- `AGENTS.md` (full architecture)
- `FORMER_PROJECTS_ANALYSIS.md` (cherry-picking strategy)
- `ALECIA_DESIGN_SYSTEM.md` (design specifications)
- `BLOCK_LIBRARY.md` (block definitions)
- `alecia_components_spec.json` (canvas/spacing tokens)
- `Reference_for_branding/` (logo, colors, source PPTX)

*Design references use documentation files, NOT `Reference_for_Blocks/` image files (to be removed).*
