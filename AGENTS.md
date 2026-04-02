# AGENTS.md - Alecia Presentations Boilerplate

<!-- Updated: 2026-04-02 - Base boilerplate created -->

---

## 📍 Project Context

This is the **base boilerplate** for Alecia Presentation Builder in `Build_New_Version_Here/`. 
The architecture is set up and ready for phased implementation.

**Current State:** Phase 0 - Boilerplate Complete ✅  
**Next Phase:** Phase 1 - Foundation (Backend Architect Agent)

---

## 🏗️ Architecture Status

### ✅ Completed (Boilerplate)

| Component | Status | Notes |
|-----------|--------|-------|
| Project structure | ✅ | Frontend, backend, sidecar directories |
| Package configs | ✅ | Root, frontend, backend package.json |
| TypeScript setup | ✅ | tsconfig.json for both frontend and backend |
| Vite config | ✅ | Frontend dev server with proxy |
| Tailwind config | ✅ | Alecia brand colors and tokens |
| Base CSS | ✅ | index.css with Alecia design system |
| Database schema | ✅ | schema.sql with all tables |
| Route stubs | ✅ | Express routes (projects, slides, etc.) |
| Python sidecar | ✅ | FastAPI + Docling setup |
| Environment config | ✅ | .env.example with all variables |

### 🔄 Pending Implementation (13 Phases)

See `ALECIA_IMPLEMENTATION_ROADMAP.md` for complete breakdown.

| Phase | Agent | Task |
|-------|-------|------|
| 1 | Backend Architect | SQLite implementation, auth middleware, seed data |
| 2 | Backend Architect | Express routes, Socket.io, file uploads |
| 3 | Frontend Developer | Zustand store, API clients, PIN screen |
| 4 | Frontend Developer | Gallery, project creation, templates |
| 5 | Frontend Developer | Editor layout, slide list, canvas |
| 6 | Frontend Developer | Block renderers (21 types) |
| 7 | Frontend Developer | DnD system, SortableSlideList |
| 8 | AI Engineer | AI chat panel, streaming, settings |
| 9 | Frontend Developer | Variable system, import/export UI |
| 10 | Frontend Developer | PPTX export integration |
| 11 | Python Sidecar | Docling integration, PPTX import |
| 12 | Frontend Developer | Collaboration, presence, comments |
| 13 | Testing & QA | E2E tests, performance, Polish |

---

## 🎨 Design System

Source: `ALECIA_DESIGN_SYSTEM.md`, `BLOCK_LIBRARY.md`

**Core Colors:**
- `#061a40` - Alecia Navy (946 uses)
- `#b80c09` - Alecia Red (35 uses)
- `#fafafc` - Off-white background
- `#aab1be` - Silver/muted

**Fonts:**
- Presentation: Bierstadt
- UI: Inter

**Spacing Tokens:** 8px, 12px, 16px, 20px, 24px, 32px, 48px

---

## 🧩 Available Agents

All agents are in `Agents_to_Use/` directory:

| Agent | File | Specialty |
|-------|------|-----------|
| Orchestrator | `agents-orchestrator.md` | Pipeline management |
| PM | `pm-product-manager.md` | Requirements, specs |
| UX Designer | `design-ux-researcher.md` | UI/UX patterns |
| Backend Architect | `engineering-backend-architect.md` | API, database |
| Frontend Developer | `engineering-frontend-developer.md` | React, components |
| AI Engineer | `engineering-ai-engineer.md` | LLM integration |
| Code Reviewer | `engineering-code-reviewer.md` | PR reviews |
| Technical Writer | `engineering-technical-writer.md` | Docs |
| API Tester | `testing-api-tester.md` | API validation |
| Performance Tester | `testing-performance-benchmarker.md` | Load testing |
| Reality Checker | `testing-reality-checker.md` | Final validation |

**Agent Orchestration Flow:**
```
PM → UX Designer → Backend Architect → Frontend Developer ↔ QA → Integration
```

---

## 🗂️ Key Files

### Configuration
- `package.json` - Root monorepo config
- `frontend/package.json` - React dependencies
- `server/package.json` - Express dependencies
- `frontend/vite.config.ts` - Vite + proxy config
- `frontend/tailwind.config.js` - Tailwind + Alecia tokens
- `.env.example` - Environment template

### Frontend
- `frontend/src/App.tsx` - Main app with routing
- `frontend/src/types/index.ts` - TypeScript types
- `frontend/src/index.css` - Tailwind + base styles
- `frontend/src/components/` - Component directories

### Backend
- `server/index.ts` - Express entry point
- `server/db/schema.sql` - Database schema
- `server/routes/` - API route stubs
- `server/middleware/errorHandler.ts` - Error handling

### Python Sidecar
- `python-sidecar/app/main.py` - FastAPI app
- `python-sidecar/requirements.txt` - Dependencies

---

## 🚀 Next Steps

1. **Copy .env.example to .env** and configure
2. **Run `npm install`** to install dependencies
3. **Initialize database**: `npm run db:init`
4. **Start development**: `npm run dev`
5. **Assign Phase 1** to Backend Architect Agent

---

## 📝 Notes

- No Convex in this version (KEY PRINCIPLES requirement)
- SQLite only - self-contained
- PIN auth (no accounts)
- French UI only
- Bierstadt font for PPTX export
- Project 2 is primary reference (not Project 3)

---

_This boilerplate was generated on 2026-04-02 and is ready for phased implementation._
