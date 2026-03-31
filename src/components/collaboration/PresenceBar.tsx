/**
 * Barre de présence - Affiche les utilisateurs actifs avec leurs avatars
 * Alecia Presentations - Composant de collaboration
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { User, UserStatus } from '../../types/collaboration';
import { STATUS_LABELS, ROLE_LABELS } from '../../types/collaboration';

interface PresenceBarProps {
  users: User[];
  currentUser: User | null;
  maxVisible?: number;
  onUserClick?: (user: User) => void;
  onInviteClick?: () => void;
  className?: string;
}

// Générer les initiales à partir du nom
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Obtenir la couleur de fond pour un avatar
function getAvatarColor(name: string): string {
  const colors = [
    '#e91e63', '#2196f3', '#4caf50', '#ff9800',
    '#9c27b0', '#00bcd4', '#f44336', '#795548',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Icône de statut en ligne
const OnlineIndicator: React.FC<{ status: UserStatus; color: string }> = ({ status, color }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'editing': return color;
      case 'away': return '#ff9800';
      case 'offline': return '#9e9e9e';
      default: return '#4caf50';
    }
  };

  return (
    <span
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(),
        border: '2px solid #0a1628',
        boxShadow: status === 'editing' ? `0 0 4px ${color}` : 'none',
      }}
    />
  );
};

// Avatar utilisateur
const UserAvatar: React.FC<{
  user: User;
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
  isCurrentUser?: boolean;
  onClick?: () => void;
}> = ({ user, size = 'medium', showStatus = true, isCurrentUser = false, onClick }) => {
  const sizeMap = {
    small: { width: 28, height: 28, fontSize: '10px' },
    medium: { width: 36, height: 36, fontSize: '12px' },
    large: { width: 48, height: 48, fontSize: '16px' },
  };

  const dimensions = sizeMap[size];
  const bgColor = user.color || getAvatarColor(user.name);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '50%',
        backgroundColor: user.avatar ? 'transparent' : bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        border: isCurrentUser ? `2px solid ${bgColor}` : '2px solid transparent',
        boxShadow: isCurrentUser ? `0 0 8px ${bgColor}40` : 'none',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      title={`${user.name} (${STATUS_LABELS[user.status]})`}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span
          style={{
            color: '#ffffff',
            fontSize: dimensions.fontSize,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {getInitials(user.name)}
        </span>
      )}
      {showStatus && <OnlineIndicator status={user.status} color={bgColor} />}
    </div>
  );
};

// Infobulle utilisateur
const UserTooltip: React.FC<{ user: User; isCurrentUser?: boolean }> = ({ user, isCurrentUser = false }) => {
  return (
    <div
      style={{
        backgroundColor: '#1a2744',
        border: '1px solid #2a3a54',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '200px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <UserAvatar user={user} size="large" showStatus={false} />
        <div>
          <div
            style={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {user.name} {isCurrentUser && '(Vous)'}
          </div>
          <div
            style={{
              color: '#8b9ab0',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {user.email}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #2a3a54',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: user.status === 'editing' ? `${user.color}20` : '#4caf5020',
            color: user.status === 'editing' ? user.color : '#4caf50',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: user.status === 'editing' ? user.color : '#4caf50',
            }}
          />
          {STATUS_LABELS[user.status]}
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: '#2a3a54',
            color: '#8b9ab0',
          }}
        >
          {ROLE_LABELS[user.role]}
        </span>
      </div>
    </div>
  );
};

export const PresenceBar: React.FC<PresenceBarProps> = ({
  users,
  currentUser,
  maxVisible = 4,
  onUserClick,
  onInviteClick,
  className = '',
}) => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Filtrer et trier les utilisateurs
  const sortedUsers = useMemo(() => {
    const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;
    return allUsers.sort((a, b) => {
      // Trier par statut : en ligne/en édition d'abord
      if (a.status === 'online' || a.status === 'editing') return -1;
      if (b.status === 'online' || b.status === 'editing') return 1;
      return 0;
    });
  }, [users, currentUser]);

  const visibleUsers = showAll ? sortedUsers : sortedUsers.slice(0, maxVisible);
  const hiddenCount = sortedUsers.length - maxVisible;

  const handleUserClick = useCallback((user: User) => {
    onUserClick?.(user);
  }, [onUserClick]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#0f1d32',
        borderRadius: '24px',
        border: '1px solid #1a2744',
      }}
    >
      {/* Indicateur de connexion */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingRight: '8px',
          borderRight: '1px solid #1a2744',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            animation: 'pulse 2s infinite',
          }}
        />
        <span
          style={{
            fontSize: '12px',
            color: '#8b9ab0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          En ligne
        </span>
      </div>

      {/* Avatars des utilisateurs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
        {visibleUsers.map((user, index) => (
          <div
            key={user.id}
            style={{
              marginLeft: index > 0 ? '-8px' : '0',
              zIndex: visibleUsers.length - index,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={() => setHoveredUser(user.id)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <UserAvatar
              user={user}
              size="medium"
              isCurrentUser={user.id === currentUser?.id}
              onClick={() => handleUserClick(user)}
            />
            
            {/* Infobulle */}
            {hoveredUser === user.id && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                }}
              >
                <UserTooltip user={user} isCurrentUser={user.id === currentUser?.id} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1a2744',
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Bouton "+X" pour voir plus */}
        {!showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              marginLeft: '-8px',
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#1a2744',
              border: '2px solid #0a1628',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a3a54';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
          >
            +{hiddenCount}
          </button>
        )}
      </div>

      {/* Bouton d'invitation */}
      <button
        onClick={onInviteClick}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: '2px dashed #e91e63',
          color: '#e91e63',
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          marginLeft: '4px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e91e6320';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Inviter des collaborateurs"
      >
        +
      </button>

      {/* Style pour l'animation pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default PresenceBar;
