# Alecia PPTX Generator

Module de génération de présentations PowerPoint pour Alecia - Conseil en gestion de patrimoine.

## Installation

```bash
npm install pptxgenjs
```

## Utilisation

### Création rapide d'une présentation

```typescript
import { createPresentation, savePresentation } from './pptx';

const presentation = {
  title: 'Présentation Client',
  slides: [
    {
      type: 'title',
      title: 'Bienvenue chez Alecia',
      subtitle: 'Conseil en gestion de patrimoine',
    },
    {
      type: 'content',
      title: 'Nos Services',
      content: [
        { text: 'Gestion de patrimoine', level: 0 },
        { text: 'Conseil en investissement', level: 0 },
        { text: 'Planification successorale', level: 0 },
      ],
    },
  ],
};

// Sauvegarder la présentation
await savePresentation(presentation, 'ma-presentation.pptx');
```

### Utilisation avancée avec le générateur

```typescript
import { AleciaPptxGenerator } from './pptx';

const generator = new AleciaPptxGenerator({
  includeWatermark: true,
  includeLogo: true,
  includeFooter: true,
  includeDate: true,
  dateFormat: 'DD/MM/YYYY',
  language: 'fr',
});

const pptx = generator.generatePresentation({
  title: 'Ma Présentation',
  slides: [
    // ... slides
  ],
  variables: {
    clientName: 'Jean Dupont',
    date: '15/01/2024',
  },
});

await generator.save('presentation.pptx');
```

## Types de Slides

### 1. Title Slide
```typescript
{
  type: 'title',
  title: 'Titre principal',
  subtitle: 'Sous-titre optionnel',
  date: '15/01/2024',
  logo: '/path/to/logo.png',
}
```

### 2. Content Slide
```typescript
{
  type: 'content',
  title: 'Titre de la slide',
  content: [
    { text: 'Point 1', level: 0 },
    { text: 'Sous-point', level: 1 },
    { text: 'Point 2', level: 0 },
  ],
}
```

### 3. Two Column Slide
```typescript
{
  type: 'twoColumn',
  title: 'Titre',
  leftColumn: ['Item 1', 'Item 2'],
  rightColumn: ['Item 3', 'Item 4'],
}
```

### 4. Image Slide
```typescript
{
  type: 'image',
  title: 'Titre',
  imagePath: '/path/to/image.jpg',
  text: 'Description',
  layout: 'left', // 'full' | 'left' | 'right'
}
```

### 5. Chart Slide
```typescript
{
  type: 'chart',
  title: 'Performance',
  chartType: 'bar', // 'bar' | 'horizontalBar' | 'stackedBar' | 'line' | 'area' | 'pie' | 'doughnut'
  data: {
    categories: ['Jan', 'Fév', 'Mar'],
    series: [
      { name: '2023', data: [10, 20, 30] },
    ],
  },
}
```

### 6. Table Slide
```typescript
{
  type: 'table',
  title: 'Données',
  tableType: 'standard', // 'standard' | 'financial' | 'portfolio' | 'performance' | 'fee' | 'contact'
  data: {
    headers: ['Colonne 1', 'Colonne 2'],
    rows: [
      ['Valeur 1', 'Valeur 2'],
    ],
  },
}
```

### 7. Team Slide
```typescript
{
  type: 'team',
  title: 'Notre Équipe',
  members: [
    {
      name: 'Marie Martin',
      role: 'Directrice',
      photo: '/path/to/photo.jpg',
      description: '15 ans d\'expérience',
    },
  ],
}
```

### 8. Clients Slide
```typescript
{
  type: 'clients',
  title: 'Nos Clients',
  logos: [
    { name: 'Client 1', imagePath: '/path/to/logo1.png' },
    { name: 'Client 2', imagePath: '/path/to/logo2.png' },
  ],
}
```

### 9. Section Divider
```typescript
{
  type: 'sectionDivider',
  title: 'Nouvelle Section',
  subtitle: 'Description optionnelle',
}
```

### 10. Closing Slide
```typescript
{
  type: 'closing',
  thankYouText: 'Merci de votre attention',
  contactInfo: {
    company: 'Alecia',
    address: '123 Rue de Paris, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@alecia.fr',
    website: 'www.alecia.fr',
  },
}
```

## Variables de Substitution

Utilisez des placeholders dans vos slides:

```typescript
{
  slides: [
    {
      type: 'title',
      title: 'Bienvenue {{clientName}}',
    },
  ],
  variables: {
    clientName: 'Jean Dupont',
  },
}
```

## Couleurs de la Marque

- **Primary Dark**: `#0a1628` - Bleu marine foncé
- **Primary Main**: `#1e3a5f` - Bleu marine
- **Accent Main**: `#e91e63` - Rose
- **Text Primary**: `#ffffff` - Blanc
- **Text Secondary**: `#b0b0b0` - Gris clair

## API Référence

### AleciaPptxGenerator

#### Constructeur
```typescript
new AleciaPptxGenerator(options?: GenerationOptions)
```

#### Méthodes
- `generatePresentation(data: PresentationData): PptxGenJS` - Génère la présentation
- `save(fileName: string): Promise<void>` - Sauvegarde le fichier
- `getBuffer(): Promise<Blob | ArrayBuffer>` - Retourne le buffer
- `getBase64(): Promise<string>` - Retourne en base64
- `getPptxInstance(): PptxGenJS` - Retourne l'instance PptxGenJS

## Licence

Propriétaire - Alecia
