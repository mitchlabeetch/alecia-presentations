/**
 * Badge de permission - Affiche le niveau de permission de l'utilisateur
 * Alecia Presentations - Composant de collaboration
 */

import React from 'react';
import type { UserRole } from '../../types/collaboration';
import { ROLE_LABELS } from '../../types/collaboration';

interface PermissionBadgeProps {
  role: UserRole;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

// Icône de propriétaire
const OwnerIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Icône d'éditeur
const EditorIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// Icône de lecteur
const ViewerIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Obtenir la configuration du badge selon le rôle
function getRoleConfig(role: UserRole): {
  backgroundColor: string;
  color: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
} {
  switch (role) {
    case 'owner':
      return {
        backgroundColor: '#e91e6320',
        color: '#e91e63',
        borderColor: '#e91e6340',
        icon: <OwnerIcon />,
        description: 'Contrôle total de la présentation',
      };
    case 'editor':
      return {
        backgroundColor: '#2196f320',
        color: '#2196f3',
        borderColor: '#2196f340',
        icon: <EditorIcon />,
        description: 'Peut modifier le contenu',
      };
    case 'viewer':
      return {
        backgroundColor: '#8b9ab020',
        color: '#8b9ab0',
        borderColor: '#8b9ab040',
        icon: <ViewerIcon />,
        description: 'Lecture seule',
      };
    default:
      return {
        backgroundColor: '#8b9ab020',
        color: '#8b9ab0',
        borderColor: '#8b9ab040',
        icon: <ViewerIcon />,
        description: 'Permission inconnue',
      };
  }
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  role,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  className = '',
}) => {
  const config = getRoleConfig(role);

  const sizeConfig = {
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      gap: '4px',
      borderRadius: '4px',
    },
    medium: {
      padding: '6px 12px',
      fontSize: '12px',
      gap: '6px',
      borderRadius: '6px',
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      gap: '8px',
      borderRadius: '8px',
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <span
      className={className}
      title={config.description}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        backgroundColor: config.backgroundColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        borderRadius: currentSize.borderRadius,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        fontFamily: 'Inter, system-ui, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
      }}
    >
      {showIcon && config.icon}
      {showLabel && ROLE_LABELS[role]}
    </span>
  );
};

// Variante avec indicateur de permission active
interface ActivePermissionBadgeProps extends PermissionBadgeProps {
  isActive?: boolean;
}

export const ActivePermissionBadge: React.FC<ActivePermissionBadgeProps> = ({
  role,
  isActive = true,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  className = '',
}) => {
  const config = getRoleConfig(role);

  const sizeConfig = {
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      gap: '4px',
      borderRadius: '4px',
    },
    medium: {
      padding: '6px 12px',
      fontSize: '12px',
      gap: '6px',
      borderRadius: '6px',
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      gap: '8px',
      borderRadius: '8px',
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <span
      className={className}
      title={config.description}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        backgroundColor: isActive ? config.backgroundColor : '#1a2744',
        color: isActive ? config.color : '#5a6a85',
        border: `1px solid ${isActive ? config.borderColor : '#1a2744'}`,
        borderRadius: currentSize.borderRadius,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        fontFamily: 'Inter, system-ui, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        opacity: isActive ? 1 : 0.6,
      }}
    >
      {showIcon && (
        <span style={{ opacity: isActive ? 1 : 0.5 }}>
          {config.icon}
        </span>
      )}
      {showLabel && ROLE_LABELS[role]}
    </span>
  );
};

// Indicateur de permission avec icône seule
interface PermissionIndicatorProps {
  role: UserRole;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const PermissionIndicator: React.FC<PermissionIndicatorProps> = ({
  role,
  size = 'medium',
  className = '',
}) => {
  const config = getRoleConfig(role);

  const sizeMap = {
    small: { width: 24, height: 24, iconSize: 12 },
    medium: { width: 32, height: 32, iconSize: 16 },
    large: { width: 40, height: 40, iconSize: 20 },
  };

  const currentSize = sizeMap[size];

  return (
    <span
      className={className}
      title={`${ROLE_LABELS[role]} - ${config.description}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: currentSize.width,
        height: currentSize.height,
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '50%',
        color: config.color,
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ transform: `scale(${currentSize.iconSize / 14})` }}>
        {config.icon}
      </span>
    </span>
  );
};

// Groupe de badges de permission
interface PermissionBadgeGroupProps {
  roles: UserRole[];
  size?: 'small' | 'medium' | 'large';
  maxVisible?: number;
  className?: string;
}

export const PermissionBadgeGroup: React.FC<PermissionBadgeGroupProps> = ({
  roles,
  size = 'small',
  maxVisible = 3,
  className = '',
}) => {
  const visibleRoles = roles.slice(0, maxVisible);
  const hiddenCount = roles.length - maxVisible;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
      }}
    >
      {visibleRoles.map((role, index) => (
        <PermissionBadge
          key={index}
          role={role}
          size={size}
          showIcon={false}
        />
      ))}
      {hiddenCount > 0 && (
        <span
          style={{
            padding: size === 'small' ? '4px 8px' : size === 'medium' ? '6px 10px' : '8px 12px',
            backgroundColor: '#1a2744',
            color: '#8b9ab0',
            borderRadius: size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px',
            fontSize: size === 'small' ? '11px' : size === 'medium' ? '12px' : '14px',
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

// Légende des permissions
interface PermissionLegendProps {
  className?: string;
}

export const PermissionLegend: React.FC<PermissionLegendProps> = ({ className = '' }) => {
  const roles: UserRole[] = ['owner', 'editor', 'viewer'];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#0f1d32',
        borderRadius: '8px',
        border: '1px solid #1a2744',
      }}
    >
      <h4
        style={{
          margin: '0 0 4px 0',
          fontSize: '13px',
          fontWeight: 600,
          color: '#8b9ab0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Permissions
      </h4>
      {roles.map((role) => {
        const config = getRoleConfig(role);
        return (
          <div
            key={role}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <PermissionIndicator role={role} size="small" />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: '#ffffff',
                  fontSize: '13px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {ROLE_LABELS[role]}
              </div>
              <div
                style={{
                  color: '#8b9ab0',
                  fontSize: '11px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {config.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionBadge;
