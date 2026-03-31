/**
 * Flux d'activité - Affiche les actions récentes des collaborateurs
 * Alecia Presentations - Composant de collaboration
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Activity, ActivityType } from '../../types/collaboration';
import { ACTIVITY_LABELS } from '../../types/collaboration';

interface ActivityFeedProps {
  activities: Activity[];
  currentUserId?: string;
  maxItems?: number;
  showFilter?: boolean;
  className?: string;
  onActivityClick?: (activity: Activity) => void;
  onClear?: () => void;
}

type FilterType = 'all' | 'slides' | 'users' | 'variables';

// Icônes pour les types d'activité
const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const iconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const icons: Record<ActivityType, React.ReactNode> = {
    slide_created: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    slide_updated: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 7v10M7 12h10" strokeDasharray="2 2" />
      </svg>
    ),
    slide_deleted: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="16" />
        <line x1="16" y1="8" x2="8" y2="16" />
      </svg>
    ),
    slide_moved: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 12h10M13 8l4 4-4 4" />
      </svg>
    ),
    variable_changed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <path d="M4 7V4h3M4 17v3h3M20 7V4h-3M20 17v3h-3M9 9h6v6H9z" />
      </svg>
    ),
    user_joined: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.582-8 8-8s8 4 8 8" />
        <circle cx="18" cy="6" r="3" fill="#4caf50" stroke="none" />
      </svg>
    ),
    user_left: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.582-8 8-8s8 4 8 8" />
        <circle cx="18" cy="6" r="3" fill="#f44336" stroke="none" />
      </svg>
    ),
    permission_changed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    presentation_shared: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  };

  const iconColors: Record<ActivityType, string> = {
    slide_created: '#4caf50',
    slide_updated: '#2196f3',
    slide_deleted: '#f44336',
    slide_moved: '#ff9800',
    variable_changed: '#9c27b0',
    user_joined: '#4caf50',
    user_left: '#f44336',
    permission_changed: '#e91e63',
    presentation_shared: '#00bcd4',
  };

  return (
    <span style={{ color: iconColors[type], flexShrink: 0 }}>
      {icons[type]}
    </span>
  );
};

// Formater le temps relatif
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return 'À l\'instant';
  if (seconds < 60) return `Il y a ${seconds}s`;
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return 'Hier';
  return `Il y a ${days}j`;
}

// Obtenir la description de l'activité
function getActivityDescription(activity: Activity): string {
  const { type, details } = activity;

  switch (type) {
    case 'slide_created':
      return `a créé ${details.slideName || 'une diapositive'}`;
    case 'slide_updated':
      return `a modifié ${details.slideName || 'une diapositive'}`;
    case 'slide_deleted':
      return `a supprimé ${details.slideName || 'une diapositive'}`;
    case 'slide_moved':
      return `a déplacé ${details.slideName || 'une diapositive'}`;
    case 'variable_changed':
      return `a modifié la variable "${details.variableName}"`;
    case 'user_joined':
      return 'a rejoint la présentation';
    case 'user_left':
      return 'a quitté la présentation';
    case 'permission_changed':
      return `a modifié les permissions de ${details.targetUserName || 'un utilisateur'}`;
    case 'presentation_shared':
      return 'a partagé la présentation';
    default:
      return ACTIVITY_LABELS[type];
  }
}

// Obtenir les initiales du nom
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Élément d'activité individuel
const ActivityItem: React.FC<{
  activity: Activity;
  isCurrentUser?: boolean;
  onClick?: () => void;
}> = ({ activity, isCurrentUser = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: isHovered ? '#1a2744' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: activity.userAvatar ? 'transparent' : '#e91e63',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '12px',
          fontWeight: 600,
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {activity.userAvatar ? (
          <img
            src={activity.userAvatar}
            alt={activity.userName}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          getInitials(activity.userName)
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: isCurrentUser ? '#e91e63' : '#ffffff',
              fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {activity.userName}
          </span>
          <ActivityIcon type={activity.type} />
          <span
            style={{
              color: '#b0c4de',
              fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {getActivityDescription(activity)}
          </span>
        </div>

        {/* Détails supplémentaires */}
        {activity.details.message && (
          <div
            style={{
              marginTop: '4px',
              padding: '6px 10px',
              backgroundColor: '#0f1d32',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#8b9ab0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {activity.details.message}
          </div>
        )}

        {activity.details.variableName && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              color: '#8b9ab0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {activity.details.oldValue !== undefined && (
              <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                {String(activity.details.oldValue)}
              </span>
            )}
            {activity.details.newValue !== undefined && (
              <span style={{ color: '#4caf50' }}>
                {String(activity.details.newValue)}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          style={{
            marginTop: '4px',
            fontSize: '11px',
            color: '#5a6a85',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {formatRelativeTime(activity.timestamp)}
        </div>
      </div>
    </div>
  );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  currentUserId,
  maxItems = 20,
  showFilter = true,
  className = '',
  onActivityClick,
  onClear,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrer les activités
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    switch (filter) {
      case 'slides':
        filtered = activities.filter(a => 
          ['slide_created', 'slide_updated', 'slide_deleted', 'slide_moved'].includes(a.type)
        );
        break;
      case 'users':
        filtered = activities.filter(a => 
          ['user_joined', 'user_left', 'permission_changed'].includes(a.type)
        );
        break;
      case 'variables':
        filtered = activities.filter(a => a.type === 'variable_changed');
        break;
    }

    return filtered.slice(0, isExpanded ? undefined : maxItems);
  }, [activities, filter, maxItems, isExpanded]);

  // Grouper les activités par date
  const groupedActivities = useMemo(() => {
    const groups: { label: string; activities: Activity[] }[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredActivities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      let label: string;

      if (activityDate.toDateString() === today.toDateString()) {
        label = 'Aujourd\'hui';
      } else if (activityDate.toDateString() === yesterday.toDateString()) {
        label = 'Hier';
      } else {
        label = activityDate.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long' 
        });
      }

      const existingGroup = groups.find(g => g.label === label);
      if (existingGroup) {
        existingGroup.activities.push(activity);
      } else {
        groups.push({ label, activities: [activity] });
      }
    });

    return groups;
  }, [filteredActivities]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#0a1628',
        border: '1px solid #1a2744',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '500px',
      }}
    >
      {/* En-tête */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #1a2744',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Activité récente
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#8b9ab0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {activities.length} action{activities.length > 1 ? 's' : ''}
          </p>
        </div>

        {onClear && activities.length > 0 && (
          <button
            onClick={onClear}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#8b9ab0',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e91e63';
              e.currentTarget.style.backgroundColor = '#e91e6320';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8b9ab0';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Effacer
          </button>
        )}
      </div>

      {/* Filtres */}
      {showFilter && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '1px solid #1a2744',
            overflowX: 'auto',
          }}
        >
          {(['all', 'slides', 'users', 'variables'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: filter === f ? '#e91e63' : '#1a2744',
                color: filter === f ? '#ffffff' : '#8b9ab0',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {f === 'all' && 'Tout'}
              {f === 'slides' && 'Diapositives'}
              {f === 'users' && 'Utilisateurs'}
              {f === 'variables' && 'Variables'}
            </button>
          ))}
        </div>
      )}

      {/* Liste des activités */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
        }}
      >
        {groupedActivities.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              color: '#5a6a85',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ marginBottom: '12px', opacity: 0.5 }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                textAlign: 'center',
              }}
            >
              Aucune activité pour le moment
            </p>
          </div>
        ) : (
          groupedActivities.map((group, groupIndex) => (
            <div key={group.label}>
              {/* Séparateur de date */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 8px 8px',
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1a2744' }} />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#5a6a85',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {group.label}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1a2744' }} />
              </div>

              {/* Activités du groupe */}
              {group.activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isCurrentUser={activity.userId === currentUserId}
                  onClick={() => onActivityClick?.(activity)}
                />
              ))}
            </div>
          ))
        )}

        {/* Bouton "Voir plus" */}
        {!isExpanded && activities.length > maxItems && (
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#e91e63',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e91e6320';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Voir plus ({activities.length - maxItems})
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
