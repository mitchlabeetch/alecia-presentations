import { useState, useCallback, useRef, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface ProjectPINDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectName: string;
  projectId: string;
}

export function ProjectPINDialog({
  isOpen,
  onClose,
  onSuccess,
  projectName,
  projectId,
}: ProjectPINDialogProps) {
  const [pin, setPin] = useState('');
  const [rememberPin, setRememberPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const pinInputRef = useRef<HTMLInputElement>(null);
  const lockoutDuration = 30000;

  // Check for remembered PIN
  useEffect(() => {
    const rememberedPin = localStorage.getItem(`alecia-project-pin-${projectId}`);
    if (rememberedPin && isOpen) {
      verifyPin(rememberedPin);
    }
  }, [isOpen, projectId]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => pinInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle lockout
  useEffect(() => {
    if (lockoutUntil && lockoutUntil > Date.now()) {
      const timer = setTimeout(() => {
        setLockoutUntil(null);
        setAttempts(0);
      }, lockoutUntil - Date.now());
      return () => clearTimeout(timer);
    }
  }, [lockoutUntil]);

  const verifyPin = async (pinToVerify: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.verifyProjectPin(projectId, pinToVerify);

      if (response.data?.success) {
        if (rememberPin) {
          localStorage.setItem(`alecia-project-pin-${projectId}`, pinToVerify);
        }
        onSuccess();
        handleClose();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setLockoutUntil(Date.now() + lockoutDuration);
          setError('Trop de tentatives. Réessayez dans 30 secondes.');
        } else {
          setError(
            `Code PIN invalide. ${3 - newAttempts} tentative(s) restante(s).`
          );
        }
        setPin('');
      }
    } catch {
      setError('Erreur de vérification. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (lockoutUntil && lockoutUntil > Date.now()) {
        return;
      }

      if (pin.length < 4) {
        setError('Le code PIN doit contenir au moins 4 chiffres');
        return;
      }

      await verifyPin(pin);
    },
    [pin, lockoutUntil]
  );

  const handleClose = () => {
    setPin('');
    setError(null);
    setShowPin(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isLocked = lockoutUntil !== null && lockoutUntil > Date.now();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-alecia-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-alecia-silver/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-alecia-navy/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-alecia-navy" />
            </div>
            <div>
              <h2 className="font-semibold text-alecia-navy">
                Projet protégé
              </h2>
              <p className="text-sm text-alecia-silver truncate max-w-[200px]">
                {projectName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-alecia-red/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-alecia-red" />
            </div>
            <p className="text-sm text-alecia-silver">
              Ce projet est protégé par un code PIN.
              <br />
              Entrez le code pour y accéder.
            </p>
          </div>

          {/* PIN Input */}
          <div className="space-y-2">
            <div className="relative">
              <input
                ref={pinInputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 8));
                  setError(null);
                }}
                disabled={isLoading || isLocked}
                className={`alecia-input text-center text-2xl tracking-[0.3em] pr-10 ${
                  error ? 'border-alecia-red ring-2 ring-alecia-red/20' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
                placeholder="••••"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-alecia-silver hover:text-alecia-navy transition-colors p-1"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPin ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-2 text-alecia-red text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Remember PIN */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberPin}
                onChange={(e) => setRememberPin(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-alecia-silver rounded peer-checked:bg-alecia-navy peer-checked:border-alecia-navy transition-colors group-hover:border-alecia-navy/50" />
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-alecia-silver">
              Se souvenir du code pour ce projet
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 alecia-btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || isLocked || pin.length < 4}
              className="flex-1 alecia-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Vérification...
                </span>
              ) : isLocked ? (
                'Vérouillé'
              ) : (
                'Valider'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-alecia-silver/60">
            Demandez le code PIN à l'administrateur du projet
          </p>
        </div>
      </div>
    </div>
  );
}
