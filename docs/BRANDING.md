# Alecia Brand Guidelines

## Identite de marque

Alecia est une marque specialisee dans les presentations M&A (fusions et acquisitions). L'identite visuelle reflete le professionnalisme, la clarte et la confiance.

## Couleurs

### Palette principale

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| Alecia Navy | `#061a40` | 6, 26, 64 | Texte principal, headers, backgrounds |
| Alecia Red | `#b80c09` | 184, 12, 9 | Accents, CTA, alertes |
| Off-White | `#fafafc` | 250, 250, 252 | Background principal |
| Silver | `#aab1be` | 170, 177, 190 | Texte secondaire, bordures |
| White | `#ffffff` | 255, 255, 255 | Cartes, zones de contenu |

### Couleurs semantiques

| Nom | Hex | Usage |
|-----|-----|-------|
| Success | `#10b981` | Confirmations, succes |
| Warning | `#f59e0b` | Avertissements |
| Error | `#ef4444` | Erreurs, alertes |
| Info | `#3b82f6` | Informations |

### Couleurs du spectre (Graphiques)

| Nom | Hex |
|-----|-----|
| Spectrum 1 | `#3b82f6` |
| Spectrum 2 | `#8b5cf6` |
| Spectrum 3 | `#06b6d4` |
| Spectrum 4 | `#10b981` |
| Spectrum 5 | `#f59e0b` |
| Spectrum 6 | `#ef4444` |

### Usage des couleurs

```css
/* Background principal */
body {
  background-color: #fafafc;
}

/* Headers et texte important */
h1, h2, h3, .header {
  color: #061a40;
}

/* Boutons principaux */
.btn-primary {
  background-color: #061a40;
  color: #ffffff;
}

/* Accents et liens */
.link, .accent {
  color: #b80c09;
}

/* Texte secondaire */
.text-muted {
  color: #aab1be;
}
```

## Typographie

### Familles de polices

| Usage | Police | Fallback |
|-------|--------|----------|
| Presentations | Bierstadt | Georgia, serif |
| Interface UI | Inter | system-ui, sans-serif |
| Code/Mono | JetBrains Mono | monospace |

### Hierarchie typographique

```css
/* Titres H1 */
h1 {
  font-family: 'Inter', sans-serif;
  font-size: 2rem;      /* 32px */
  font-weight: 700;
  line-height: 1.2;
  color: #061a40;
}

/* Titres H2 */
h2 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
  line-height: 1.3;
  color: #061a40;
}

/* Titres H3 */
h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;   /* 20px */
  font-weight: 600;
  line-height: 1.4;
  color: #061a40;
}

/* Corps de texte */
p, body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;      /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: #061a40;
}

/* Texte petit */
small, .text-sm {
  font-size: 0.875rem;  /* 14px */
}

/* Texte tres petit */
.text-xs {
  font-size: 0.75rem;    /* 12px */
}
```

## Espacement

### Systeme de grille

Base: 8px

| Token | Valeur | Usage |
|-------|--------|-------|
| `--space-1` | 4px | Espacement fin |
| `--space-2` | 8px | Espacement element |
| `--space-3` | 12px | Padding compact |
| `--space-4` | 16px | Padding standard |
| `--space-5` | 20px | Marges moyennes |
| `--space-6` | 24px | Marges larges |
| `--space-8` | 32px | Sections |
| `--space-12` | 48px | Sections grandes |
| `--space-16` | 64px | Espacement hero |

### Tailwind equivalents

```javascript
// Dans tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '8': '32px',
      '12': '48px',
      '16': '64px',
    }
  }
}
```

## Ombres et elevations

```css
/* Petit - Cartes leggeres */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(6, 26, 64, 0.05);
}

/* Standard - Cartes */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(6, 26, 64, 0.1);
}

/* Grand - Modales */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(6, 26, 64, 0.1);
}

/* Extra - Dropdowns */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(6, 26, 64, 0.1);
}
```

## Bordures et rayons

```css
/* Rayons standard */
.rounded {
  border-radius: 0.375rem; /* 6px */
}

.rounded-lg {
  border-radius: 0.5rem; /* 8px */
}

.rounded-xl {
  border-radius: 0.75rem; /* 12px */
}

/* Bordures */
.border {
  border-width: 1px;
  border-color: #aab1be;
}

.border-2 {
  border-width: 2px;
}
```

## Composants UI

### Boutons

```css
/* Primaire */
.btn-primary {
  background-color: #061a40;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
}

/* Secondaire */
.btn-secondary {
  background-color: transparent;
  color: #061a40;
  border: 1px solid #061a40;
  padding: 12px 24px;
  border-radius: 6px;
}

/* Danger */
.btn-danger {
  background-color: #b80c09;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
}

/* Hover */
.btn-primary:hover {
  background-color: #0a2460;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Inputs

```css
.input {
  border: 1px solid #aab1be;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 1rem;
  transition: border-color 0.15s;
}

.input:focus {
  border-color: #061a40;
  outline: none;
  box-shadow: 0 0 0 3px rgba(6, 26, 64, 0.1);
}

.input-error {
  border-color: #ef4444;
}
```

### Cartes

```css
.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(6, 26, 64, 0.1);
  padding: 24px;
}
```

## Responsive

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `sm` | 640px | Mobile paysage |
| `md` | 768px | Tablette |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Grand ecran |

## Logos

### Logo principal

[Voir alecia_components_spec.json](../alecia_components_spec.json)

Le logo Alecia utilise le bleu navy `#061a40` sur fond transparent ou blanc.

### Favicon

Utiliser le symbole "A" dans le style Alecia.

## Assets

Tous les assets sont dans `/public/`:
- `/public/logos/` - Logos en plusieurs formats
- `/public/icons/` - Icones UI
- `/public/images/` - Images de demonstration
- `/public/fonts/` - Polices personnelles

## Iconographie

Utiliser Lucide React pour les icones UI.

```tsx
import { FileText, Settings, Download } from 'lucide-react';

// Taille standard: 20px (default)
// Tailles disponibles: 16, 20, 24, 32
```

## Animation

### Durations

```css
--duration-fast: 150ms;    /* Hover, transitions courtes */
--duration-normal: 200ms;  /* Apparition, disparition */
--duration-slow: 300ms;    /* Transitions complexes */
```

### Easings

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```
