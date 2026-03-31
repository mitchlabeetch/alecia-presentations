import React from 'react';

export type ExportStatus = 'idle' | 'preparing' | 'generating' | 'finalizing' | 'complete' | 'error';

interface ExportProgressProps {
  status: ExportStatus;
  progress: number;
  message: string;
  error?: string;
  showDetails?: boolean;
  className?: string;
}

const getStatusIcon = (status: ExportStatus): string => {
  switch (status) {
    case 'preparing':
      return '📦';
    case 'generating':
      return '⚙️';
    case 'finalizing':
      return '🔧';
    case 'complete':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '⏳';
  }
};

const getStatusColor = (status: ExportStatus): string => {
  switch (status) {
    case 'complete':
      return '#22c55e';
    case 'error':
      return '#ef4444';
    case 'preparing':
    case 'generating':
    case 'finalizing':
      return '#e91e63';
    default:
      return '#94a3b8';
  }
};

const ExportProgress: React.FC<ExportProgressProps> = ({
  status,
  progress,
  message,
  error,
  showDetails = true,
  className = '',
}) => {
  const isComplete = status === 'complete';
  const isError = status === 'error';
  const isActive = status === 'preparing' || status === 'generating' || status === 'finalizing';

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={`export-progress ${className}`}
      style={{
        ...styles.container,
        ...(isError ? styles.containerError : {}),
      }}
    >
      {/* Status Icon */}
      <div
        style={{
          ...styles.iconContainer,
          backgroundColor: isComplete
            ? '#dcfce7'
            : isError
            ? '#fee2e2'
            : '#fdf2f8',
        }}
      >
        <span
          style={{
            ...styles.icon,
            animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {getStatusIcon(status)}
        </span>
      </div>

      {/* Status Message */}
      <p
        style={{
          ...styles.message,
          color: isError ? '#dc2626' : '#0a1628',
        }}
      >
        {isError && error ? error : message || 'Export en cours...'}
      </p>

      {/* Progress Bar */}
      {!isError && (
        <div style={styles.progressContainer}>
          <div style={styles.progressBarWrapper}>
            <div
              style={{
                ...styles.progressBar,
                width: `${clampedProgress}%`,
                backgroundColor: getStatusColor(status),
                transition: isActive ? 'width 0.3s ease' : 'none',
              }}
            />
            {isActive && (
              <div
                style={{
                  ...styles.progressShine,
                  animation: 'shine 1.5s ease-in-out infinite',
                }}
              />
            )}
          </div>
          <span style={styles.progressPercent}>{Math.round(clampedProgress)}%</span>
        </div>
      )}

      {/* Details */}
      {showDetails && !isError && (
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Statut:</span>
            <span
              style={{
                ...styles.detailValue,
                color: getStatusColor(status),
              }}
            >
              {status === 'idle' && 'En attente'}
              {status === 'preparing' && 'Préparation'}
              {status === 'generating' && 'Génération'}
              {status === 'finalizing' && 'Finalisation'}
              {status === 'complete' && 'Terminé'}
            </span>
          </div>
          {isComplete && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Fichier:</span>
              <span style={styles.detailValue}>Prêt au téléchargement</span>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>🎉</span>
          <span>Export terminé avec succès !</span>
        </div>
      )}

      {/* Error Actions */}
      {isError && (
        <div style={styles.errorActions}>
          <button
            type="button"
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    textAlign: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  containerError: {
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '32px',
  },
  message: {
    fontSize: '16px',
    fontWeight: 500,
    margin: '0 0 20px 0',
  },
  progressContainer: {
    width: '100%',
    maxWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressBarWrapper: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
  },
  progressPercent: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#64748b',
    minWidth: '40px',
    textAlign: 'right',
  },
  details: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '300px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  detailValue: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#0a1628',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  successIcon: {
    fontSize: '18px',
  },
  errorActions: {
    marginTop: '20px',
  },
  retryButton: {
    padding: '10px 24px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default ExportProgress;
