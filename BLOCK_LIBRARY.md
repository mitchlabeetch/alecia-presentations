# Alecia Block Library
## Drag-and-Drop Components for Presentation Creator

---

## Base Container

### Slide Canvas
```
┌─────────────────────────────────────────────────────────────┐
│  MARGIN TOP: 80px                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  CONTENT AREA (3840 x 2050px)                       │    │
│  │  Margins: 80px left/right                           │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│  MARGIN BOTTOM: 60px (footer)                               │
└─────────────────────────────────────────────────────────────┘
Total: 4000 x 2250px
```

---

## Layout Blocks

### L1: Single Column Full Width
**Purpose**: Legal text, introduction, simple content
```
┌────────────────────────────────────────┐
│ [Section Header]                       │
├────────────────────────────────────────┤
│                                        │
│  Full width content area               │
│  Justified text or centered            │
│                                        │
└────────────────────────────────────────┘
Width: 100%
```

### L2: Two Column 50/50
**Purpose**: Content + visual, text comparison
```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   LEFT COLUMN       │   RIGHT COLUMN      │
│   50%               │   50%               │
│                     │                     │
└─────────────────────┴─────────────────────┘
Gap: 32px
```

### L3: Two Column 40/60 (Content Heavy)
**Purpose**: Key points + supporting visual/map
```
┌────────────────┬──────────────────────────┐
│                │                          │
│   LEFT 40%     │   RIGHT 60%              │
│   Text/List    │   Visual/Map/Chart       │
│                │                          │
└────────────────┴──────────────────────────┘
Gap: 40px
```

### L4: Three Column Grid
**Purpose**: Objectives, key points, cards
```
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│   COL 1     │   COL 2     │   COL 3     │
│   33.3%     │   33.3%     │   33.3%     │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
Gap: 24px
```

### L5: Four Column Grid
**Purpose**: Methodology comparison, approaches
```
┌──────────┬──────────┬──────────┬──────────┐
│          │          │          │          │
│  COL 1   │  COL 2   │  COL 3   │  COL 4   │
│  25%     │  25%     │  25%     │  25%     │
│          │          │          │          │
└──────────┴──────────┴──────────┴──────────┘
Gap: 16px
```

### L6: Split Cover Layout
**Purpose**: Title slide
```
┌────────────────────────┬────────────────────────────────┐
│                        │                                │
│                        │                                │
│   LEFT 40%             │   RIGHT 60%                    │
│   Pattern Image        │   White background             │
│   (Full bleed)         │   Logo + Title                 │
│                        │                                │
│                        │                                │
└────────────────────────┴────────────────────────────────┘
```

---

## Component Blocks

### C1: Section Header Bar
```
┌────────────────────────────────────────────────────────────┐
│ ┌────┐                                                     │
│ │ I  │  Présentation d'alecia                               │
│ └────┘                                                     │
└────────────────────────────────────────────────────────────┘

Specs:
- Pill: 48 x 32px, border-radius: 16px
- Pill background: #b80c09
- Pill text: White, 14px, Bold, Centered
- Background bar: #e6e8ec, height: 32px, border-radius: 4px
- Title: #061a40, 16px, Semi-bold
- Spacing between pill and title: 12px
```

### C2: Content Card with Icon
```
┌─────────────────────────────┐
│                             │
│      [      ICON      ]     │  ← 64px icon, centered
│         64 x 64px           │
│                             │
├─────────────────────────────┤
│ CARD HEADER                 │  ← Dark navy bg (#061a40)
├─────────────────────────────┤
│                             │
│  › Bullet point one         │
│                             │
│  › Bullet point two         │  ← Red chevron bullets
│                             │
│  › Bullet point three       │
│                             │
└─────────────────────────────┘

Specs:
- Card background: #ffffff
- Border-radius: 12px
- Padding: 24px
- Header: Full width, #061a40 background, white text, 18px, Bold
- Icon container: 80px height, centered
- Bullet spacing: 12px between items
```

### C3: Comparison Card
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │  Vendor Assistance (VA)     │ │  ← Header bar
│ └─────────────────────────────┘ │
│                                 │
│  Work examples:                 │
│  › Point one                    │
│  › Point two                    │
│                                 │
├─────────────────────────────────┤
│  Key advantages:                │
│  + Advantage one                │  ← Green plus
│  + Advantage two                │
│  - Disadvantage one             │  ← Red minus
│                                 │
└─────────────────────────────────┘

Specs:
- Border: 1px solid #e6e8ec
- Preferred/highlighted: 2px dashed #b80c09 border
- Category labels: Left side, rotated or sidebar style
- Section spacing: 20px
```

### C4: Data Table
```
┌────────────┬────────────┬────────────┐
│  HEADER 1  │  HEADER 2  │  HEADER 3  │  ← #061a40 bg
├────────────┼────────────┼────────────┤
│ Row 1 Col 1│ Row 1 Col 2│ Row 1 Col 3│  ← White bg
├────────────┼────────────┼────────────┤
│ Row 2 Col 1│ Row 2 Col 2│ Row 2 Col 3│  ← #bfd7ea bg
├────────────┼────────────┼────────────┤
│ Row 3 Col 1│ Row 3 Col 2│ Row 3 Col 3│  ← White bg
└────────────┴────────────┴────────────┘

Specs:
- Header: #061a40, white text, 14px, semi-bold, padding: 12px 16px
- Row height: 44px
- Alternating row colors: White, #bfd7ea
- Cell padding: 10px 16px
- Text align: Center for headers, Left for body
- Border: 1px solid #e6e8ec
- Highlighted cell: Border 2px solid #061a40 or bg #ffff00
```

### C5: Matrix Table (Sensitivity Analysis)
```
┌────────────┬────────┬────────┬────────┐
│            │  40%   │  45%   │  50%   │
├────────────┼────────┼────────┼────────┤
│ 3.5x       │ 1 285  │ 1 445  │ 1 606  │
├────────────┼────────┼────────┼────────┤
│ 4.0x       │ 1 562  │ 1 757  │ 1 952  │
├────────────┼────────┼────────┼────────┤
│ 4.5x       │ 1 839  │ 2 069  │ 2 299  │
└────────────┴────────┴────────┴────────┘

Specs:
- Same as data table
- Row headers: Left column, #061a40 text, bold
- Column headers: Top row, #061a40 bg
- Data cells: Gradient blue background based on value
- Intersection highlight: Dark border around selected cell
```

### C6: Bullet List Variants
```
VARIANT 1: Standard Red Chevron
› Point one
› Point two
› Point three

VARIANT 2: Plus/Minus
+ Positive aspect one
+ Positive aspect two
- Negative aspect one
- Negative aspect two

VARIANT 3: Indented Sub-points
› Main point
  → Sub point one
  → Sub point two
› Another main point

Specs:
- Chevron: › #b80c09, 16px
- Plus: + #92d050, 16px, bold
- Minus: − #b80c09, 16px, bold
- Arrow: → #aab1be, 14px
- Item spacing: 12px
- Indent for sub-points: 24px
```

### C7: Process Step Indicator
```
   ┌──────┐
   │  1   │──────→┌──────┐
   │      │       │  2   │──────→ ...
   └──────┘       └──────┘
   Step text      Step text

OR VERTICAL:

┌──────┐
│  1   │
└──────┘
   │
┌──────┐
│  2   │
└──────┘
   │
┌──────┐
│  3   │
└──────┘

Specs:
- Circle: 48px diameter
- Circle background: #061a40
- Number: White, 18px, bold
- Connecting line: #e6e8ec, 3px thick
- Step title: 16px, bold, #061a40
- Step description: 14px, regular, #061a40
```

### C8: Logo/Partner Card
```
┌─────────────────────────────────┐
│ ┌──────┐                        │
│ │ LOGO │  Company Name          │  ← Logo 80x80px
│ │      │  Location              │  ← Location: #aab1be
│ └──────┘                        │
│                                 │
│  › Description point one        │
│  › Description point two        │
│                                 │
│  Contact: Name - Title          │  ← Bold label
└─────────────────────────────────┘

Specs:
- Card background: #fafafc or #ffffff
- Border: 1px solid #e6e8ec
- Border-radius: 8px
- Padding: 20px
- Logo size: 80 x 80px
- Logo margin-right: 16px
```

### C9: Info Box/Callout
```
┌─────────────────────────────────┐
│ │                               │
│ │  Information or context note  │
│ │  with highlighted background  │
│ │                               │
└─────────────────────────────────┘
↑
Left border accent

Specs:
- Background: #e3f2fd (info) or #fee9e8 (warning)
- Left border: 4px solid #4370a7 (info) or #b80c09 (warning)
- Padding: 20px
- Border-radius: 0 8px 8px 0 (rounded right corners only)
```

### C10: Pill Tag
```
ACTIVE:    [ I ]  Inactive:  [ I ]
           Bold text         Light text
           Dark border       Light border

RED:       [ Label ]
           White text on red bg

HIGHLIGHT: [ XXX ]
           Black text on yellow bg

Specs:
- Height: 32px
- Padding: 6px 16px
- Border-radius: 16px (pill shape)
- Font-size: 14px
```

### C11: Section List (TOC)
```
SOMMAIRE

┌────┐
│ I  │   Présentation d'alecia
└────┘
─────────────────────────────────
┌────┐
│ II │   Compréhension du contexte
└────┘   ← Bold, dark border (active)
─────────────────────────────────
┌────┐
│ III│   Pistes de valorisation
└────┘   ← Light, gray border (inactive)
─────────────────────────────────

Specs:
- Pill: 56px width
- Title: 16px
- Active: #061a40 text, 2px border
- Inactive: #aab1be text, 1px #e6e8ec border
- Separator: 1px solid #e6e8ec
- Vertical spacing: 16px between items
```

### C12: Flowchart Block
```
┌───────────┐
│  Box 1    │───┐
└───────────┘   │    ┌───────────┐
                └───→│  Box 2    │
                     └───────────┘

Specs:
- Box: Rounded rectangle, 8px radius
- Box colors: Various blues based on hierarchy
- Connecting line: 2px solid #e6e8ec or #061a40
- Arrowhead: Solid triangle
- Label on line: White bg, small text, centered on line
```

---

## Visual Assets

### V1: Diagonal Pattern
**Usage**: Cover slides, section dividers
- Full-bleed image
- Diagonal chevron pattern
- Gradient colors: Magenta → Orange → Gold → Teal → Purple
- Style: Layered geometric shapes with depth/shadows

### V2: Map (France)
**Usage**: Regional presence slides
- Simplified outline style
- Dark blue fill (#061a40)
- Location markers: Teardrop pins
- City labels: White text in rounded boxes

### V3: Icons
**Style**: Line icons, 2px stroke
**Color**: #061a40 (navy)
**Common set**:
- Coins/Stacked coins (finance)
- Magnifying glass + graph (analysis)
- Stopwatch (time/efficiency)
- Handshake (partnership)
- Building (company)
- Chart/Graph (data)
- Location pin (geography)

---

## Footer Component

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [alecia]            Projet XXX | Strictement confidentiel   5  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Specs:
- Height: 60px
- Separator line above: 1px solid #e6e8ec
- Logo: Left aligned, 32px height
- Confidentiality text: Centered, 14px, #aab1be
- Page number: Right aligned, 14px, #aab1be
- Margin from bottom: 20px
```

---

## Combination Patterns

### Pattern A: Objectives Slide (3 Cards)
```
[Section Header]

┌──────────┐  ┌──────────┐  ┌──────────┐
│  Icon    │  │  Icon    │  │  Icon    │
│  Header  │  │  Header  │  │  Header  │
│          │  │          │  │          │
│  › Pt 1  │  │  › Pt 1  │  │  › Pt 1  │
│  › Pt 2  │  │  › Pt 2  │  │  › Pt 2  │
│  › Pt 3  │  │  › Pt 3  │  │  › Pt 3  │
└──────────┘  └──────────┘  └──────────┘
```

### Pattern B: Methodology Comparison (4 Columns)
```
[Section Header]

┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Header │  │ Header │  │ Header │  │ Header │
├────────┤  ├────────┤  ├────────┤  ├────────┤
│        │  │        │  │        │  │        │
│ › Pt 1 │  │ › Pt 1 │  │ › Pt 1 │  │ › Pt 1 │
│ › Pt 2 │  │ › Pt 2 │  │ › Pt 2 │  │ › Pt 2 │
│        │  │        │  │        │  │        │
│+ Adv 1 │  │+ Adv 1 │  │+ Adv 1 │  │+ Adv 1 │
│+ Adv 2 │  │+ Adv 2 │  │+ Adv 2 │  │+ Adv 2 │
│- Dis 1 │  │- Dis 1 │  │- Dis 1 │  │- Dis 1 │
│        │  │        │  │        │  │        │
├────────┤  ├────────┤  ├────────┤  ├────────┤
│Pertin. │  │Pertin. │  │Pertin. │  │Pertin. │
└────────┘  └────────┘  └────────┘  └────────┘
```

### Pattern C: Comparison Slide (2 Scenarios)
```
[Section Header]

┌───────────────────────┐  ┌───────────────────────┐
│ SCENARIO A (Preferred)│  │ SCENARIO B            │
│ ┌───────────────────┐ │  │ ┌───────────────────┐ │
│ │ Logo strip        │ │  │ │ Logo strip        │ │
│ └───────────────────┘ │  │ └───────────────────┘ │
│                       │  │                       │
│ Duration: X months    │  │ Duration: Y months    │
│                       │  │                       │
│ Key elements:         │  │ Key elements:         │
│ › Element one         │  │ › Element one         │
│ › Element two         │  │ › Element two         │
│                       │  │                       │
│ + Advantage           │  │ + Advantage           │
│ - Disadvantage        │  │ - Disadvantage        │
│                       │  │                       │
│ Points of attention:  │  │ Points of attention:  │
│ › Point one           │  │ › Point one           │
└───────────────────────┘  └───────────────────────┘
```

---

## Quick Reference: Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 8px | Tight spacing, bullet gaps |
| `space-sm` | 12px | Small gaps, icon margins |
| `space-md` | 16px | Standard component padding |
| `space-lg` | 24px | Card padding, column gaps |
| `space-xl` | 32px | Section spacing, large gaps |
| `space-xxl` | 48px | Major section breaks |

---

## Quick Reference: Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Small buttons, tags |
| `radius-md` | 8px | Cards, boxes |
| `radius-lg` | 12px | Large cards |
| `radius-pill` | 9999px | Pills, tags, pills with text |

---

*This block library provides all components needed to recreate Alecia-style presentations using a drag-and-drop interface.*
