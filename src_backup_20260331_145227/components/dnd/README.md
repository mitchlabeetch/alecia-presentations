# Système de Drag-and-Drop Alecia Presentations

Système complet de glisser-déposer pour l'application de présentations d'Alecia.

## Installation des dépendances

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Composants

### 1. SortableSlideList
Liste de slides réordonnables par glisser-déposer.

```tsx
import { SortableSlideList } from './components/dnd';

<SortableSlideList
  slides={slides}
  selectedSlideId={selectedSlideId}
  onSlideReorder={handleSlideReorder}
  onSlideSelect={handleSlideSelect}
  onSlideDelete={handleSlideDelete}
  onSlideDuplicate={handleSlideDuplicate}
  onSlideAdd={handleSlideAdd}
/>
```

### 2. DraggableSlide
Slide individuelle déplaçable.

```tsx
import { DraggableSlide } from './components/dnd';

<DraggableSlide
  slide={slide}
  isSelected={isSelected}
  onSelect={handleSelect}
  onDelete={handleDelete}
  onDuplicate={handleDuplicate}
/>
```

### 3. BlockLibrary
Bibliothèque de blocs de contenu disponibles.

```tsx
import { BlockLibrary } from './components/dnd';

<BlockLibrary
  onBlockSelect={handleBlockSelect}
  collapsed={isCollapsed}
  onToggleCollapse={handleToggle}
/>
```

### 4. DroppableCanvas
Zone de dépôt pour les blocs sur les slides.

```tsx
import { DroppableCanvas } from './components/dnd';

<DroppableCanvas
  slide={currentSlide}
  onBlockAdd={handleBlockAdd}
  onBlockMove={handleBlockMove}
  onBlockSelect={handleBlockSelect}
  onBlockDelete={handleBlockDelete}
  selectedBlockId={selectedBlockId}
  showGrid={true}
  snapToGrid={false}
/>
```

### 5. DraggableBlock
Bloc de contenu déplaçable.

```tsx
import { DraggableBlock } from './components/dnd';

<DraggableBlock
  type="Titre"
  label="Titre"
  description="Titre principal"
  icon="T"
  color="#e91e63"
  onClick={handleClick}
/>
```

### 6. DragOverlay
Superposition visuelle pendant le drag.

```tsx
import { DragOverlay } from './components/dnd';

<DragOverlay
  activeId={activeId}
  activeType={activeType}
  slideData={slideData}
  blockType={blockType}
/>
```

### 7. useDragAndDrop
Hook pour la gestion du drag-and-drop.

```tsx
import { useDragAndDrop } from './components/dnd';

const {
  sensors,
  dragState,
  handleDragStart,
  handleDragEnd,
  isDragging,
  isDraggingSlide,
  isDraggingBlock,
} = useDragAndDrop(slides, {
  onSlideReorder: handleReorder,
  onBlockAdd: handleBlockAdd,
});
```

## Types de blocs disponibles

| Type | Description | Icône |
|------|-------------|-------|
| Titre | Titre principal | T |
| Sous-titre | Sous-titre secondaire | S |
| Paragraphe | Bloc de texte | ¶ |
| Image | Image ou logo | 🖼️ |
| Graphique | Graphique et visualisation | 📊 |
| Tableau | Tableau de données | ▦ |
| Deux colonnes | Mise en page deux colonnes | ▌▐ |
| Liste | Liste à puces | ☰ |

## Types de drag

- `SLIDE` - Réordonnancement des slides
- `BLOCK` - Ajout de blocs de contenu
- `TEMPLATE` - Application de templates
- `IMAGE` - Ajout d'images

## Couleurs de la marque

- Bleu marine foncé : `#0a1628`
- Rose accent : `#e91e63`

## Exemple complet

```tsx
import React, { useState } from 'react';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableSlideList,
  BlockLibrary,
  DroppableCanvas,
  DragOverlay,
  useDragAndDrop,
  SlideData,
  BlockData,
} from './components/dnd';

const PresentationEditor: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const { sensors, handleDragStart, handleDragEnd } = useDragAndDrop(slides, {
    onSlideReorder: setSlides,
  });

  const currentSlide = slides.find(s => s.id === selectedSlideId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="editor-layout">
        <SortableSlideList
          slides={slides}
          selectedSlideId={selectedSlideId}
          onSlideReorder={setSlides}
          onSlideSelect={setSelectedSlideId}
        />
        
        {currentSlide && (
          <DroppableCanvas
            slide={currentSlide}
            onBlockAdd={(block, position) => {
              // Ajouter le bloc à la slide
            }}
          />
        )}
        
        <BlockLibrary />
      </div>
      
      <DragOverlay activeId={activeId} activeType={activeType} />
    </DndContext>
  );
};
```

## Support tactile

Le système est entièrement compatible avec les appareils tactiles grâce à :
- `TouchSensor` avec délai d'activation de 250ms
- `PointerSensor` pour une expérience unifiée
- Animations fluides pendant le drag

## Accessibilité

- Support complet du clavier avec `KeyboardSensor`
- Navigation par tabulation
- Retours visuels clairs
- Étiquettes et tooltips en français
