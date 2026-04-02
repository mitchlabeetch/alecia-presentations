# Forks_to_Adapt — Detailed Analysis & Cherry-Picking Insights

<!-- Generated: 2026-04-02 -->
<!-- Scope: All 4 forks in Forks_to_Adapt/ analyzed in full depth -->

---

## Overview

| # | Fork | Language | Version | Role in Alecia |
|---|------|----------|---------|----------------|
| 1 | **MegaParse** (QuivrHQ) | Python 3.11+ | 0.0.55 | PPTX/PDF/DOCX **import parsing** microservice |
| 2 | **docxtemplater** (open-xml-templating) | JavaScript ES6 | 3.68.3 | Template-driven DOCX/PPTX **variable substitution** |
| 3 | **Docling** (IBM/docling-project) | Python 3.10+ | 2.84.0 | Production-grade **PPTX → structured JSON** conversion |
| 4 | **PptxGenJS** (gitbrent) | TypeScript | 4.0.1 | JavaScript **PPTX generation** (export engine) |

---

## Fork 1 — MegaParse (`Forks_to_Adapt/1/`)

### Structure
```
libs/
  megaparse/
    src/megaparse/
      megaparse.py          # Orchestrator class (sync + async load)
      parser/
        base.py             # Abstract BaseParser (convert / aconvert)
        unstructured_parser.py  # Wraps unstructured[all-docs]==0.15.0
        megaparse_vision.py # Vision LLM parser (GPT-4o / Claude 3.5)
        doctr_parser.py     # OCR via onnxtr
        llama.py            # LlamaIndex bridge
        builder.py          # Parser factory
      formatter/
        table_formatter/
          llm_table_formatter.py   # LLM markdown table re-formatting
          vision_table_formatter.py
        structured_formatter/
          custom_structured_formatter.py
      layout_detection/
        layout_detector.py  # YOLOv10s-doclaynet ONNX model
      api/
        app.py              # FastAPI endpoints: POST /v1/file, POST /v1/url
      configs/auto.py
      utils/strategy.py     # determine_global_strategy / get_page_strategy
  megaparse_sdk/
    megaparse_sdk/
      schema/               # Document model: Block, TableBlock, TitleBlock …
      client.py             # HTTP SDK client
      config.py
```

### Core Mechanics
- **`MegaParse.load()`** — synchronous entry point. Detects file extension; for PDF uses `pypdfium2` rasterisation + layout model to choose between `HI_RES` (DoctrParser OCR) or `FAST` (UnstructuredParser).
- **`MegaParse.aload()`** — async equivalent, same logic.
- **`UnstructuredParser`** — wraps `unstructured.partition.auto.partition()`; handles PDF, DOCX, XLSX, CSV, PPTX, HTML, MD, TXT. Maps element types (Title, Table, Image, ListItem, Header, Footer …) to `megaparse_sdk` Block objects with bounding boxes and page ranges.
- **`MegaParseVision`** — converts PDF pages to base64 PNG batches, sends to vision LLM with `BASE_OCR_PROMPT`; extracts `[TABLE]…[/TABLE]`, `[HEADER]…[/HEADER]`, `[TOC]…[/TOC]` tags, then strips/deduplicates. Benchmark: **0.87 similarity ratio** (best in class vs llama-parser 0.33).
- **FastAPI layer** (`api/app.py`) — exposes `/v1/file` (file upload + strategy selection) and `/v1/url` (Playwright URL scraping + PDF download). Memory guard: rejects traffic below 2 GB free.

### Key Dependencies
```
pdfplumber, pypdf, pypdfium2      # PDF reading/rasterising
unstructured[all-docs]==0.15.0    # Universal document partition
langchain + langchain-openai + langchain-anthropic  # LLM chain
llama-parse                        # Alternative LlamaIndex parser
onnxtr[cpu/gpu]                   # OCR engine
fastapi + uvicorn                  # API server
playwright                        # Web page scraping
```

### Cherry-Picking Insights for Alecia

| What to Take | Where | How to Use |
|---|---|---|
| **`UnstructuredParser.__to_mp_document()`** | `unstructured_parser.py:88–373` | Use the element-type → Block mapping table verbatim to convert unstructured output to Alecia slide blocks on PPTX import. Maps Title→TitleBlock, Table→TableBlock, Image→ImageBlock, etc. |
| **`MegaParseVision` prompts** | `megaparse_vision.py:26–54` | Reuse `BASE_OCR_PROMPT` as the AI prompt for scanned PPTX/PDF import via OpenRouter BYOK keys. Replace hardcoded `ChatOpenAI` with generic `BaseChatModel` call via BYOK. |
| **`determine_global_strategy()`** | `utils/strategy.py` | Import as-is for auto-selecting OCR vs digital text parsing. Wire to Express `POST /import/pptx` endpoint. |
| **FastAPI `/v1/file` pattern** | `api/app.py:59–116` | Translate to Express `multer` + async route. The memory check (`_check_free_memory`) is directly reusable in a Node process monitoring pattern. |
| **`LLMTableFormatter`** | `formatter/table_formatter/llm_table_formatter.py` | Adapt for AI-assisted table cleaning: pass PPTX-imported tables through an LLM to normalise Markdown, then store in SQLite `blocks.content`. |
| **Block type taxonomy** | `megaparse_sdk/schema/document.py` | Use `TitleBlock`, `SubTitleBlock`, `TextBlock`, `TableBlock`, `ImageBlock`, `HeaderBlock`, `FooterBlock` as the canonical vocabulary when mapping to Alecia's 21 block types. |

### Cautions
- `unstructured[all-docs]==0.15.0` is pinned and very large (~1.5 GB with models). **Do not bundle in Node backend** — run as a sidecar Python microservice called via HTTP, or use Docling (Fork 3) instead.
- The ONNX model file `yolov10s-doclaynet.onnx` is committed directly; fine for local dev but must be excluded from Docker image layers or served from a volume.
- `megaparse.py:135–143` contains dead unreachable code (duplicate `pages = self.doctr_parser.get_text_detections(pages)` after a `return` statement). Harmless but indicates codebase needs cleanup before production use.

---

## Fork 2 — docxtemplater (`Forks_to_Adapt/2/`)

### Structure
```
es6/
  docxtemplater.js        # Core class: compile(), render(), renderAsync()
  docxtemplater.d.ts      # Full TypeScript declarations
  lexer.js                # Template tag lexer
  parser.js               # Tag parser → Part AST
  scope-manager.js        # Hierarchical scope resolution
  render.js               # Render pipeline
  resolve.js              # Async resolution pass
  modules/
    loop.js               # {#items}…{/items} loop module
    rawxml.js             # {@rawXml} raw insertion
    render.js             # Render module
    common.js             # Shared utilities
  expressions.js          # Angular-expressions parser (configuredParser)
  expressions.d.ts        # TypeScript defs for angular parser
  errors.js               # XTTemplateError, XTInternalError
  filetypes.js            # DOCX / PPTX file type configs
  get-content-types.js
  get-relation-types.js
  inspect-module.js       # Debug module to inspect parsed AST
browser/
examples/
  a16-row-id.pptx         # Reference PPTX template
```

### Core Mechanics
- **`Docxtemplater(zip, options)`** — takes a PizZip/JSZip-serialised OOXML archive; compiles template on construction.
- **Template syntax**: `{placeholder}` → value, `{#loop}…{/loop}` → repeat, `{@rawXml}` → insert XML fragment. Delimiters configurable.
- **`render(data)`** — synchronous single-pass fill. `renderAsync(data)` — async pass for Promises in data.
- **`configuredParser()`** in `expressions.js` — Angular-expressions engine allowing `{items.length > 3}`, `{full_name = first_name + ' ' + last_name}`, `{$index}` inside loops.
- **Module system** (`Module` interface in `.d.ts:120–145`) — hook into `matchers`, `render`, `postparse`, `resolve`, `preZip` for extension. The paid modules (Image, Chart, Html-Pptx, Slides, etc.) all follow this interface.
- **Scope chain** (`scope-manager.js`) — `scopeList` array allows nested loops with outer scope access; `$index` gives loop position.
- Output: `toBuffer()`, `toBlob()`, `toBase64()`, `toUint8Array()`, `toArrayBuffer()`.

### Key Dependencies
```
@xmldom/xmldom    # XML DOM manipulation (sole runtime dependency)
pizzip            # OOXML zip handling (dev dep used in tests)
angular-expressions  # Expression evaluation engine
```

### Cherry-Picking Insights for Alecia

| What to Take | Where | How to Use |
|---|---|---|
| **`Docxtemplater` + `configuredParser`** | `es6/docxtemplater.js` + `es6/expressions.js` | Use as the **presentation-wide variable system** (`{{client}}`, `{{target}}`, `{{date}}`). Wire to SQLite `variable_presets` table. On export, substitute all slide blocks before feeding to PptxGenJS. |
| **Module interface** (`DXT.Module`) | `es6/docxtemplater.d.ts:120–145` | Implement a custom Alecia module for `{%image}` and `{~html}` substitution in PPTX templates without buying paid modules. |
| **`expressions.configuredParser(config)`** | `es6/expressions.js:127–445` | Wire `evaluateIdentifier` to look up Alecia's `variable_presets` store so blocks auto-fill from presentation-level variables. Use `$index` for numbered deal lists. |
| **Angular expressions filter system** | `es6/expressions.js:449` `exportedValue.filters` | Add French formatting filters: `{montant \| monnaie}` → `"1 234 567 €"`, `{date \| frDate}` → `"02/04/2026"`. |
| **Loop in tables** | `es6/modules/loop.js` | Use the `{#rows}…{/rows}` pattern inside PPTX table blocks to auto-expand M&A deal comparison tables from SQLite data. |
| **`joinUncorrupt` / `chunkBy`** | `es6/doc-utils.js` | Borrow XML repair utilities for safe round-trip PPTX manipulation. |
| **Error handling pattern** | `es6/errors.js` | `XTTemplateError` with structured `properties.errors[]` array is the right model for surfacing template validation errors in the Alecia editor. |

### Cautions
- docxtemplater v3.68.3 uses `@xmldom/xmldom` 0.9.x. Ensure compatibility with PptxGenJS (which uses JSZip 3.x). They operate at different abstraction layers (template fill vs. programmatic generation) so they can coexist.
- The paid modules (Image, Chart, Slides) are **not included**. Only the free loop, rawxml, render modules are available. Implement image/chart substitution separately via PptxGenJS.
- `paragraphLoop: true` option is critical for PPTX templates — without it, loops that span paragraph boundaries corrupt the XML.

---

## Fork 3 — Docling (`Forks_to_Adapt/3/`)

### Structure
```
docling/
  document_converter.py        # Main entry: DocumentConverter.convert()
  backend/
    abstract_backend.py        # DeclarativeDocumentBackend / PaginatedDocumentBackend
    mspowerpoint_backend.py    # python-pptx PPTX → DoclingDocument
    msword_backend.py          # python-docx DOCX backend
    msexcel_backend.py         # openpyxl XLSX backend
    html_backend.py            # bs4 HTML backend
    pdf + docling_parse_backend.py  # PDF backends (v2, v4)
    image_backend.py           # PIL image backend
    latex_backend.py / md_backend.py / csv_backend.py …
  pipeline/
    standard_pdf_pipeline.py   # Full PDF pipeline (layout + OCR + table)
    simple_pipeline.py         # Non-PDF fast pipeline
    vlm_pipeline.py            # Vision LLM pipeline
    asr_pipeline.py            # Audio pipeline
  models/
    base_layout_model.py       # IBM Heron layout model
    base_table_model.py        # TableFormer
    base_ocr_model.py          # OCR abstraction
    vlm_pipeline_models/       # HF transformers, MLX, vLLM, API VLM
    plugins/defaults.py        # Plugin registration
  datamodel/
    base_models.py             # InputFormat, ConversionStatus, ErrorItem
    document.py                # ConversionResult, InputDocument
  cli/main.py                  # `docling` CLI command
  utils/export.py              # Markdown / HTML / JSON export helpers
```

### Core Mechanics
- **`DocumentConverter.convert(source)`** — accepts local path, URL, or stream; selects backend and pipeline by `InputFormat`. Returns `ConversionResult` containing a `DoclingDocument` (pydantic model from `docling-core`).
- **`MsPowerpointDocumentBackend`** — uses `python-pptx` to walk slides; extracts:
  - Shape positions as `BoundingBox` with `CoordOrigin.BOTTOMLEFT`
  - Paragraph bullet info via XML (`a:buChar`, `a:buAutoNum`, `a:buBlip`, `a:buNone`)
  - Placeholder types via `PP_PLACEHOLDER` enum
  - Slide master text styles for inherited formatting
- **`DoclingDocument`** — unified document model: `content` list of `DocItem` (paragraphs, tables, figures, etc.), each with `prov` (provenance = page + bbox), `label` (`DocItemLabel` enum), and hierarchical grouping.
- **Export options**: `.export_to_markdown()`, `.export_to_html()`, `.export_to_dict()` (lossless JSON), DocTags format for VLM fine-tuning.
- **`SimplePipeline`** — used for PPTX/DOCX/XLSX: no ML models needed, purely declarative parsing. Fast and suitable for Alecia's PPTX import.
- **`StandardPdfPipeline`** — full ML stack: layout model (Heron), TableFormer, OCR. Heavy but highest quality.
- Concurrency: `ThreadPoolExecutor` + `_PIPELINE_CACHE_LOCK` for thread-safe model reuse across multiple conversion requests.

### Key Dependencies
```
python-pptx>=1.0.2       # Core PPTX parsing
python-docx>=1.1.2       # DOCX parsing
docling-core>=2.70.0     # DoclingDocument pydantic model
docling-parse>=5.3.2     # PDF parsing C++ extension
docling-ibm-models>=3.13 # Heron layout + TableFormer
torch>=2.2.2             # ML inference
pypdfium2                # PDF rasterisation
pillow                   # Image handling
openpyxl                 # XLSX
beautifulsoup4           # HTML
rapidocr                 # OCR (default)
```

### Cherry-Picking Insights for Alecia

| What to Take | Where | How to Use |
|---|---|---|
| **`MsPowerpointDocumentBackend.convert()`** | `backend/mspowerpoint_backend.py:95–111` | **Most valuable file in all forks.** Drop-in PPTX → structured JSON for Alecia's import pipeline. Outputs `DoclingDocument` with each shape's text, position, bullet type, placeholder role. |
| **`_walk_linear()` pattern** | `backend/mspowerpoint_backend.py` (full class) | Use the `_generate_prov()` + `_get_paragraph_level()` + `_parse_bullet_from_paragraph_properties()` chain to faithfully extract list hierarchy from imported PPTX slides. |
| **`DoclingDocument.export_to_dict()`** | `docling-core` | Call after conversion to get lossless JSON; store raw in SQLite `slides.docling_json` column for round-trip fidelity. |
| **`SimplePipeline`** | `pipeline/simple_pipeline.py` | Wrap in a FastAPI microservice (`POST /convert/pptx`) that accepts `.pptx` upload and returns `DoclingDocument` JSON. Alecia Node backend calls this sidecar. |
| **`ConversionResult` + `ErrorItem`** | `datamodel/base_models.py` | Mirror this error model in Express: structured errors with `component_type`, `module_name`, `error_message` are far better than raw exceptions for the UI. |
| **`BoundingBox` + `ProvenanceItem`** | `docling-core types` | Store these in SQLite per block for WYSIWYG position reconstruction. Critical for faithful PPTX round-trip. |
| **`DocItemLabel` enum** | `docling-core` | Map to Alecia block types: `TITLE→Titre`, `SECTION_HEADER→Sous-titre`, `TEXT→Paragraphe`, `LIST_ITEM→Liste`, `TABLE→Table_Block`, `PICTURE→Image`. |
| **CLI pattern** | `cli/main.py` | Use `typer`-based CLI as a reference for building a `alecia-import` CLI tool for batch PPTX processing in seeding scripts. |

### Cautions
- `torch>=2.2.2` is a heavy dependency (~2 GB). For Alecia's PPTX import, **only `SimplePipeline` is needed** — no ML models required. Use `FormatOption(pipeline_cls=SimplePipeline)` and avoid `StandardPdfPipeline` unless PDF import is needed.
- `docling-ibm-models` and `docling-parse` are proprietary IBM binary packages. They're MIT licensed but the models themselves have separate licenses. For the simple pipeline, these are not invoked.
- macOS arm64 gets special treatment (`ocrmac`, `mlx-whisper`, `mlx-vlm`). Ensure Docker image targets `linux/amd64` to keep deps predictable.
- Version constraint: requires Python `>=3.10,<4.0`. Use `python:3.11-slim` Docker base to match MegaParse requirement.

---

## Fork 4 — PptxGenJS (`Forks_to_Adapt/4/`)

### Structure
```
src/
  core-enums.ts        # All enums + constants (EMU=914400, ONEPT=12700, ShapeType, ChartType …)
  core-interfaces.ts   # All TypeScript interfaces (PositionProps, TextProps, TableProps, ImageProps …)
  gen-objects.ts       # Slide object generators: text, shape, image, chart, table, media
  gen-charts.ts        # Chart XML generation + embedded Excel worksheet
  gen-tables.ts        # Table auto-pagination, parseTextToLines
  gen-media.ts         # Image/media embedding
  pptxgen.ts           # Main PptxGenJS class (inferred from package.json exports)
types/
  index.d.ts           # Public TypeScript declarations for consumers
libs/
  jszip.min.js         # Bundled JSZip
  polyfill.min.js      # Browser polyfills
demos/
  browser_server.mjs   # Demo server
tools/
  data2chart.html/css  # Data-to-chart helper tool
```

### Core Mechanics
- **4-step API**: `new pptxgen()` → `addSlide()` → `slide.addText/addImage/addTable/addChart/addShape()` → `pres.writeFile()`.
- **Coordinate system**: inches (type `Coord = number | '75%'`). 1 inch = 914,400 EMU. Positions: `x`, `y`, `w`, `h`.
- **`addText(text, opts)`** — supports rich text runs (`[{ text, options: { bold, color, fontSize, hyperlink } }]`), line breaks, RTL, glow, shadow.
- **`addTable(rows, opts)`** — auto-pagination via `getSlidesForTableRows()`; `parseTextToLines()` wraps cell text by column width using a character-per-line formula (`FOCO=2.3`).
- **`addChart(type, data, opts)`** — 10 chart types: area, bar, bar3D, bubble, doughnut, line, pie, radar, scatter. Generates embedded Excel `.xlsx` via JSZip inside the PPTX. Multi-axis support.
- **`addImage({ path/data, x, y, w, h })`** — supports URL fetch (Node), base64 data URIs, `image-size` for auto-sizing.
- **Slide Masters** via `defineSlideMaster({ title, bkgd, objects, slideNumber })` — set corporate branding once, apply across all slides.
- **Export formats**: `arraybuffer`, `base64`, `blob`, `nodebuffer`, `uint8array`, `STREAM`. Browser: direct download. Node: write to filesystem.
- **v4.0.1** — full ESM + CJS dual build via Rollup. Pure TypeScript source. Zero runtime deps except JSZip + https + image-size (optional in browser builds, shimmed away via `"browser"` field in `package.json`).

### Key Interfaces
```typescript
PositionProps     { x, y, w, h: Coord }          // inches or %
TextProps         { text, options: TextPropsOptions }
TextPropsOptions  { bold, italic, color, fontSize, fontFace, align, valign,
                    underline, strike, hyperlink, bullet, indentLevel,
                    shadow, glow, line, fill }
TableProps        { x, y, w, h, colW, rowH, border, fill, align,
                    autoPage, autoPageRepeatHeader, fontSize }
TableCell         { text, options: TableCellProps }
ImageProps        { x, y, w, h, path, data, sizing, rounding, placeholder }
ShapeProps        { fill, line, shadow, rotate, flipH, flipV }
ShadowProps       { type, blur, offset, angle, color, opacity, rotateWithShape }
```

### Cherry-Picking Insights for Alecia

| What to Take | Where | How to Use |
|---|---|---|
| **`pptxgenjs` as-is (npm install)** | — | The primary **PPTX export engine**. Already referenced in AGENTS.md. Use `pptxgenjs` 4.x directly — no need to fork the source, just use the published package. |
| **`core-enums.ts` constants** | `src/core-enums.ts:9–31` | Import `EMU`, `ONEPT`, `DEF_SLIDE_MARGIN_IN`, `DEF_FONT_COLOR` in Alecia's slide renderer for pixel-accurate layout. Map Alecia's CSS pixel values to inches: `px / 96 = inches`. |
| **`ShapeType` enum** | `src/core-enums.ts:121–515` | Use as the complete shape vocabulary for Alecia's shape block (`Shape_Block`). Expose as a French-labelled dropdown in the block palette. |
| **`ChartType` enum + chart data format** | `src/core-enums.ts:109–120` | Alecia `Chart_Block` should store data as `{ labels: string[], values: number[], name: string }[]` matching the PptxGenJS `IOptsChartData` format so export is a direct pass-through. |
| **Slide Master API** | `src/gen-objects.ts:61–90` | Build Alecia's brand theme as a `SlideMasterProps` object: `bkgd: '061a40'` (Alecia Navy), corporate fonts, logo watermark. Define once in `seed.ts`, apply to all templates. |
| **`addTable` auto-pagination** | `src/gen-tables.ts:16–60` | For M&A comparison tables that span slides, use `autoPage: true, autoPageRepeatHeader: true` to auto-split across slides. |
| **`tableToSlides('tableId')`** | README | Import HTML `<table>` from WYSIWYG editor directly to PPTX slides. Useful for `Table_Block` → export path. |
| **`TextPropsOptions.bullet`** | `types/index.d.ts` | Use for `Liste` block rendering: `{ type: 'bullet', bulletChar: '•', indentLevel: n }`. |
| **Export to Blob pattern** | `types/index.d.ts:toBlob()` | In browser: `pres.writeFile()` triggers download. In server-side export: `pres.write('nodebuffer')` → stream to client. |
| **`createExcelWorksheet()`** | `src/gen-charts.ts:32–ff` | Understand the embedded Excel structure for Chart_Block data binding. Store chart data in SQLite `blocks.content.chartData` as the PptxGenJS-compatible array. |

### Cautions
- v4.0.1 breaks some v3 APIs: `bkgd` on slides is deprecated (use `background: { fill: 'XXXXXX' }`). Check the `CHANGELOG.md` for all v4 breaking changes before wiring.
- `image-size` and `https` are Node-only. In the Vite frontend build, the `"browser"` shims in `package.json` replace them with stubs. Do not call `addImage({ path: '/absolute/path' })` from browser code — only base64 data URIs work in browser context.
- The bundled `libs/jszip.min.js` and `libs/polyfill.min.js` are for CDN/standalone browser use. When using npm, JSZip is pulled from node_modules; do not double-bundle.
- Chart generation embeds a full Excel `.xlsx` inside the PPTX. This inflates file size for data-heavy presentations. For KPI cards, use text+shapes instead of charts unless the user actually needs Excel interactivity.

---

## Cross-Fork Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Alecia Node.js Backend                    │
│                                                             │
│  POST /import/pptx                POST /export/pptx         │
│       │                                    │                 │
│       ▼                                    ▼                 │
│  ┌─────────┐                      ┌──────────────┐          │
│  │ Docling │  ←── Python HTTP ──→ │  PptxGenJS   │          │
│  │ sidecar │  (Fork 3 preferred)  │  (npm pkg)   │          │
│  └─────────┘                      └──────────────┘          │
│       │                                    │                 │
│       ▼                                    ▲                 │
│  DoclingDocument JSON              Variable substitution     │
│       │                            via docxtemplater         │
│       ▼                            (Fork 2, npm pkg)        │
│  Map to Alecia Blocks                                        │
│  (using Fork 1 Block types)                                  │
│       │                                                      │
│       ▼                                                      │
│  SQLite slides table                                         │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Import Pipeline (PPTX → Alecia)

```
1. Express POST /import/pptx receives .pptx upload (multer)
2. Call Docling sidecar: DocumentConverter(SimplePipeline).convert(file)
3. Receive DoclingDocument JSON:
   - pages → slides
   - DocItem(TITLE) → { type: 'Titre', content: text, position: bbox }
   - DocItem(TABLE) → { type: 'Table_Block', data: tableData }
   - DocItem(PICTURE) → { type: 'Image', src: base64 }
4. Insert slides + blocks into SQLite
5. Return presentation_id to frontend
```

### Recommended Export Pipeline (Alecia → PPTX)

```
1. Express GET /export/pptx/:presentationId
2. Load slides + blocks from SQLite
3. Resolve variable_presets: run docxtemplater configuredParser
   on all block text fields replacing {{client}}, {{target}}, etc.
4. new pptxgen() → apply SlideMaster (brand theme)
5. For each slide → pres.addSlide()
   For each block:
     Titre        → slide.addText(text, { x,y,w,h, fontSize:28, bold:true, color:'FFFFFF' })
     Paragraphe   → slide.addText(text, { x,y,w,h, fontSize:12 })
     Table_Block  → slide.addTable(rows, { autoPage:true })
     Chart_Block  → slide.addChart(ChartType.bar, data)
     Image        → slide.addImage({ data: base64, x,y,w,h })
     KPI_Card     → slide.addShape(ShapeType.roundRect, fill) + slide.addText(value)
6. pres.write('nodebuffer') → stream to client as .pptx
```

---

## Priority Ranking for Implementation

| Priority | Action | Fork(s) | Effort |
|---|---|---|---|
| 🔴 P0 | Set up Docling Python sidecar (`SimplePipeline` only) | Fork 3 | Low |
| 🔴 P0 | Wire PptxGenJS export with Alecia Navy Slide Master | Fork 4 | Low |
| 🟠 P1 | Implement variable substitution via docxtemplater `configuredParser` | Fork 2 | Medium |
| 🟠 P1 | Map DoclingDocument block labels to Alecia block types | Fork 3 | Medium |
| 🟡 P2 | Add LLM table cleaning via MegaParse `LLMTableFormatter` | Fork 1 | Medium |
| 🟡 P2 | Implement French formatting filters on docxtemplater | Fork 2 | Low |
| 🟢 P3 | Add MegaParseVision for scanned PPTX/PDF import | Fork 1 | High |
| 🟢 P3 | Expose docxtemplater `Module` interface for custom Alecia extensions | Fork 2 | High |

---

## Important Notes on AGENTS.md Corrections

The `AGENTS.md` states:
> Fork 2 = "Prettier — code formatter (JS)"

This is **incorrect**. Fork 2 (`Forks_to_Adapt/2/`) is **docxtemplater v3.68.3** — an OOXML template engine for generating DOCX/PPTX from templates. It has nothing to do with Prettier (the code formatter). This is a significant and powerful tool for Alecia's **variable substitution** feature and should be treated as a core dependency.

---

_Analysis generated by sequential deep-read of all source files in Forks_to_Adapt/1, 2, 3, 4._
