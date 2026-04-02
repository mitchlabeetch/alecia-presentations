import type { BlockContent } from '@/types';

interface ImageBlockProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function ImageBlock({ content, isEditing = false, onChange }: ImageBlockProps) {
  const imageUrl = content.imageUrl || '';
  const caption = content.caption || '';
  const alt = content.alt || 'Image';

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, imageUrl: e.target.value });
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, caption: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <div className="bg-alecia-silver/10 rounded-xl aspect-video flex items-center justify-center mb-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-alecia-silver text-center">
              <p>Cliquez pour ajouter une image</p>
              <p className="text-xs mt-2">URL de l'image:</p>
              <input
                type="text"
                value={imageUrl}
                onChange={handleUrlChange}
                className="mt-1 px-3 py-1 text-sm border border-alecia-silver/30 rounded"
                placeholder="https://..."
              />
            </div>
          )}
        </div>
        <input
          type="text"
          value={caption}
          onChange={handleCaptionChange}
          className="w-full text-center text-sm text-alecia-silver bg-transparent border-none outline-none"
          placeholder="Légende de l'image (optionnel)"
        />
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-alecia-silver">Aucune image</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="bg-alecia-silver/10 rounded-xl aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      {caption && (
        <p className="text-center text-sm text-alecia-silver mt-2">{caption}</p>
      )}
    </div>
  );
}
