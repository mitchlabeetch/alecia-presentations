/**
 * Démo du système de collaboration
 * Alecia Presentations - Exemple d'intégration
 */

import React, { useState, useCallback } from 'react';
import { PresenceBar } from './PresenceBar';
import { CursorsOverlay, CursorTrackingArea } from './UserCursor';
import { ActivityFeed } from './ActivityFeed';
import { ShareModal } from './ShareModal';
import { PermissionBadge, PermissionLegend } from './PermissionBadge';
import { useCollaboration } from '../../hooks/useCollaboration';
import type { User, Activity, UserRole } from '../../types/collaboration';

interface CollaborationDemoProps {
  presentationId: string;
  className?: string;
}

// Composant de démonstration complet
export const CollaborationDemo: React.FC<CollaborationDemoProps> = ({
  presentationId,
  className = '',
}) => {
  // Utiliser le hook de collaboration
  const {
    users,
    currentUser,
    cursors,
    activities,
    permissions,
    shareSettings,
    isConnected,
    isReconnecting,
    connectionError,
    updateCursorPosition,
    updateCurrentSlide,
    grantPermission,
    revokePermission,
    updateShareSettings,
    addActivity,
    canEdit,
    canShare,
  } = useCollaboration({
    presentationId,
    currentUserId: 'user-1',
    currentUserName: 'Jean Dupont',
    currentUserEmail: 'jean.dupont@alecia.fr',
    initialRole: 'owner',
  });

  // États locaux
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentSlideId, setCurrentSlideId] = useState('slide-1');
  const [showActivityPanel, setShowActivityPanel] = useState(true);

  // Gérer le clic sur un utilisateur
  const handleUserClick = useCallback((user: User) => {
    console.log('Utilisateur cliqué:', user.name);
  }, []);

  // Gérer le clic sur une activité
  const handleActivityClick = useCallback((activity: Activity) => {
    console.log('Activité cliquée:', activity);
  }, []);

  // Changer de diapositive
  const handleSlideChange = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
    updateCurrentSlide(slideId);
  }, [updateCurrentSlide]);

  // Simuler une modification
  const simulateEdit = useCallback(() => {
    addActivity('slide_updated', {
      slideId: currentSlideId,
      slideName: `Diapositive ${currentSlideId}`,
    });
  }, [addActivity, currentSlideId]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#0a1628',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Barre supérieure */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          backgroundColor: '#0f1d32',
          borderBottom: '1px solid #1a2744',
        }}
      >
        {/* Logo et titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: '#e91e63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '18px',
            }}
          >
            A
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              Présentation Financière Q4
            </h1>
            <p
              style={{
                margin: '2px 0 0 0',
                fontSize: '12px',
                color: '#8b9ab0',
              }}
            >
              Dernière modification : il y a 5 minutes
            </p>
          </div>
        </div>

        {/* Centre : Barre de présence */}
        <PresenceBar
          users={users}
          currentUser={currentUser}
          onUserClick={handleUserClick}
          onInviteClick={() => setIsShareModalOpen(true)}
        />

        {/* Droite : Badge de permission et actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Indicateur de connexion */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '16px',
              backgroundColor: isConnected ? '#4caf5020' : '#f4433620',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4caf50' : '#f44336',
                animation: isReconnecting ? 'pulse 1s infinite' : 'none',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: isConnected ? '#4caf50' : '#f44336',
              }}
            >
              {isConnected ? 'Connecté' : isReconnecting ? 'Reconnexion...' : 'Déconnecté'}
            </span>
          </div>

          {/* Badge de permission */}
          {currentUser && (
            <PermissionBadge role={currentUser.role} size="medium" />
          )}

          {/* Bouton de partage */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#e91e63',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f06292';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e91e63';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Partager
          </button>
        </div>
      </header>

      {/* Zone principale */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Barre latérale des diapositives */}
        <aside
          style={{
            width: 240,
            backgroundColor: '#0f1d32',
            borderRight: '1px solid #1a2744',
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '13px',
              fontWeight: 600,
              color: '#8b9ab0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Diapositives
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5'].map((slideId, index) => (
              <button
                key={slideId}
                onClick={() => handleSlideChange(slideId)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${currentSlideId === slideId ? '#e91e63' : 'transparent'}`,
                  backgroundColor: currentSlideId === slideId ? '#e91e6320' : '#0a1628',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    aspectRatio: '16/9',
                    backgroundColor: '#1a2744',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5a6a85',
                    fontSize: '12px',
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: currentSlideId === slideId ? '#ffffff' : '#8b9ab0',
                    fontWeight: currentSlideId === slideId ? 600 : 400,
                  }}
                >
                  Diapositive {index + 1}
                </div>
              </button>
            ))}
          </div>

          {/* Légende des permissions */}
          <div style={{ marginTop: '24px' }}>
            <PermissionLegend />
          </div>
        </aside>

        {/* Zone d'édition */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Barre d'outils */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#0f1d32',
              borderBottom: '1px solid #1a2744',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={simulateEdit}
              disabled={!canEdit()}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: canEdit() ? '#2196f3' : '#1a2744',
                color: canEdit() ? '#ffffff' : '#5a6a85',
                fontSize: '13px',
                fontWeight: 600,
                cursor: canEdit() ? 'pointer' : 'not-allowed',
              }}
            >
              Simuler une modification
            </button>
            <button
              onClick={() => setShowActivityPanel(!showActivityPanel)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #1a2744',
                backgroundColor: showActivityPanel ? '#e91e6320' : 'transparent',
                color: showActivityPanel ? '#e91e63' : '#8b9ab0',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Activité
            </button>
          </div>

          {/* Zone de la diapositive avec tracking du curseur */}
          <CursorTrackingArea
            slideId={currentSlideId}
            onCursorMove={updateCursorPosition}
            style={{ flex: 1, position: 'relative' }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 960,
                aspectRatio: '16/9',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#0a1628', margin: '0 0 16px 0' }}>
                  Diapositive {currentSlideId.replace('slide-', '')}
                </h2>
                <p style={{ color: '#5a6a85', margin: 0 }}>
                  Déplacez votre curseur pour voir le tracking en action
                </p>
              </div>
            </div>

            {/* Overlay des curseurs */}
            <CursorsOverlay
              cursors={cursors}
              currentSlideId={currentSlideId}
            />
          </CursorTrackingArea>
        </main>

        {/* Panneau d'activité */}
        {showActivityPanel && (
          <aside
            style={{
              width: 320,
              backgroundColor: '#0f1d32',
              borderLeft: '1px solid #1a2744',
              overflow: 'hidden',
            }}
          >
            <ActivityFeed
              activities={activities}
              currentUserId={currentUser?.id}
              onActivityClick={handleActivityClick}
            />
          </aside>
        )}
      </div>

      {/* Modal de partage */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        presentationId={presentationId}
        presentationTitle="Présentation Financière Q4"
        currentUserRole={currentUser?.role || 'viewer'}
        permissions={permissions}
        shareSettings={shareSettings}
        onGrantPermission={grantPermission}
        onRevokePermission={revokePermission}
        onUpdateShareSettings={updateShareSettings}
      />

      {/* Animation pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CollaborationDemo;
