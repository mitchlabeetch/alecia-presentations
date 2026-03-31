import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MousePointer2,
  MessageSquare,
  MoreHorizontal,
  Phone,
  ScreenShare,
  Crown,
  Circle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Badge } from './Badge';
import { Tooltip } from './Tooltip';
import { Dropdown } from './Dropdown';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  isOnline: boolean;
  isOwner?: boolean;
  currentSlide?: number;
  cursorPosition?: { x: number; y: number };
  lastSeen?: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: ('edit' | 'comment' | 'share')[];
}

export interface CollaborationIndicatorProps {
  collaborators: Collaborator[];
  currentUserId: string;
  onInviteClick?: () => void;
  onUserClick?: (user: Collaborator) => void;
  onStartCall?: () => void;
  onStartScreenShare?: () => void;
  showCursors?: boolean;
  maxVisible?: number;
}

const roleLabels: Record<string, string> = {
  owner: 'Propriétaire',
  editor: 'Éditeur',
  viewer: 'Lecteur',
};

const roleColors: Record<string, string> = {
  owner: 'bg-yellow-500/20 text-yellow-400',
  editor: 'bg-blue-500/20 text-blue-400',
  viewer: 'bg-gray-500/20 text-gray-400',
};

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  collaborators,
  currentUserId,
  onInviteClick,
  onUserClick,
  onStartCall,
  onStartScreenShare,
  showCursors = true,
  maxVisible = 5,
}) => {
  const [showAll, setShowAll] = useState(false);

  const activeCollaborators = collaborators.filter((c) => c.isActive && c.isOnline);
  const onlineCollaborators = collaborators.filter((c) => c.isOnline);
  const offlineCollaborators = collaborators.filter((c) => !c.isOnline);

  const visibleCollaborators = activeCollaborators.slice(0, maxVisible);
  const remainingCount = Math.max(0, activeCollaborators.length - maxVisible);

  const getUserMenuItems = (user: Collaborator) => [
    {
      id: 'profile',
      label: 'Voir le profil',
      icon: <User className="w-4 h-4" />,
    },
    ...(user.isOnline
      ? [
          {
            id: 'message',
            label: 'Envoyer un message',
            icon: <MessageSquare className="w-4 h-4" />,
          },
        ]
      : []),
    { id: 'divider1', label: '', divider: true },
    ...(user.role !== 'owner'
      ? [
          {
            id: 'changeRole',
            label: 'Modifier le rôle',
            icon: <Crown className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: 'remove',
      label: 'Retirer',
      icon: <Circle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      {/* Active Users Stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {visibleCollaborators.map((collaborator, index) => (
            <Tooltip
              key={collaborator.id}
              content={
                <div className="text-left">
                  <p className="font-medium text-white">{collaborator.name}</p>
                  <p className="text-xs text-gray-400">{collaborator.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" size="sm" className={roleColors[collaborator.role]}>
                      {roleLabels[collaborator.role]}
                    </Badge>
                    {collaborator.currentSlide !== undefined && (
                      <span className="text-xs text-gray-500">
                        Slide {collaborator.currentSlide}
                      </span>
                    )}
                  </div>
                </div>
              }
              position="bottom"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onUserClick?.(collaborator)}
                className={`
                  relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                  border-2 border-[#0a1628] cursor-pointer hover:scale-110 transition-transform
                  ${collaborator.id === currentUserId ? 'ring-2 ring-[#e91e63]' : ''}
                `}
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.avatar ? (
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  collaborator.name.charAt(0).toUpperCase()
                )}

                {/* Online Status */}
                <span
                  className={`
                  absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a1628]
                  ${collaborator.isOnline ? 'bg-green-500' : 'bg-gray-500'}
                `}
                />

                {/* Owner Crown */}
                {collaborator.isOwner && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-yellow-900" />
                  </span>
                )}
              </motion.div>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowAll(true)}
              className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-xs font-medium text-white border-2 border-[#0a1628] hover:bg-[#2a4a73] transition-colors"
            >
              +{remainingCount}
            </motion.button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0d1a2d] border border-[#1e3a5f]">
        {onlineCollaborators.length > 0 ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs text-gray-400">{onlineCollaborators.length} en ligne</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Hors ligne</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <Tooltip content="Démarrer un appel" position="bottom">
          <button
            onClick={onStartCall}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content="Partager l'écran" position="bottom">
          <button
            onClick={onStartScreenShare}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ScreenShare className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Invite Button */}
      <button
        onClick={onInviteClick}
        className="px-3 py-1.5 bg-[#e91e63] hover:bg-[#d81b60] text-white text-sm font-medium rounded-lg transition-colors"
      >
        Inviter
      </button>

      {/* All Users Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAll(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a1628] rounded-2xl border border-[#1e3a5f] shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-[#1e3a5f] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Collaborateurs</h3>
                <button
                  onClick={() => setShowAll(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {/* Online Users */}
                <div className="p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    En ligne ({onlineCollaborators.length})
                  </h4>
                  <div className="space-y-2">
                    {onlineCollaborators.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1e3a5f]/50 transition-colors group"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white truncate">{user.name}</span>
                            {user.isOwner && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                          </div>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                        <Badge variant="outline" size="sm" className={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                        <Dropdown
                          trigger={
                            <button className="p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/5 transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          }
                          items={getUserMenuItems(user)}
                          align="right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offline Users */}
                {offlineCollaborators.length > 0 && (
                  <div className="p-4 border-t border-[#1e3a5f]">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Hors ligne ({offlineCollaborators.length})
                    </h4>
                    <div className="space-y-2">
                      {offlineCollaborators.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 rounded-xl opacity-60 hover:opacity-80 transition-opacity"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium grayscale"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-white truncate">{user.name}</span>
                            <span className="text-xs text-gray-500 block">
                              {user.lastSeen ? `Vu ${user.lastSeen}` : 'Jamais connecté'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Overlays */}
      {showCursors &&
        activeCollaborators.map(
          (collaborator) =>
            collaborator.cursorPosition &&
            collaborator.id !== currentUserId && (
              <motion.div
                key={collaborator.id}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x: collaborator.cursorPosition.x,
                  y: collaborator.cursorPosition.y,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                className="fixed pointer-events-none z-50"
                style={{ left: 0, top: 0 }}
              >
                <MousePointer2
                  className="w-5 h-5"
                  style={{ color: collaborator.color }}
                  fill={collaborator.color}
                />
                <span
                  className="ml-4 px-2 py-0.5 rounded text-xs text-white font-medium whitespace-nowrap"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </span>
              </motion.div>
            )
        )}
    </div>
  );
};

export default CollaborationIndicator;
