import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Share2,
  Download,
  Play,
  MoreVertical,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { Tooltip } from './Tooltip';
import { Badge } from './Badge';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  currentSlide?: number;
}

export interface HeaderProps {
  title?: string;
  onTitleChange?: (title: string) => void;
  collaborators?: Collaborator[];
  onSearch?: (query: string) => void;
  onShare?: () => void;
  onExport?: () => void;
  onPresent?: () => void;
  onOpenChat?: () => void;
  notifications?: number;
  isPresenting?: boolean;
  userAvatar?: string;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Présentation sans titre',
  onTitleChange,
  collaborators = [],
  onSearch,
  onShare,
  onExport,
  onPresent,
  onOpenChat,
  notifications = 0,
  isPresenting = false,
  userAvatar,
  userName = 'Utilisateur',
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showSearch, setShowSearch] = useState(false);

  const handleTitleSubmit = () => {
    if (editedTitle.trim()) {
      onTitleChange?.(editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
    setIsEditingTitle(false);
  };

  const moreOptions = [
    { id: 'duplicate', label: 'Dupliquer', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'history', label: 'Historique', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Paramètres', icon: <MoreVertical className="w-4 h-4" /> },
  ];

  return (
    <header className="h-16 bg-[#0a1628] border-b border-[#1e3a5f] flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        {/* Title */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <motion.input
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              autoFocus
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="bg-[#0d1a2d] border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-white text-lg font-medium focus:outline-none focus:border-[#c9a84c]"
            />
          ) : (
            <motion.h1
              className="text-lg font-medium text-white cursor-pointer hover:text-[#c9a84c] transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </motion.h1>
          )}
        </div>

        {/* Search */}
        <AnimatePresence>
          {showSearch ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <Input
                placeholder="Rechercher..."
                leftIcon={<Search className="w-4 h-4" />}
                onChange={(e) => onSearch?.(e.target.value)}
                autoFocus
              />
            </motion.div>
          ) : (
            <Tooltip content="Rechercher" position="bottom">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>

      {/* Center Section - Collaborators */}
      <div className="flex items-center gap-3">
        {collaborators.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1a2d] rounded-full border border-[#1e3a5f]">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex -space-x-2">
              {collaborators.slice(0, 4).map((collab, index) => (
                <Tooltip
                  key={collab.id}
                  content={`${collab.name} ${collab.isActive ? '(actif)' : ''}`}
                  position="bottom"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                      border-2 border-[#0a1628] relative
                    `}
                    style={{ backgroundColor: collab.color }}
                  >
                    {collab.avatar ? (
                      <img
                        src={collab.avatar}
                        alt={collab.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      collab.name.charAt(0).toUpperCase()
                    )}
                    {collab.isActive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a1628]" />
                    )}
                  </motion.div>
                </Tooltip>
              ))}
              {collaborators.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center text-xs text-gray-400 border-2 border-[#0a1628]">
                  +{collaborators.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* AI Chat Button */}
        <Tooltip content="Assistant IA" position="bottom">
          <button
            onClick={onOpenChat}
            className="p-2 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Comments */}
        <Tooltip content="Commentaires" position="bottom">
          <button
            onClick={onOpenChat}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative"
          >
            <MessageSquare className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a84c] rounded-full text-[10px] flex items-center justify-center text-[#0a1628] font-medium">
                {notifications}
              </span>
            )}
          </button>
        </Tooltip>

        {/* Notifications */}
        <Tooltip content="Notifications" position="bottom">
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9a84c] rounded-full" />
            )}
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-[#1e3a5f] mx-1" />

        {/* Export */}
        <Tooltip content="Exporter" position="bottom">
          <button
            onClick={onExport}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Share */}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Share2 className="w-4 h-4" />}
          onClick={onShare}
        >
          Partager
        </Button>

        {/* Present */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Play className="w-4 h-4" />}
          onClick={onPresent}
        >
          Présenter
        </Button>

        {/* More Options */}
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          }
          items={moreOptions}
          align="right"
        />

        {/* User Avatar */}
        <Tooltip content={userName} position="bottom">
          <button className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#b8973d] flex items-center justify-center text-[#0a1628] font-medium text-sm overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </button>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
