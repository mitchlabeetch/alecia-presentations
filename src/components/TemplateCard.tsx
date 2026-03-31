import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Users, MoreVertical, Eye, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Dropdown } from './Dropdown';
import { Tooltip } from './Tooltip';

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  isFavorite?: boolean;
  usageCount?: number;
  lastUsed?: string;
  author?: string;
  slidesCount?: number;
  colorScheme?: string[];
}

export interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onToggleFavorite?: () => void;
  onUse?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  selected?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onClick,
  onPreview,
  onDuplicate,
  onToggleFavorite,
  onUse,
  variant = 'default',
  selected = false,
}) => {
  const menuItems = [
    {
      id: 'preview',
      label: 'Aperçu',
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: 'duplicate',
      label: 'Dupliquer',
      icon: <Copy className="w-4 h-4" />,
    },
  ];

  const handleMenuSelect = (item: { id: string }) => {
    switch (item.id) {
      case 'preview':
        onPreview?.();
        break;
      case 'duplicate':
        onDuplicate?.();
        break;
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          group relative bg-[#111d2e] rounded-xl overflow-hidden cursor-pointer
          border transition-all duration-200
          ${selected 
            ? 'border-[#e91e63] ring-2 ring-[#e91e63]/30' 
            : 'border-[#1e3a5f] hover:border-[#3a5a7f]'
          }
        `}
      >
        {/* Thumbnail */}
        <div className="aspect-[16/10] bg-gradient-to-br from-[#1e3a5f] to-[#0d1a2d] relative overflow-hidden">
          {template.thumbnail ? (
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ 
                  background: template.colorScheme 
                    ? `linear-gradient(135deg, ${template.colorScheme[0]}, ${template.colorScheme[1] || template.colorScheme[0]})`
                    : 'linear-gradient(135deg, #e91e63, #9c27b0)'
                }}
              >
                {template.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className={`
              absolute top-2 right-2 p-1.5 rounded-lg transition-all
              ${template.isFavorite 
                ? 'bg-[#e91e63] text-white' 
                : 'bg-black/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#e91e63]'
              }
            `}
          >
            <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-medium text-white text-sm truncate">{template.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{template.category}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <Card 
      hoverable 
      clickable
      onClick={onClick}
      className={`
        ${selected ? 'ring-2 ring-[#e91e63]' : ''}
      `}
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] -mx-5 -mt-5 mb-4 bg-gradient-to-br from-[#1e3a5f] to-[#0d1a2d] relative overflow-hidden">
        {template.thumbnail ? (
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white"
              style={{ 
                background: template.colorScheme 
                  ? `linear-gradient(135deg, ${template.colorScheme[0]}, ${template.colorScheme[1] || template.colorScheme[0]})`
                  : 'linear-gradient(135deg, #e91e63, #9c27b0)'
              }}
            >
              {template.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Aperçu
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUse?.();
            }}
            className="px-4 py-2 bg-[#e91e63] text-white rounded-lg hover:bg-[#d81b60] transition-colors"
          >
            Utiliser
          </button>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className={`
            absolute top-3 right-3 p-2 rounded-lg transition-all
            ${template.isFavorite 
              ? 'bg-[#e91e63] text-white' 
              : 'bg-black/50 text-gray-400 hover:text-[#e91e63]'
            }
          `}
        >
          <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{template.name}</h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{template.description}</p>
        </div>
        <Dropdown
          trigger={
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors ml-2"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          items={menuItems}
          onSelect={handleMenuSelect}
          align="right"
        />
      </div>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" size="sm">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <CardFooter className="mt-4 pt-4">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {template.slidesCount !== undefined && (
            <Tooltip content="Nombre de diapositives" position="bottom">
              <div className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{template.slidesCount} slides</span>
              </div>
            </Tooltip>
          )}
          {template.usageCount !== undefined && (
            <Tooltip content="Nombre d'utilisations" position="bottom">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{template.usageCount}</span>
              </div>
            </Tooltip>
          )}
          {template.lastUsed && (
            <Tooltip content="Dernière utilisation" position="bottom">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{template.lastUsed}</span>
              </div>
            </Tooltip>
          )}
        </div>
        {template.author && (
          <span className="text-xs text-gray-500">
            par {template.author}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
