/**
 * Modal de partage - Dialogue pour partager la présentation
 * Alecia Presentations - Composant de collaboration
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { UserRole, Permission, ShareSettings } from '../../types/collaboration';
import { ROLE_LABELS } from '../../types/collaboration';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentationId: string;
  presentationTitle: string;
  currentUserRole: UserRole;
  permissions: Permission[];
  shareSettings: ShareSettings;
  onGrantPermission: (email: string, role: UserRole) => void;
  onRevokePermission: (userId: string) => void;
  onUpdateShareSettings: (settings: Partial<ShareSettings>) => void;
  className?: string;
}

// Icône de copie
const CopyIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

// Icône de check
const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Icône de fermeture
const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Icône de lien
const LinkIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

// Icône de globe
const GlobeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

// Icône de verrou
const LockIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// Icône de poubelle
const TrashIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

// Obtenir les initiales
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Champ d'invitation
const InviteField: React.FC<{
  onInvite: (email: string, role: UserRole) => void;
  disabled?: boolean;
}> = ({ onInvite, disabled = false }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !disabled) {
      onInvite(email.trim(), role);
      setEmail('');
    }
  }, [email, role, onInvite, disabled]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Adresse email"
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${isFocused ? '#e91e63' : '#1a2744'}`,
            backgroundColor: '#0f1d32',
            color: '#ffffff',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        />
      </div>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        disabled={disabled}
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #1a2744',
          backgroundColor: '#0f1d32',
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'Inter, system-ui, sans-serif',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="viewer">Lecture seule</option>
        <option value="editor">Édition</option>
      </select>
      <button
        type="submit"
        disabled={!email.trim() || disabled}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: email.trim() && !disabled ? '#e91e63' : '#1a2744',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          cursor: email.trim() && !disabled ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
        }}
      >
        Inviter
      </button>
    </form>
  );
};

// Élément de permission
const PermissionItem: React.FC<{
  permission: Permission;
  canEdit: boolean;
  onRevoke: () => void;
  onRoleChange?: (role: UserRole) => void;
}> = ({ permission, canEdit, onRevoke, onRoleChange }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#0f1d32',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#e91e63',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          flexShrink: 0,
        }}
      >
        {getInitials(permission.userName)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: '#ffffff',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {permission.userName}
        </div>
        <div
          style={{
            color: '#8b9ab0',
            fontSize: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {permission.userEmail}
        </div>
      </div>

      {/* Rôle */}
      <div style={{ position: 'relative' }}>
        {canEdit ? (
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #1a2744',
              backgroundColor: '#0a1628',
              color: '#8b9ab0',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {ROLE_LABELS[permission.role]}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ) : (
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#1a2744',
              color: '#8b9ab0',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {ROLE_LABELS[permission.role]}
          </span>
        )}

        {/* Menu de rôle */}
        {showRoleMenu && canEdit && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
              }}
              onClick={() => setShowRoleMenu(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: '#1a2744',
                borderRadius: '8px',
                padding: '4px',
                minWidth: '140px',
                zIndex: 9999,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {(['viewer', 'editor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange?.(r);
                    setShowRoleMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: permission.role === r ? '#e91e6330' : 'transparent',
                    color: permission.role === r ? '#e91e63' : '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bouton de révocation */}
      {canEdit && (
        <button
          onClick={onRevoke}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#8b9ab0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f44336';
            e.currentTarget.style.backgroundColor = '#f4433620';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8b9ab0';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Révoquer l'accès"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

// Interrupteur personnalisé
const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: 44,
        height: 24,
        borderRadius: '12px',
        border: 'none',
        backgroundColor: checked ? '#e91e63' : '#1a2744',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease',
        }}
      />
    </button>
  );
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  presentationId,
  presentationTitle,
  currentUserRole,
  permissions,
  shareSettings,
  onGrantPermission,
  onRevokePermission,
  onUpdateShareSettings,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'people' | 'link'>('people');
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'editor';
  const canManagePermissions = currentUserRole === 'owner';

  // Générer le lien de partage
  const shareUrl = `${window.location.origin}/presentation/${presentationId}`;

  // Copier le lien
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }, [shareUrl]);

  // Gérer l'invitation
  const handleInvite = useCallback((email: string, role: UserRole) => {
    onGrantPermission(email, role);
  }, [onGrantPermission]);

  if (!isOpen) return null;

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0a1628',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1a2744',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Partager la présentation
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: '#8b9ab0',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {presentationTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#8b9ab0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b9ab0';
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Onglets */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #1a2744',
          }}
        >
          <button
            onClick={() => setActiveTab('people')}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'people' ? '#e91e63' : '#8b9ab0',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === 'people' ? '#e91e63' : 'transparent'}`,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Personnes
          </button>
          <button
            onClick={() => setActiveTab('link')}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'link' ? '#e91e63' : '#8b9ab0',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === 'link' ? '#e91e63' : 'transparent'}`,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LinkIcon />
            Lien
          </button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'people' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Champ d'invitation */}
              {canManagePermissions && (
                <InviteField onInvite={handleInvite} disabled={!canManagePermissions} />
              )}

              {/* Liste des permissions */}
              <div>
                <h4
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#8b9ab0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Personnes ayant accès ({permissions.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {permissions.length === 0 ? (
                    <p
                      style={{
                        margin: 0,
                        padding: '20px',
                        textAlign: 'center',
                        color: '#5a6a85',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                    >
                      Aucune personne invitée pour le moment
                    </p>
                  ) : (
                    permissions.map((permission) => (
                      <PermissionItem
                        key={permission.userId}
                        permission={permission}
                        canEdit={canManagePermissions}
                        onRevoke={() => onRevokePermission(permission.userId)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Lien de partage */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#8b9ab0',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Lien de partage
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#0f1d32',
                      border: '1px solid #1a2744',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: copied ? '#4caf50' : '#e91e63',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>

              {/* Paramètres de partage */}
              {canManagePermissions && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4
                    style={{
                      margin: '0',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#8b9ab0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    Paramètres
                  </h4>

                  {/* Accès public */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#0f1d32',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <GlobeIcon />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        >
                          Accès public
                        </div>
                        <div
                          style={{
                            color: '#8b9ab0',
                            fontSize: '12px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        >
                          Toute personne avec le lien peut accéder
                        </div>
                      </div>
                    </div>
                    <Toggle
                      checked={shareSettings.isPublic}
                      onChange={(checked) => onUpdateShareSettings({ isPublic: checked })}
                    />
                  </div>

                  {/* Permissions publiques */}
                  {shareSettings.isPublic && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f1d32',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <LockIcon />
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#ffffff',
                              fontSize: '14px',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            Permission par défaut
                          </div>
                          <div
                            style={{
                              color: '#8b9ab0',
                              fontSize: '12px',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            Niveau d'accès pour les visiteurs
                          </div>
                        </div>
                      </div>
                      <select
                        value={shareSettings.publicAccess}
                        onChange={(e) => onUpdateShareSettings({ publicAccess: e.target.value as 'view' | 'edit' | 'none' })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #1a2744',
                          backgroundColor: '#0a1628',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="view">Lecture seule</option>
                        <option value="edit">Édition</option>
                        <option value="none">Aucun accès</option>
                      </select>
                    </div>
                  )}

                  {/* Autoriser les commentaires */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#0f1d32',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: '#ffffff',
                          fontSize: '14px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Autoriser les commentaires
                      </div>
                      <div
                        style={{
                          color: '#8b9ab0',
                          fontSize: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Les visiteurs peuvent laisser des commentaires
                      </div>
                    </div>
                    <Toggle
                      checked={shareSettings.allowComments}
                      onChange={(checked) => onUpdateShareSettings({ allowComments: checked })}
                    />
                  </div>

                  {/* Autoriser le téléchargement */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#0f1d32',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: '#ffffff',
                          fontSize: '14px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Autoriser le téléchargement
                      </div>
                      <div
                        style={{
                          color: '#8b9ab0',
                          fontSize: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Les visiteurs peuvent télécharger la présentation
                      </div>
                    </div>
                    <Toggle
                      checked={shareSettings.allowDownload}
                      onChange={(checked) => onUpdateShareSettings({ allowDownload: checked })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #1a2744',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1a2744',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a3a54';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
