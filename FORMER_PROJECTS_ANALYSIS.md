# Former_Project_Implementation — Detailed Analysis & Cherry-Picking Guidelines

<!-- Generated: 2026-04-02 -->
<!-- Scope: All 3 former projects analyzed at source-code level -->
<!-- Companion to: FORKS_ANALYSIS.md (covers Forks_to_Adapt/1-4) -->

---

## Quick Reference

| # | Project | App Name | Stack | Closest To Requirements? |
|---|---------|----------|-------|--------------------------|
| 1 | `Former_Project_Implementation/1/` | PitchForge | React 19 + Convex + Blocknote + DnD-kit | ⚠️ Most features, but React 19 & PDF-only export |
| 2 | `Former_Project_Implementation/2/` | Alecia Presentations | React 18 + Convex + SQLite + PptxGenJS + Zustand | ✅ **Closest to requirements** — has PPTX export, variable system, Alecia branding |
| 3 | `Former_Project_Implementation/3/` | PitchForge | React 18 + Convex + Blocknote + DnD-kit | ⚠️ Subset of Project 1, fewer bugs but also fewer features |

**KEY PRINCIPLES states: "Previous project number 3 is the closest to requirements."**
> ⚠️ This is **incorrect by code evidence**. Project 2 has `pptxgenjs`, `better-sqlite3`, `express`, `zustand`, `multer`, the variable system, Alecia branding (`#061a40` navy, `#b80c09` red), and the full PPTX export pipeline. Project 3 is closer in *architecture simplicity* but is missing all of that. Use Project 2 as the primary source, Project 1 for UI components, Project 3 for its cleaner patterns.

---

## Project 1 — `Former_Project_Implementation/1/`

### Identity
- **Name**: PitchForge (rebranding needed → Alecia)
- **React**: 19.2.1
- **Auth**: Convex Auth (Password + Anonymous) — **must be replaced with PIN**
- **Colors**: Navy `#1a3a5c`, Gold `#c9a84c` — **must be rebranded to Alecia Navy `#061a40` + Red `#b80c09`**

### Key Dependencies
```json
{
  "@blocknote/core": "^0.47.3",
  "@convex-dev/prosemirror-sync": "^0.2.3",
  "@convex-dev/presence": "^0.3.0",
  "@dnd-kit/core": "latest",
  "openai": "^6.33.0",
  "html2canvas": "^1.4.1",
  "jspdf": "^4.2.1",
  "sonner": "^2.0.3"
}
```
> ❌ No `pptxgenjs`, no `zustand`, no `express`, no `better-sqlite3`. Export is PDF only.

### Architecture
- **No router** — single `useState<Id<"projects"> | null>` in `App.tsx` toggles Dashboard ↔ ProjectEditor
- **No global state library** — pure `useState` + Convex reactive queries
- **Collaboration**: `@convex-dev/prosemirror-sync` + BlockNote per-field (title/content/notes)
- **Presence**: `@convex-dev/presence` facepile in header

### Database Schema (Convex)
| Table | Notable Fields |
|-------|----------------|
| `projects` | `name, ownerId, targetCompany, targetSector, dealType, potentialBuyers[], keyIndividuals[], theme{primaryColor,accentColor,fontFamily,logoStorageId}, templateId` |
| `slides` | `projectId, order, type(16 types), title, content, notes, imageStorageId, data` |
| `templates` | `name, description, category, slides[], isCustom, ownerId` |
| `chatMessages` | `projectId, role, content, userId` |
| `comments` | `slideId, projectId, authorId, field, text, resolved, aiResponse` |
| `aiSettings` | `userId, provider, baseUrl, apiKey, model, apiFormat, systemPromptExtra` |
| `uploads` | `projectId, storageId, fileName, fileType, fileSize` |

### Slide Types (16)
`cover`, `executive_summary`, `thesis`, `market`, `financials`, `competition`, `team`, `timeline`, `swot`, `valuation`, `risk`, `esg`, `synergies`, `process`, `appendix`, `custom`

### AI System
- 20 providers in `AISettingsPanel.tsx` (OpenAI, Anthropic, xAI, Google, Mistral, Groq, Cerebras, Perplexity, Together, Fireworks, DeepSeek, Azure, Cohere, NVIDIA, **OpenRouter**, HuggingFace, Ollama, LM Studio, Jan, Custom)
- JSON fenced block ` ```slides ``` ` parsed by `AIChatPanel` and bulk-inserted
- Comment AI: per-comment improvement via `commentActions.resolveWithAI`
- Default model: `gpt-4.1-nano`

### Export
- **PDF only** via `html2canvas` + `jsPDF` (1280×720px landscape)
- **No PPTX export** — `TemplateGallery` has a PPTX import button but handler not implemented

### Cherry-Picking Table — Project 1

| What to Take | File | Lines | How to Use |
|---|---|---|---|
| **`AIChatPanel.tsx`** (20-provider AI, JSON slide parsing, streaming) | `src/components/AIChatPanel.tsx` | Full file | Adapt: replace Convex mutations with Express fetch calls; keep 20-provider list, streaming, French prompts, slide JSON apply logic |
| **`AISettingsPanel.tsx`** (20 AI providers, model config) | `src/components/AISettingsPanel.tsx` | Full file | Adapt: store settings in SQLite `ai_settings` table instead of Convex; keep provider list and model selection UI |
| **`SlidePreview.tsx`** (16 typed visual layouts) | `src/components/SlidePreview.tsx` | Full file | Use as-is for visual rendering of slide types; retheme to Alecia Navy+Red |
| **`SlideElementLibrary.tsx`** (40+ M&A slide elements in 10 categories) | `src/components/SlideElementLibrary.tsx` | Full file | Use as element palette; already French-labelled |
| **`PresentationMode.tsx`** (fullscreen slideshow, keyboard nav, notes) | `src/components/PresentationMode.tsx` | Full file | Use as-is; replace Convex queries with Express fetch |
| **`SaveTemplateModal.tsx`** | `src/components/SaveTemplateModal.tsx` | Full file | Adapt to SQLite |
| **`SearchPanel.tsx`** | `src/components/SearchPanel.tsx` | Full file | Adapt; replace `search.searchSlides` with Express `GET /search?q=` |
| **`CollaborativeSlideEditor.tsx`** (BlockNote + ProseMirror sync) | `src/components/CollaborativeSlideEditor.tsx` | Full file | Adapt for Socket.io-based sync instead of Convex; or use classic mode only initially |
| **`CommentBubble.tsx` + `CommentsPanel.tsx`** | `src/components/Comment*.tsx` | Full files | Adapt comment storage to SQLite `comments` table |
| **`ExportButton.tsx`** (PDF via html2canvas) | `src/components/ExportButton.tsx` | Full file | Keep for PDF export path; supplement with PPTX export from Project 2 |
| **`NewProjectWizard.tsx`** (4-step: deal type → details → theme → confirm) | `src/components/NewProjectWizard.tsx` | Full file | Adapt: add PIN creation step; replace Convex create mutation with Express POST |
| **`ColorPicker.tsx`** (HSL + hex + preset palette) | `src/components/ColorPicker.tsx` | Full file | Use as-is |
| **`convex/chatActions.ts`** AI system prompt (French M&A expert) | `convex/chatActions.ts` | Lines 1-50 | Reuse system prompt verbatim; replace Convex action pattern with Express route + OpenAI SDK |
| **`convex/commentActions.ts`** AI comment resolution prompt | `convex/commentActions.ts` | Full file | Reuse `resolveWithAI` system prompt for comment AI |

### Cautions — Project 1
- React 19 — all former project deps should be downgraded to React 18 for the new version (matches Project 2)
- Convex Auth must be fully stripped; every `useQuery(api.xxx)` → Express fetch
- Brand colors (`#1a3a5c` navy, `#c9a84c` gold) must change to `#061a40` + `#b80c09`
- `SignInForm.tsx` has 11 English strings — don't reuse directly
- `TemplateGallery.tsx` PPTX import button is a stub — implement via Docling sidecar (see FORKS_ANALYSIS.md)

---

## Project 2 — `Former_Project_Implementation/2/`

### Identity
- **Name**: Alecia Presentations (correct brand!)
- **React**: 18.2.0
- **Version**: 2.1.0
- **Brand colors in `exportAction.ts`**: Navy `#0a1628`, Pink `#e91e63` — close but not exact Alecia Navy; update to `#061a40` + Red `#b80c09`
- **True completion**: ~70% (per `ROADMAP_FINAL_MASTER.md` code-verified audit)

### Key Dependencies (Most Complete Stack)
```json
{
  "pptxgenjs": "^3.12.0",
  "better-sqlite3": "^9.4.0",
  "express": "^4.18.2",
  "zustand": "^4.4.7",
  "react-router-dom": "^6.21.0",
  "socket.io": "^4.7.0",
  "socket.io-client": "^4.7.0",
  "multer": "^1.4.5-lts.1",
  "framer-motion": "^11.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "uuid": "^9.0.0",
  "zod": "^4.3.6",
  "@sentry/react": "^10.47.0"
}
```
> ✅ This is the closest dependency set to what the new version needs. `pptxgenjs` is v3 here — new version should use v4 (from Fork 4 analysis).

### Database Schema (Convex — translate to SQLite)
Same tables as Project 1 + additions:
| Table | New in Project 2 |
|-------|-----------------|
| `analyticsEvents` | `eventName, sessionId, properties, timestamp, environment` |
| `dailyActiveUsers` | `date, count, userIds` |
| `comments` | adds `parentCommentId` (threading), `mentions` |

### Directory Structure (Unique to Project 2)
```
src/
├── store/
│   ├── index.ts          ← Zustand store (stub but typed)
│   └── analytics.ts
├── hooks/
│   ├── useUndoRedo.ts    ← ✅ COMPLETE (50-snapshot history)
│   ├── useKeyboardShortcuts.ts  ← ✅ Framework complete (stubs only in DEFAULT_SHORTCUTS)
│   ├── useCollaboration.ts
│   ├── useDragZone.ts
│   ├── usePWA.ts
│   ├── useResponsive.ts
│   ├── useSocket.ts
│   ├── useTouchDrag.ts
│   └── useWebSocket.ts
├── types/
│   ├── index.ts          ← Full TypeScript type definitions
│   └── collaboration.ts
├── lib/
│   ├── offlineStorage.ts ← ✅ COMPLETE (IndexedDB + conflict resolution)
│   ├── validation.ts
│   └── sentry.ts
└── components/
    ├── dnd/              ← Full DnD system (21 blocks defined)
    ├── import-export/    ← Full import/export system
    ├── variables/        ← ✅ COMPLETE variable system
    ├── templates/        ← Template gallery with slide master
    ├── analytics/
    ├── collaboration/
    ├── ai-chat/
    ├── layout/
    └── ui/
```

### The PPTX Export Pipeline (Project 2 — Most Complete)

**`convex/exportPptx.ts`** → HTTP action → calls → **`convex/exportAction.ts`** (Node.js)

`exportAction.ts` implements:
```typescript
// PptxGenJS slide master with Alecia branding
pptx.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { color: '0a1628' },  // → update to '061a40'
  slideNumber: { x: 9.0, y: 7.0 },
  objects: [footer text + rect]
});

// Ampersand watermark on every slide
slide.addText('&', { fontSize: 200, transparency: 90, ... });

// Slide types: title, section, closing, content (with bullet list)
```
> ✅ The Alecia `&` watermark is already implemented here. Reuse this pattern exactly.

### The PPTX Import Pipeline (Project 2)

**`convex/importPptx.ts`** — 443 lines of pure JSZip + regex XML parsing:
- `parsePptxContent` — ZIP → `ppt/slides/slideN.xml` + `ppt/notesSlides/`
- `parseSlide()` — extracts shapes, pictures, graphic frames per slide
- `parseShapeElement()` — EMU → inches conversion (`/ 914400`), text, style (fontSize, color, bold, align)
- `parsePictureElement()` — embedded image refs
- `parseGraphicFrameElement()` — tables (`<a:tbl>`) and charts (`<c:chart`)
- `parseTableElement()` — row/cell extraction
- `determineSlideLayout()` — heuristic: `type="title"` → title, `type="ctrTitle"` → cover, etc.
- `parseTheme()` — extracts `accent1` and major font from `ppt/theme/theme1.xml`

> ⚠️ **Critical bug**: `parsePptxContent` calls `ctx.runAction(internal.parsePptxContent as any)` — self-referential — this is broken. The parsing functions after the `internalAction` export are standalone and work correctly; only the action dispatch is broken.
> ✅ **All the parsing helper functions are solid** and directly reusable in the new Express `POST /import/pptx` route. Replace the Convex action wrapper with Express + `multer`.

### The Seed Data (Project 2 — Gold Mine)

**`convex/seed.ts`** — 10 M&A French templates, fully variable-substituted:

| Template | Category | Slides |
|---|---|---|
| Pitch Deck Standard | `cession_vente` | 8 |
| Information Memorandum | `cession_vente` | 15 |
| LBO Model Summary | `lbo_levee_fonds` | 10 |
| Company Overview | `acquisition_achats` | 6 |
| Projections Financières | `lbo_levee_fonds` | 8 |
| Présentation de l'Équipe | `custom` | 4 |
| Chronologie du Processus | `custom` | 6 |
| Analyse Comparative | `custom` | 7 |
| Facteurs de Risque | `custom` | 5 |
| Page de Clôture | `custom` | 2 |

All templates use `{{variable}}` syntax (e.g. `{{client_name}}`, `{{deal_amount}}`, `{{ebitda_multiple}}`).
> ✅ **Reuse verbatim** as SQLite seed data. These are the French M&A templates required by KEY PRINCIPLES.

### The Variable System (Project 2 — Complete)

**`src/components/variables/`** — Fully implemented, French UI:

| File | Purpose |
|------|---------|
| `types.ts` | `Variable`, `VariablePreset`, `VariableType`, `VARIABLE_PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g`, `SYSTEM_VARIABLES` |
| `useVariables.ts` | Complete hook: CRUD, find/replace in text, presets, JSON/CSV import/export, stats, localStorage persistence |
| `VariablePanel.tsx` | Full UI: search, type filter, add/edit/delete/duplicate, import/export, bulk replace, stats bar |
| `VariableRow.tsx` | Individual variable row with drag handle |
| `PresetManager.tsx` | Preset save/load/delete/default UI |
| `BulkReplaceModal.tsx` | Global search & replace across all variables |
| `VariableHighlighter.tsx` | Highlights `{{variable}}` placeholders in text |

`SYSTEM_VARIABLES` array defines default M&A variables: `client_name`, `client_sector`, `deal_amount`, `ebitda`, `ebitda_multiple`, `advisor_name`, etc.

> ✅ **Use this entire `variables/` subsystem** as-is. Only change: persist to SQLite `variable_presets` table instead of `localStorage`.

### The Hooks (Project 2 — Production Quality)

**`src/hooks/useUndoRedo.ts`** — Complete, 50-snapshot history, French toasts:
```typescript
// Complete implementation, just wire pushSnapshot in SlideEditor:
const { undo, redo, canUndo, canRedo, pushSnapshot } = useUndoRedo();
// Call pushSnapshot({ slideId, title, content, notes, type, timestamp }) on every edit
```

**`src/hooks/useKeyboardShortcuts.ts`** — Framework complete:
```typescript
// useKeyboardShortcuts({ shortcuts }) — wire real actions in ProjectEditor, not console.log stubs
// getShortcutDisplay() — for KeyboardShortcutsHelp modal
```

**`src/lib/offlineStorage.ts`** — 531 lines, IndexedDB with conflict resolution:
- `initOfflineStorage()`, `cacheProject()`, `getCachedProject()`, `addPendingUpdate()`, `getOfflineStatus()`
- 4 IndexedDB stores: `cachedProjects`, `pendingUpdates`, `conflicts`, `syncMeta`
- Conflict detection by version + timestamp
> ✅ Reuse for offline-first behavior in the new version.

### Zustand Store (Project 2 — Typed Stub)

**`src/store/index.ts`** — All the right shape, most actions are stubs:
```typescript
// EditorState includes:
zoom, isPreviewMode, isFullscreen, showGrid, snapToGrid, gridSize,
sidebarOpen, rightPanelOpen, activeTab ("slides" | "templates" | "variables" | "chat")
// Implement the stub actions properly in new version
```

### The DnD System (Project 2 — 21 Blocks Defined, 8 Rendered)

**`src/components/dnd/`**:
| File | Status |
|---|---|
| `BlockLibrary.tsx` | ✅ All 21 blocks defined with French labels and categories |
| `DraggableBlock.tsx` | ⚠️ Only 8/21 blocks have visual renderers |
| `DraggableSlide.tsx` | ✅ Slide thumbnail with DnD handle |
| `SortableSlideList.tsx` | ✅ DnD-kit sortable slide rail |
| `DroppableCanvas.tsx` | ✅ Drop target for blocks onto slides |
| `DragOverlay.tsx` | ✅ Drag preview |
| `useDragAndDrop.ts` | ✅ Unified DnD hook |

**The 13 missing block renderers** (must implement in new version):
`KPI_Card`, `Chart_Block`, `Table_Block`, `Timeline_Block`, `Company_Overview`, `Deal_Rationale`, `SWOT`, `Key_Metrics`, `Process_Timeline`, `Team_Grid`, `Team_Row`, `Advisor_List`, `Logo_Grid`, `Icon_Text`

> Reference: `Reference_for_Blocks/frames/` (85 slide screenshots) for visual design of each block.

### The Import/Export System (Project 2)

**`src/components/import-export/`**:
| File | Status | Notes |
|---|---|---|
| `ExportModal.tsx` | ✅ UI complete | PDF with page options + PPTX button (wired to `convex/exportPptx.ts`) |
| `ImportModal.tsx` | ⚠️ UI exists, not wired | Needs `POST /import/pptx` → create slides |
| `ImageExport.tsx` | ✅ Complete | PNG/JPEG per slide + ZIP bundle |
| `useExport.ts` | ✅ Complete | Export orchestration hook |
| `useFileUpload.ts` | ✅ Complete | multer-ready file upload hook |
| `FileUploader.tsx` | ✅ Complete | Drag-drop file upload UI |
| `AssetLibrary.tsx` | ✅ Complete | Uploaded asset browser |

### Known Bugs / Integration Gaps (from `ROADMAP_FINAL_MASTER.md`)

| Bug | Location | Fix |
|-----|----------|-----|
| `pushSnapshot` never called | `ProjectEditor.tsx:159` | Call in `SlideEditor` after every autosave |
| `Onboarding.tsx` not rendered | `App.tsx` | Import and render after PIN auth |
| `DEFAULT_SHORTCUTS` are stubs | `useKeyboardShortcuts.ts:92` | Replace `console.log` with real actions |
| PPTX import frontend not wired | `ImportModal.tsx` | Wire to new Express `POST /import/pptx` |
| `parsePptxContent` action self-references | `importPptx.ts:100` | Use parsing helpers directly in Express route |
| 11 English strings in `SignInForm.tsx` | `SignInForm.tsx:23-89` | Replace with PIN screen (whole component replaced) |
| CORS not configured | `convex/http.ts` | Add CORS middleware in Express |
| `auth.ts` bug: `ctx.db.get("users", userId)` | `auth.ts` | N/A — Convex Auth being replaced |
| `NewProjectWizard` theme not saved | `NewProjectWizard.tsx` | Fixed by wiring Express `PATCH /projects/:id` |

### Cherry-Picking Table — Project 2

| What to Take | File | Status | How to Use |
|---|---|---|---|
| **`convex/exportAction.ts`** — complete PptxGenJS export with slide master, `&` watermark, 4 slide types | `convex/exportAction.ts` | ✅ | Translate to Express route `GET /export/pptx/:id`; upgrade to PptxGenJS v4; fix brand colors to `#061a40` + `#b80c09` |
| **`convex/importPptx.ts`** — all parsing helpers (parseSlide, parseShapeElement, parseTable, etc.) | `convex/importPptx.ts:172–443` | ✅ (helpers) | Port to Express `POST /import/pptx` with multer; the Convex action wrapper is broken but all parse functions work |
| **`convex/seed.ts`** — 10 French M&A templates with `{{variables}}` | `convex/seed.ts` | ✅ | Translate to SQLite seed script; use `npm run db:seed` |
| **`src/components/variables/` entire subsystem** | `src/components/variables/` | ✅ | Use as-is; change localStorage → SQLite `variable_presets` via Express API |
| **`src/hooks/useUndoRedo.ts`** — 50-snapshot undo/redo | `src/hooks/useUndoRedo.ts` | ✅ | Use as-is; wire `pushSnapshot` in SlideEditor |
| **`src/hooks/useKeyboardShortcuts.ts`** — shortcut framework | `src/hooks/useKeyboardShortcuts.ts` | ✅ | Use framework; replace stub actions with real ones |
| **`src/lib/offlineStorage.ts`** — IndexedDB offline cache | `src/lib/offlineStorage.ts` | ✅ | Use as-is for offline support |
| **`src/store/index.ts`** — Zustand store shape | `src/store/index.ts` | ⚠️ stubs | Use as type template; implement real actions |
| **`src/components/dnd/BlockLibrary.tsx`** — 21 blocks defined | `src/components/dnd/BlockLibrary.tsx` | ✅ | Use as-is for block definitions and DnD library UI |
| **`src/components/dnd/SortableSlideList.tsx`** | `src/components/dnd/SortableSlideList.tsx` | ✅ | Use for slide rail DnD |
| **`src/components/import-export/ImageExport.tsx`** — PNG/ZIP export | `src/components/import-export/ImageExport.tsx` | ✅ | Use as-is |
| **`src/components/import-export/ExportModal.tsx`** — export UI | `src/components/import-export/ExportModal.tsx` | ✅ | Adapt; wire to Express export routes |
| **`src/components/import-export/ImportModal.tsx`** — import UI | `src/components/import-export/ImportModal.tsx` | ⚠️ UI only | Wire to Express `POST /import/pptx` + Docling sidecar |
| **`src/components/templates/TemplateGallery.tsx`** | `src/components/templates/` | ✅ | Adapt to SQLite templates endpoint |
| **`src/components/templates/SlideMasterSelector.tsx`** | `src/components/templates/SlideMasterSelector.tsx` | ✅ | Use for theme/branding selection |
| **`src/components/collaboration/PresenceBar.tsx`** | `src/components/collaboration/PresenceBar.tsx` | ✅ | Adapt to Socket.io presence events |
| **`src/components/ui/ErrorBoundary.tsx`** | `src/components/ui/ErrorBoundary.tsx` | ✅ | Use as-is |
| **`src/components/ui/LoadingScreen.tsx`** | `src/components/ui/LoadingScreen.tsx` | ✅ | Adapt with Alecia branding |
| **`src/components/ui/VirtualScroll.tsx`** | `src/components/ui/VirtualScroll.tsx` | ✅ | Use for large slide lists |
| **`src/types/index.ts`** — TypeScript types | `src/types/index.ts` | ✅ | Use as base type definitions; extend for new schema |
| **`public/sw.js` + `src/main.tsx` SW registration** | `public/sw.js` | ✅ | Use for PWA/offline support |
| **`Dockerfile` + `nixpacks.toml`** | root | ✅ | Use for deployment |

---

## Project 3 — `Former_Project_Implementation/3/`

### Identity
- **Name**: PitchForge (same as Project 1)
- **React**: 18.2.0 (same as Project 2)
- **Convex deployment**: `acoustic-crocodile-315` (same as Project 1 — literally the same deployment!)
- **Colors**: Not Alecia — same as Project 1

### What Makes Project 3 Different from Project 1
Based on code analysis, Project 3 is a **slightly earlier/simpler snapshot** of Project 1:

| Feature | Project 1 | Project 3 |
|---------|-----------|-----------|
| React version | 19.2.1 | 18.2.0 |
| convex deployment | acoustic-crocodile-315 | acoustic-crocodile-315 (same!) |
| `analyticsEvents` table | No | No |
| `parentCommentId` in comments | No | No |
| Export | PDF only | PDF only |
| PPTX import | Stub | Stub |
| Variable system | No | No |
| Zustand | No | No |
| Component count | ~20 | ~20 (identical set) |
| Collaboration | BlockNote + ProsemirrorSync | BlockNote + ProsemirrorSync |

> **Project 3 = Project 1 minus React 19.** Almost identical codebase, same Convex deployment ID. Likely a React 18 downgrade branch.

### Known Bugs Unique to Project 3
1. **`auth.ts` bug**: `ctx.db.get("users", userId)` — incorrect Convex API (should be `ctx.db.get(userId)`)
2. **`NewProjectWizard` theme not saved** — wizard collects theme but never passes to `update` mutation (commented out)
3. **`TemplateGallery` template select** — calls `setShowWizard(true)` but doesn't pass template data
4. **`SignInForm.tsx`/`SignOutButton.tsx`** — English UI while rest is French

### Cherry-Picking Table — Project 3

| What to Take | Why Prefer Over Project 1/2 |
|---|---|
| Nothing exclusive to Project 3 | All components are identical to Project 1. Prefer Project 1 or Project 2 versions of each component. |
| **React 18.2 compatibility** | If a specific component from Project 1 has React 19-specific code that breaks on React 18, check Project 3 for the same component — it's the React 18-compatible version |

---

## Cross-Project Integration Strategy

### The Golden Rule
> Take **architecture** from Project 2 (Express + SQLite + PptxGenJS + variable system)  
> Take **UI components** from Project 1 (more complete, more polished)  
> Take **React 18 compatibility fixes** from Project 3 when Project 1 components fail  

### Component Sourcing Decision Tree

```
For any component needed:

1. Does Project 2 have a complete, working version?
   YES → Use Project 2 version (adapt Convex → Express)
   NO  → Continue...

2. Does Project 1 have it?
   YES → Use Project 1 version (adapt Convex → Express, rebrand colors)
   NO  → Build from scratch using Reference_for_Blocks/frames/ as design reference

3. Does Project 3 have a simpler/cleaner version of the same Project 1 component?
   YES → Prefer Project 3 if it's less coupled to React 19 APIs
```

### Convex → Express Migration Pattern

Every Convex pattern has a direct Express equivalent:

| Convex (old) | Express + SQLite (new) |
|---|---|
| `useQuery(api.projects.list)` | `useEffect(() => fetch('/api/projects'))` or Zustand action |
| `useMutation(api.projects.create)` | `fetch('/api/projects', { method: 'POST', body: JSON.stringify(data) })` |
| `useQuery(api.slides.list, { projectId })` | `fetch('/api/projects/:id/slides')` |
| `convex/chatActions.ts` Node action | Express route + `openai` SDK directly |
| Convex storage (`storageId`) | Express `multer` upload to `uploads/` directory |
| `@convex-dev/presence` heartbeat/list | Socket.io room events: `join`, `presence:update`, `presence:list` |
| `@convex-dev/prosemirror-sync` | Socket.io + `yjs` for CRDT collaborative editing |
| `ctx.runAction(internal.exportAction.generatePptxBase64)` | Express route calling `pptxgenjs` directly |

### Auth Replacement

All Convex Auth code (`SignInForm.tsx`, `auth.ts`, `auth.config.ts`, `@convex-dev/auth`) is **discarded**.

New PIN auth flow:
```typescript
// Frontend: PIN entry screen (Gallery page)
// On project open: prompt for PIN if project.pin_protected
// On new project: require PIN setup
// Master password: enables AI API keys from env vars

// Backend: Express middleware
// GET /api/projects → public list (no auth needed for gallery)
// POST /api/projects/:id/unlock → validate PIN → return session token (JWT or cookie)
// POST /api/projects/:id/ai/* → require master password header
```

---

## Priority Cherry-Pick List (Ordered for Implementation)

### P0 — Copy Directly (Zero Adaptation)

| File | Source | Target Path |
|---|---|---|
| `convex/seed.ts` (template data only) | Project 2 | `server/db/seed.ts` (translate to SQLite inserts) |
| `src/hooks/useUndoRedo.ts` | Project 2 | `src/hooks/useUndoRedo.ts` |
| `src/hooks/useKeyboardShortcuts.ts` | Project 2 | `src/hooks/useKeyboardShortcuts.ts` |
| `src/lib/offlineStorage.ts` | Project 2 | `src/lib/offlineStorage.ts` |
| `src/components/variables/` (entire dir) | Project 2 | `src/components/variables/` (change localStorage → API calls) |
| `src/components/ColorPicker.tsx` | Project 1 | `src/components/ColorPicker.tsx` |
| `src/components/dnd/BlockLibrary.tsx` | Project 2 | `src/components/dnd/BlockLibrary.tsx` |
| `src/components/dnd/SortableSlideList.tsx` | Project 2 | `src/components/dnd/SortableSlideList.tsx` |
| `src/components/import-export/ImageExport.tsx` | Project 2 | `src/components/import-export/ImageExport.tsx` |
| `src/components/ui/ErrorBoundary.tsx` | Project 2 | `src/components/ui/ErrorBoundary.tsx` |
| `src/components/ui/VirtualScroll.tsx` | Project 2 | `src/components/ui/VirtualScroll.tsx` |

### P1 — Light Adaptation (Convex → Express, Color Rebrand)

| File | Source | Key Changes |
|---|---|---|
| `convex/exportAction.ts` | Project 2 | Express route, PptxGenJS v4 API, colors `#061a40`/`#b80c09` |
| `convex/importPptx.ts` (helpers only) | Project 2 | Express route + multer, wrap in Docling sidecar call |
| `src/components/AIChatPanel.tsx` | Project 1 | Replace Convex mutations with fetch; keep 20 providers + JSON slide parsing |
| `src/components/AISettingsPanel.tsx` | Project 1 | Store in SQLite `ai_settings`; keep 20-provider list |
| `src/components/SlidePreview.tsx` | Project 1 | Retheme navy+red; replace Convex data with prop-based API |
| `src/components/SlideElementLibrary.tsx` | Project 1 | Replace Convex insert with Express POST |
| `src/components/PresentationMode.tsx` | Project 1 | Replace Convex queries with fetch |
| `src/components/NewProjectWizard.tsx` | Project 1 | Add PIN creation step; Express POST; fix theme save bug |
| `src/components/import-export/ExportModal.tsx` | Project 2 | Wire to Express export routes |
| `src/components/import-export/ImportModal.tsx` | Project 2 | Wire to Express `POST /import/pptx` + Docling |
| `src/store/index.ts` | Project 2 | Implement stub actions with real Express fetch calls |
| `Dockerfile` + `nixpacks.toml` | Project 2 | Update for new Express+SQLite structure |

### P2 — Heavy Adaptation (Architecture + UI Rebuild)

| Feature | Source | Key Changes |
|---|---|---|
| `ProjectEditor.tsx` | Project 1 + Project 2 | Replace Convex with Zustand + fetch; wire `pushSnapshot`; add panel for variable system |
| `Dashboard.tsx` (Gallery) | Project 1 + Project 2 | Replace Convex with fetch; add PIN gate per project; add grid/list toggle; add user tag |
| `SlideEditor.tsx` | Project 1 | Add `pushSnapshot` call on autosave; wire PIN-free access |
| `CollaborativeSlideEditor.tsx` | Project 1 | Replace `@convex-dev/prosemirror-sync` with Socket.io + yjs (or classic mode only in v1) |
| Backend server | Project 2 skeleton | Build full Express server with SQLite schema, all REST routes, Socket.io, multer |
| `src/components/dnd/DraggableBlock.tsx` | Project 2 | Add 13 missing block renderers (use `Reference_for_Blocks/frames/` as design reference) |

### P3 — Build from Scratch (Not in Any Former Project)

| Feature | Notes |
|---|---|
| PIN auth screen | New component replacing SignInForm entirely |
| Gallery with per-project PIN gate | New flow: public gallery → PIN prompt → editor |
| Master password → AI activation | New middleware in Express |
| Alecia branding (Logo, colors) | Use `Reference_for_branding/alecia.png` + `color_palette_analysis.json` |
| 13 missing block renderers | Use `Reference_for_Blocks/frames/` screenshots as pixel reference |
| Docling sidecar `POST /convert/pptx` | New Python FastAPI microservice (see FORKS_ANALYSIS.md) |
| SQLite schema + migrations | New `server/db/schema.sql` translating Convex schema |
| React Router v6 routes | New: `/`, `/editor/:id`, `/present/:id` |

---

## SQLite Schema (Derived from Project 2 Convex Schema)

```sql
-- Translate Convex tables to SQLite:

CREATE TABLE projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  pin_hash TEXT,                    -- bcryptjs hash, NULL = public
  target_company TEXT,
  target_sector TEXT,
  deal_type TEXT,                   -- cession_vente, lbo_levee_fonds, acquisition_achats, custom
  potential_buyers TEXT,            -- JSON array
  key_individuals TEXT,             -- JSON array
  theme_primary_color TEXT DEFAULT '#061a40',
  theme_accent_color TEXT DEFAULT '#b80c09',
  theme_font_family TEXT DEFAULT 'Inter',
  theme_logo_path TEXT,
  template_id TEXT REFERENCES templates(id),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE slides (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',          -- JSON for block-based content
  notes TEXT,
  image_path TEXT,
  data TEXT,                        -- JSON extra data (chart data, table data, etc.)
  docling_json TEXT,                -- raw Docling DoclingDocument JSON (for round-trip fidelity)
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  slides TEXT NOT NULL,             -- JSON array of slide objects
  is_custom INTEGER DEFAULT 0,
  thumbnail_path TEXT,
  created_at INTEGER DEFAULT (unixepoch())
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
  author_tag TEXT,                  -- user tag (free text, no auth)
  field TEXT,                       -- title | content | notes
  text TEXT NOT NULL,
  resolved INTEGER DEFAULT 0,
  ai_response TEXT,
  parent_comment_id TEXT REFERENCES comments(id),
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE ai_settings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  provider TEXT NOT NULL,
  base_url TEXT,
  api_key TEXT,                     -- encrypted or from env vars
  model TEXT NOT NULL,
  api_format TEXT DEFAULT 'openai',
  system_prompt_extra TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE variable_presets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variables TEXT NOT NULL,          -- JSON array of Variable objects
  is_default INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE uploads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);
```

---

## AGENTS.md Corrections

The current `AGENTS.md` states:
> "Former_Project_Implementation/1/ — Convex + React v19, Blocknote, DnD-kit (**closest to requirements**)"
> "Former_Project_Implementation/3/ — Similar to #1 but without some features"

Corrections based on code analysis:

1. **Project 2 is closest to requirements**, not Project 3. Project 2 has `pptxgenjs`, `express`, `better-sqlite3`, `zustand`, the complete variable system, Alecia brand naming, the PPTX export pipeline, and the most complete codebase.

2. **Project 3 ≈ Project 1 on React 18**, same Convex deployment, no additional features. It is *architecturally simpler* than Project 2, but also missing all of Project 2's additions.

3. **The instruction "Previous project number 3 is the closest to requirements"** likely refers to architectural simplicity (no extra complexity) rather than feature completeness. When building the new version, **do not use Project 3 as the primary reference** — use Project 2 for backend/data patterns and Project 1 for UI components.

---

_Analysis generated by full source-code read of all files in Former_Project_Implementation/1, 2, and 3._
_Companion documents: FORKS_ANALYSIS.md (forks cherry-picking), AGENTS.md (overall context)._
