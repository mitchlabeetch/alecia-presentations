# Alecia Presentation Design System
## Comprehensive Guide for Drag-and-Drop Presentation Creator

---

## 1. OVERVIEW

The **Alecia** presentation style is a professional, corporate financial advisory deck designed for M&A (Mergers & Acquisitions), fundraising, and acquisition consulting. It features a sophisticated navy-blue dominant color scheme with red accents, clean typography, and structured layouts optimized for financial data and business storytelling.

### Key Characteristics
- **Aspect Ratio**: 16:9 (4000x2250px)
- **Language**: French (financial/business terminology)
- **Industry**: Corporate Finance, M&A Advisory, Investment Banking
- **Tone**: Professional, Trustworthy, Authoritative

---

## 2. COLOR PALETTE

### Primary Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Navy Dark** | `#061a40` | `6, 26, 64` | Primary background, headers, main text |
| **Navy Medium** | `#0a2a68` | `10, 42, 104` | Secondary headers, chart elements |
| **Navy Light** | `#163e64` | `22, 62, 100` | Accent backgrounds |

### Accent Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Alecia Red** | `#b80c09` | `184, 12, 9` | Primary accent, bullets, call-to-action, active states |
| **Alecia Red Bright** | `#c00000` | `192, 0, 0` | Emphasis, warnings, highlighted text |
| **Success Green** | `#92d050` | `146, 208, 80` | Positive indicators, growth metrics |

### Neutral Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **White** | `#ffffff` | `255, 255, 255` | Content backgrounds, cards |
| **Off-White** | `#fafafc` | `250, 250, 252` | Main slide backgrounds |
| **Light Gray** | `#ecf0f6` | `236, 240, 246` | Subtle backgrounds, alternating rows |
| **Medium Gray** | `#e6e8ec` | `230, 232, 236` | Borders, dividers, table lines |
| **Steel Gray** | `#aab1be` | `170, 177, 190` | Secondary text, labels |
| **Cool Blue Light** | `#bfd7ea` | `191, 215, 234` | Table headers, chart backgrounds |
| **Cool Blue Medium** | `#749ac7` | `116, 154, 199` | Chart elements, secondary accents |
| **Deep Blue** | `#4370a7` | `67, 112, 167` | Data visualization, links |

### Semantic Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Light Pink/Error** | `#fee9e8` | Error states, negative highlights |
| **Light Blue** | `#e3f2fd` | Information boxes, info highlights |

---

## 3. TYPOGRAPHY

### Font Stack
- **Primary**: Sans-serif system fonts (likely Calibri, Arial, or Segoe UI)
- **Fallback**: `font-family: 'Calibri', 'Arial', sans-serif`

### Typography Hierarchy

| Level | Usage | Size (approx) | Weight | Color |
|-------|-------|---------------|--------|-------|
| **H1 - Page Title** | Main slide titles | 36-42px | Bold (700) | `#061a40` |
| **H2 - Section Header** | Column headers, card titles | 20-24px | Semi-Bold (600) | `#061a40` or `#ffffff` on dark |
| **H3 - Subsection** | List headers, item titles | 16-18px | Semi-Bold (600) | `#061a40` |
| **Body** | Paragraph text, descriptions | 14-16px | Regular (400) | `#061a40` |
| **Caption** | Labels, metadata, footnotes | 12-14px | Regular (400) | `#aab1be` or `#749ac7` |
| **Highlight** | Emphasized keywords | 14-16px | Bold (700) | `#b80c09` or `#061a40` |

### Typography Patterns
- **Bold keywords** within sentences (not entire paragraphs)
- *Italic* for foreign terms (English business terms in French context)
- Bullet points use `>` chevron as bullet symbol (not standard dots)
- Section numbers use Roman numerals (I, II, III, IV, V, VI, VII)

---

## 4. LAYOUT PATTERNS & FRAME TYPES

### 4.1 Cover Slide
**Template**: Split-screen layout
- **Left Panel (40%)**: Full-bleed diagonal pattern image (geometric chevrons in gradient colors: magenta, orange, teal, purple)
- **Right Panel (60%)**: White background with:
  - Logo placeholder (top-center, yellow highlight)
  - Project title (large, bold, centered)
- **Header Strip**: Navy blue with "CONFIDENTIEL" label
- **Footer**: Navy with "alecia" logo + tagline "Cession | Levée de fonds | Acquisition"

### 4.2 Table of Contents (Sommaire)
**Template**: Left content, right visual
- **Left (55%)**: 
  - "SOMMAIRE" header
  - Numbered sections (I-VII) with oval pill buttons
  - Active section: dark border, bold text
  - Inactive sections: light gray, lighter text
- **Right (45%)**: Full-height diagonal pattern image
- Vertical connecting lines between sections

### 4.3 Content Slide - Two Column
**Template**: Header + Two-column content
- **Header**: Red pill with Roman numeral + section title
- **Left Column**: Text content with bullet points
- **Right Column**: Supporting visual (map, chart, or infographic)
- Common for: Company overview, regional presence

### 4.4 Content Slide - Three Column Cards
**Template**: Header + Three equal cards
- Each card contains:
  - Icon (top, centered)
  - Card header (colored background bar)
  - Description text with red chevron bullets
- Card backgrounds: Varying shades of blue gradient
- Used for: Objectives, differentiators, key points

### 4.5 Comparison Slide (Two-Column)
**Template**: Side-by-side comparison
- Left: Scenario A (highlighted as preferred)
- Right: Scenario B
- Each column includes:
  - Header bar (colored)
  - Logo strip
  - Bullet points with structured categories
- Used for: LBO vs Industrial Sale, VA vs VDD comparison

### 4.6 Process/Timeline Slide
**Template**: Horizontal or vertical flow
- Numbered steps (1, 2, 3) with connecting arrows
- Each step has title and description
- Progression from left to right
- Used for: Process explanation, methodology steps

### 4.7 Data Table Slide
**Template**: Full-width table with:
- Dark blue header row with white text
- Alternating row backgrounds (white/light blue)
- Highlighted cells with borders or background color
- Matrix/two-way tables for sensitivity analysis
- Source citation bottom-right

### 4.8 Card Grid (4-Column)
**Template**: Four equal columns
- Each column:
  - Dark blue header bar with white title
  - Light blue content area with bullet points
  - Bottom bar with "Pertinence" label
- Used for: Methodology comparison (4 approaches)

### 4.9 Logo Grid Slide
**Template**: 2x2 or 3x2 grid of partner/client cards
- Each card:
  - Logo (left, small)
  - Company name (bold)
  - Location (light gray)
  - Description bullets
- Used for: Partnerships, ecosystem, local engagement

### 4.10 Warning/Legal Slide
**Template**: Full-width content
- "Avertissement" title with red chevron
- Body text in justified paragraphs
- Yellow highlight for placeholder text
- Footer with project name + confidentiality notice

---

## 5. UI COMPONENTS & BLOCKS

### 5.1 Section Header Bar
```
[RED PILL: I] [Section Title] -----
```
- Red oval pill with white Roman numeral
- Section title in bold navy
- Light gray background bar extending to right

### 5.2 Card Component
```
┌─────────────────────────────────┐
│  [ICON]                         │
│  ┌─────────────────────────┐    │
│  │ CARD HEADER (dark blue) │    │
│  └─────────────────────────┘    │
│                                 │
│  > Bullet point 1               │
│  > Bullet point 2               │
│  > Bullet point 3               │
│                                 │
│  [Red triangle accent left]     │
└─────────────────────────────────┘
```
- Background: White or light blue
- Header: Dark blue (#061a40) with white text
- Left accent: Red triangle for important notes
- Border-radius: 8-12px

### 5.3 Bullet Point Variants
1. **Standard**: `>` Red chevron + text
2. **Plus/Positive**: `+` Green plus for advantages
3. **Minus/Negative**: `-` Red minus for drawbacks
4. **Arrow**: `→` Gray arrow for sub-points

### 5.4 Pill/Tag Component
- **Section Indicator**: Red background, white text, rounded-full
- **Active State**: Dark border, filled
- **Inactive State**: Light border, transparent background
- **Highlight**: Yellow background (#ffff00) for editable placeholders

### 5.5 Table Component
```
┌──────────────┬──────────────┬──────────────┐
│ HEADER (dark)│ HEADER (dark)│ HEADER (dark)│
├──────────────┼──────────────┼──────────────┤
│ Row 1        │ Data         │ Data         │
├──────────────┼──────────────┼──────────────┤
│ Row 2 (alt)  │ Data         │ Data         │
└──────────────┴──────────────┴──────────────┘
```
- Header: Dark navy (#061a40), white text, centered
- Rows: White alternating with light blue (#bfd7ea)
- Borders: Light gray (#e6e8ec)
- Highlighted cells: Dark border or yellow background

### 5.6 Flowchart/Organigram Block
- Boxes with rounded corners (8px radius)
- Connecting arrows (straight or elbow)
- Color-coded by hierarchy:
  - Dark blue: Top level
  - Medium blue: Secondary
  - Light blue: Operational
- Percentage labels on connecting lines

### 5.7 Info Box
- Light blue background (#e3f2fd or #ecf0f6)
- Left border accent (optional)
- Padding: 16-24px
- Used for: Context notes, methodology explanations

### 5.8 Footer Component
```
[alecia logo]                    [Project Name | Strictement confidentiel]   [Page #]
```
- Left: Alecia logo (white on dark slides, dark on light slides)
- Center: Project name + confidentiality notice
- Right: Page number
- Full-width separator line above (light gray)

### 5.9 Comparison Matrix
- Side-by-side columns with clear visual separation
- Category labels on left side (vertical)
- Each cell contains bullet points
- Dashed red border around highlighted/important sections

---

## 6. ICONOGRAPHY

### Icon Style
- **Type**: Line icons, single-color
- **Color**: Navy blue (#061a40) or white on dark backgrounds
- **Size**: 48-64px for headers, 24-32px for inline
- **Background**: Often placed in light blue circles

### Common Icons Used
1. **Coins/Stacked coins** - Financial, liquidity
2. **Magnifying glass with graph** - Analysis, optimization
3. **Stopwatch** - Time management, efficiency
4. **Building/Company** - Corporate entities
5. **Handshake** - Partnership, agreements
6. **Chart/Graph** - Data, metrics
7. **Location pin** - Geography, presence
8. **Checkmark** - Validation, completion

---

## 7. DATA VISUALIZATION

### 7.1 Bar Charts
- Horizontal or vertical
- Navy blue bars with gradient variations
- Value labels inside or on top of bars
- Clean axis labels

### 7.2 Flow Diagrams
- Left-to-right progression
- Numbered circles (1, 2, 3) with connecting arrows
- Stage descriptions below
- Color-coded stages (red for current/active)

### 7.3 Sensitivity/Matrix Tables
- Two-axis grid
- Color gradient showing value ranges
- Highlighted intersection cells
- Clear row/column headers

### 7.4 Geographic Maps
- Simplified region maps (France focus)
- Location pins with city names
- Region labels in rounded boxes
- Dark blue silhouette style

---

## 8. BRANDING ASSETS

### 8.1 Logo Usage
- **Alecia Logo**: Lowercase "alecia" in sans-serif, modern type
- **Placement**: Bottom-left corner of every slide
- **Color Variants**: 
  - White version on dark backgrounds
  - Navy version on light backgrounds
- **Tagline**: "Cession | Levée de fonds | Acquisition" (on cover only)

### 8.2 Confidentiality Markers
- "CONFIDENTIEL" label on cover slide header
- "Strictement confidentiel" in footer of all content slides
- Yellow highlight boxes for editable/sensitive data

### 8.3 Visual Motif
- **Diagonal Chevron Pattern**: Signature visual element
- **Colors**: Gradient of magenta, orange, gold, teal, purple, blue
- **Usage**: Cover slide, section dividers, right-panel backgrounds
- **Style**: Layered diamond/chevron shapes with depth

---

## 9. SPACING & LAYOUT GRID

### Page Margins
- **Top**: ~80px (for header bar)
- **Bottom**: ~60px (for footer)
- **Left/Right**: ~60-80px

### Component Spacing
- **Between cards**: 24-32px
- **Card padding**: 20-24px
- **Section spacing**: 32-48px
- **Bullet spacing**: 8-12px between items

### Grid System
- **12-column grid** for flexible layouts
- **Gutter width**: 16-24px
- Common column splits: 50/50, 40/60, 33/33/33, 25/25/25/25

---

## 10. SLIDE TYPES QUICK REFERENCE

| Slide Type | Template ID | Primary Layout | Key Features |
|------------|-------------|----------------|--------------|
| Cover | T01 | Split 40/60 | Diagonal pattern, logo, project title |
| Table of Contents | T02 | List + Visual | Numbered sections, visual right panel |
| Two-Column Content | T03 | 50/50 split | Left text, right visual |
| Three Cards | T04 | 33/33/33 grid | Icon + header + bullets per card |
| Four Columns | T05 | 25x4 grid | Methodology comparison |
| Comparison | T06 | Side-by-side | Two scenarios with structured comparison |
| Data Table | T07 | Full-width | Matrix or simple table with headers |
| Process Flow | T08 | Horizontal | Numbered steps with arrows |
| Logo Grid | T09 | 2x2 or 3x2 | Partner/client cards with details |
| Legal/Warning | T10 | Full-width | Justified text, disclaimer |
| Financial Model | T11 | Complex grid | Tables + charts + organigrams |
| Timeline | T12 | Vertical/Horizontal | Sequential numbered items |
| Section Divider | T13 | Visual focus | Large visual + section title |

---

## 11. INTERACTIVE ELEMENTS (FOR DRAG-AND-DROP)

### Draggable Blocks

#### Block: Section Header
```
Props:
- sectionNumber: Roman numeral (I, II, III...)
- sectionTitle: String
- variant: 'default' | 'compact'
```

#### Block: Content Card
```
Props:
- icon: IconName (optional)
- header: String
- headerColor: 'navy' | 'blue' | 'red'
- bullets: Array<String>
- accent: 'none' | 'red-triangle' | 'green-plus' | 'red-minus'
```

#### Block: Data Table
```
Props:
- headers: Array<String>
- rows: Array<Array<String>>
- highlightCells: Array<{row, col}>
- variant: 'simple' | 'matrix' | 'comparison'
```

#### Block: Two-Column Comparison
```
Props:
- leftTitle: String
- rightTitle: String
- leftContent: ContentBlock
- rightContent: ContentBlock
- leftPreferred: Boolean
```

#### Block: Bullet List
```
Props:
- items: Array<String>
- style: 'chevron' | 'plus' | 'minus' | 'arrow'
- color: 'red' | 'green' | 'navy'
- boldKeywords: Boolean
```

#### Block: Info Highlight
```
Props:
- content: String
- type: 'info' | 'warning' | 'success'
- background: 'light-blue' | 'light-pink' | 'light-green'
```

#### Block: Logo Strip
```
Props:
- logos: Array<{src, alt}>
- layout: 'horizontal' | 'grid'
```

#### Block: Process Steps
```
Props:
- steps: Array<{number, title, description}>
- orientation: 'horizontal' | 'vertical'
```

---

## 12. ACCESSIBILITY NOTES

- Maintain high contrast ratios (navy on white, white on navy)
- Red accents should not be the sole indicator (use icons + color)
- Font sizes minimum 14px for readability
- Clear visual hierarchy through size and weight, not just color
- Consistent bullet patterns for screen reader compatibility

---

## 13. FILE NAMING CONVENTION

Based on the reference files:
```
[PROJECT_CODE] - [PROJECT_NAME] - Pitch v[VERSION]_compressed-[SLIDE_NUMBER].png

Example: 2510 - Projet XXX - Pitch vX_compressed-1.png
```

---

## 14. EXPORT SPECIFICATIONS

- **Format**: PNG (for individual slides)
- **Resolution**: 4000 x 2250px (16:9, high resolution)
- **Color Mode**: RGB
- **Compression**: Optimized for file size while maintaining quality

---

*This design system is based on the analysis of 116 slides from the Alecia pitch deck presentation. For implementation in a drag-and-drop presentation creator, ensure all color values, spacing, and typography are precisely matched to maintain brand consistency.*
