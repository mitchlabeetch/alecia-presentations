import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

interface Props {
  projectId: Id<"projects">;
  onSelectSlide: (idx: number) => void;
  slides: Doc<"slides">[];
}

export function SearchPanel({ projectId, onSelectSlide, slides }: Props) {
  const [query, setQuery] = useState("");
  const results = useQuery(api.search.searchSlides, query.trim() ? { projectId, query } : "skip") ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-[#1a3a5c]">🔍 Recherche</p>
        <p className="text-xs text-gray-400 mt-0.5">Trouvez du contenu dans votre présentation</p>
      </div>
      <div className="p-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher dans les diapositives..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]"
          autoFocus
        />
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {query.trim() && results.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Aucun résultat pour "{query}"</p>
        )}
        {results.map(slide => {
          const idx = slides.findIndex(s => s._id === slide._id);
          return (
            <button
              key={slide._id}
              onClick={() => onSelectSlide(idx)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-[#1a3a5c]/30 hover:bg-[#1a3a5c]/5 transition-all"
            >
              <p className="text-xs font-semibold text-[#1a3a5c] mb-1">{idx + 1}. {slide.title}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{slide.content}</p>
            </button>
          );
        })}
        {!query.trim() && (
          <div className="py-4">
            <p className="text-xs text-gray-400 mb-3">Toutes les diapositives :</p>
            {slides.map((slide, idx) => (
              <button
                key={slide._id}
                onClick={() => onSelectSlide(idx)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors mb-1"
              >
                <p className="text-xs font-medium text-gray-700">{idx + 1}. {slide.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
