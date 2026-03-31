import React from 'react';
import { motion } from 'framer-motion';
import { TemplateCategory, categoryLabels, categoryIcons } from './useTemplates';

interface TemplateCategoriesProps {
  selectedCategory: TemplateCategory | 'all';
  onSelectCategory: (category: TemplateCategory | 'all') => void;
  categoryCounts: Record<string, number>;
  showCustomTab?: boolean;
  customCount?: number;
}

const allCategories: (TemplateCategory | 'all')[] = [
  'all',
  'pitch-deck',
  'levee-fonds',
  'cession',
  'acquisition',
  'financements-structures',
  'rapport',
  'equipe',
  'references'
];

const TemplateCategories: React.FC<TemplateCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  showCustomTab = true,
  customCount = 0
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Vérifier si on peut défiler
  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCount = (category: TemplateCategory | 'all') => {
    if (category === 'all') {
      return Object.values(categoryCounts).reduce((a, b) => a + b, 0) + customCount;
    }
    if (category === 'custom') {
      return customCount;
    }
    return categoryCounts[category] || 0;
  };

  return (
    <div className="relative">
      {/* Bouton défilement gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-[#0a1628] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Liste des catégories */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((category) => {
          const count = getCount(category);
          const isSelected = selectedCategory === category;
          const Icon = category === 'all' ? '📁' : categoryIcons[category as TemplateCategory];

          return (
            <motion.button
              key={category}
              onClick={() => onSelectCategory(category)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap
                font-medium text-sm transition-all duration-200 flex-shrink-0
                ${isSelected
                  ? 'bg-[#0a1628] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-base">{Icon}</span>
              <span>{categoryLabels[category]}</span>
              {count > 0 && (
                <span
                  className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full
                    ${isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {count}
                </span>
              )}
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#0a1628] rounded-full -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Onglet Mes Modèles */}
        {showCustomTab && (
          <motion.button
            onClick={() => onSelectCategory('custom')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap
              font-medium text-sm transition-all duration-200 flex-shrink-0
              ${selectedCategory === 'custom'
                ? 'bg-[#e91e63] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <span className="text-base">{categoryIcons['custom']}</span>
            <span>{categoryLabels['custom']}</span>
            {customCount > 0 && (
              <span
                className={`
                  ml-1 px-2 py-0.5 text-xs rounded-full
                  ${selectedCategory === 'custom'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#e91e63]/10 text-[#e91e63]'
                  }
                `}
              >
                {customCount}
              </span>
            )}
          </motion.button>
        )}
      </div>

      {/* Bouton défilement droit */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-[#0a1628] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Style pour masquer la scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TemplateCategories;
