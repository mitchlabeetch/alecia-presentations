'use client';
import { Modal } from './Modal';

const shortcuts = [
  {
    category: 'Général',
    items: [
      { keys: ['⌘', 'S'], description: 'Enregistrer le projet' },
      { keys: ['⌘', 'Z'], description: 'Annuler' },
      { keys: ['⌘', '⇧', 'Z'], description: 'Rétablir' },
      { keys: ['⌘', 'D'], description: 'Dupliquer la diapositive' },
      { keys: ['⌘', 'P'], description: 'Mode présentation' },
      { keys: ['⌘', 'C'], description: 'Copier' },
      { keys: ['⌘', 'V'], description: 'Coller' },
      { keys: ['⌘', ','], description: 'Paramètres' },
      { keys: ['Esc'], description: 'Fermer / Quitter' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['↑', '↓'], description: 'Diapositive précédente/suivante' },
      { keys: ['J', 'K'], description: 'Alternative navigation' },
      { keys: ['Tab'], description: 'Élément suivant' },
      { keys: ['⇧', 'Tab'], description: 'Élément précédent' },
    ],
  },
  {
    category: 'Édition',
    items: [
      { keys: ['Del'], description: 'Supprimer élément' },
      { keys: ['⌘', 'A'], description: 'Tout sélectionner' },
      { keys: ['←', '→', '↑', '↓'], description: 'Déplacer élément' },
      { keys: ['⇧', '←'], description: 'Réduire largeur' },
    ],
  },
];

export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Raccourcis clavier">
      <div className="space-y-6">
        {shortcuts.map((section) => (
          <div key={section.category}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
              {section.category}
            </h3>
            <div className="space-y-1">
              {section.items.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-200">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 bg-[#1e3a5f] border border-[#2d5a8a] rounded text-xs font-mono text-gray-200"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
