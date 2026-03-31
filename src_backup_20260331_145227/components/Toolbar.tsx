import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Type,
  Palette,
  ChevronDown,
  Undo,
  Redo,
  Quote,
  Code,
  Minus,
  Table
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Dropdown } from './Dropdown';

export interface ToolbarProps {
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onStrikethrough?: () => void;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
  onAlignJustify?: () => void;
  onBulletList?: () => void;
  onNumberedList?: () => void;
  onLink?: () => void;
  onImage?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onQuote?: () => void;
  onCode?: () => void;
  onHorizontalRule?: () => void;
  onTable?: () => void;
  activeFormats?: string[];
  canUndo?: boolean;
  canRedo?: boolean;
  fontSize?: string;
  onFontSizeChange?: (size: string) => void;
  fontFamily?: string;
  onFontFamilyChange?: (family: string) => void;
  color?: string;
  onColorChange?: (color: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignJustify,
  onBulletList,
  onNumberedList,
  onLink,
  onImage,
  onUndo,
  onRedo,
  onQuote,
  onCode,
  onHorizontalRule,
  onTable,
  activeFormats = [],
  canUndo = false,
  canRedo = false,
  fontSize = '16px',
  onFontSizeChange,
  fontFamily = 'Inter',
  onFontFamilyChange,
  color = '#ffffff',
  onColorChange,
}) => {
  const fontSizes = [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '28px', label: '28px' },
    { value: '32px', label: '32px' },
    { value: '40px', label: '40px' },
    { value: '48px', label: '48px' },
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Verdana', label: 'Verdana' },
  ];

  const colors = [
    '#ffffff', '#000000', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107',
    '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'
  ];

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    tooltip: string;
    disabled?: boolean;
  }> = ({ icon, onClick, isActive, tooltip, disabled }) => (
    <Tooltip content={tooltip} position="bottom">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-[#e91e63]/20 text-[#e91e63]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {icon}
      </button>
    </Tooltip>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-[#1e3a5f] mx-1" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d1a2d] border-b border-[#1e3a5f] px-4 py-2 flex items-center gap-1 flex-wrap"
    >
      {/* History */}
      <ToolbarButton
        icon={<Undo className="w-4 h-4" />}
        onClick={onUndo}
        tooltip="Annuler (Ctrl+Z)"
        disabled={!canUndo}
      />
      <ToolbarButton
        icon={<Redo className="w-4 h-4" />}
        onClick={onRedo}
        tooltip="Rétablir (Ctrl+Y)"
        disabled={!canRedo}
      />
      
      <ToolbarDivider />

      {/* Font Family */}
      <div className="relative">
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange?.(e.target.value)}
          className="appearance-none bg-transparent text-gray-300 text-sm py-2 pl-3 pr-8 rounded-lg hover:bg-white/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e91e63]/30"
        >
          {fontFamilies.map((f) => (
            <option key={f.value} value={f.value} className="bg-[#0d1a2d]">
              {f.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
      </div>

      {/* Font Size */}
      <div className="relative">
        <select
          value={fontSize}
          onChange={(e) => onFontSizeChange?.(e.target.value)}
          className="appearance-none bg-transparent text-gray-300 text-sm py-2 pl-3 pr-8 rounded-lg hover:bg-white/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e91e63]/30"
        >
          {fontSizes.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#0d1a2d]">
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
      </div>

      <ToolbarDivider />

      {/* Text Formatting */}
      <ToolbarButton
        icon={<Bold className="w-4 h-4" />}
        onClick={onBold}
        isActive={activeFormats.includes('bold')}
        tooltip="Gras (Ctrl+B)"
      />
      <ToolbarButton
        icon={<Italic className="w-4 h-4" />}
        onClick={onItalic}
        isActive={activeFormats.includes('italic')}
        tooltip="Italique (Ctrl+I)"
      />
      <ToolbarButton
        icon={<Underline className="w-4 h-4" />}
        onClick={onUnderline}
        isActive={activeFormats.includes('underline')}
        tooltip="Souligné (Ctrl+U)"
      />
      <ToolbarButton
        icon={<Strikethrough className="w-4 h-4" />}
        onClick={onStrikethrough}
        isActive={activeFormats.includes('strikethrough')}
        tooltip="Barré"
      />

      <ToolbarDivider />

      {/* Color Picker */}
      <Dropdown
        trigger={
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1">
            <Palette className="w-4 h-4" />
            <div 
              className="w-3 h-3 rounded-full border border-gray-600"
              style={{ backgroundColor: color }}
            />
          </button>
        }
        items={colors.map((c, i) => ({
          id: `color-${i}`,
          label: '',
          icon: (
            <div 
              className="w-6 h-6 rounded-full border border-gray-600"
              style={{ backgroundColor: c }}
            />
          ),
        }))}
        width="sm"
      />

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        icon={<AlignLeft className="w-4 h-4" />}
        onClick={onAlignLeft}
        isActive={activeFormats.includes('alignLeft')}
        tooltip="Aligner à gauche"
      />
      <ToolbarButton
        icon={<AlignCenter className="w-4 h-4" />}
        onClick={onAlignCenter}
        isActive={activeFormats.includes('alignCenter')}
        tooltip="Centrer"
      />
      <ToolbarButton
        icon={<AlignRight className="w-4 h-4" />}
        onClick={onAlignRight}
        isActive={activeFormats.includes('alignRight')}
        tooltip="Aligner à droite"
      />
      <ToolbarButton
        icon={<AlignJustify className="w-4 h-4" />}
        onClick={onAlignJustify}
        isActive={activeFormats.includes('alignJustify')}
        tooltip="Justifier"
      />

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        icon={<List className="w-4 h-4" />}
        onClick={onBulletList}
        isActive={activeFormats.includes('bulletList')}
        tooltip="Liste à puces"
      />
      <ToolbarButton
        icon={<ListOrdered className="w-4 h-4" />}
        onClick={onNumberedList}
        isActive={activeFormats.includes('numberedList')}
        tooltip="Liste numérotée"
      />

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarButton
        icon={<Link className="w-4 h-4" />}
        onClick={onLink}
        tooltip="Insérer un lien"
      />
      <ToolbarButton
        icon={<Image className="w-4 h-4" />}
        onClick={onImage}
        tooltip="Insérer une image"
      />
      <ToolbarButton
        icon={<Table className="w-4 h-4" />}
        onClick={onTable}
        tooltip="Insérer un tableau"
      />
      <ToolbarButton
        icon={<Quote className="w-4 h-4" />}
        onClick={onQuote}
        isActive={activeFormats.includes('quote')}
        tooltip="Citation"
      />
      <ToolbarButton
        icon={<Code className="w-4 h-4" />}
        onClick={onCode}
        isActive={activeFormats.includes('code')}
        tooltip="Code"
      />
      <ToolbarButton
        icon={<Minus className="w-4 h-4" />}
        onClick={onHorizontalRule}
        tooltip="Ligne horizontale"
      />
    </motion.div>
  );
};

export default Toolbar;
