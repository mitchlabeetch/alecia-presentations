import { useState, useCallback, useRef, useEffect } from 'react';
import { AleciaLogo } from '@/components/ui/AleciaLogo';
import { Eye, EyeOff, Lock, User, Info, AlertCircle, Loader2 } from 'lucide-react';

interface PINScreenProps {
  onAuthenticate: (pin: string, userTag?: string) => Promise<boolean>;
  onForgotPin?: () => void;
}

export function PINScreen({ onAuthenticate, onForgotPin }: PINScreenProps) {
  const [pin, setPin] = useState('');
  const [userTag, setUserTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const pinInputRef = useRef<HTMLInputElement>(null);
  const lockoutDuration = 30000; // 30 seconds lockout after 3 failed attempts

  // Focus input on mount
  useEffect(() => {
    pinInputRef.current?.focus();
  }, []);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Check lockout
      if (lockoutUntil && lockoutUntil > Date.now()) {
        return;
      }

      // Validate PIN length
      if (pin.length < 4) {
        setError('Le code PIN doit contenir au moins 4 chiffres');
        triggerShake();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const success = await onAuthenticate(pin, userTag || undefined);

        if (!success) {
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
          triggerShake();
          setPin('');
        }
      } catch (err) {
        setError('Erreur de connexion. Veuillez réessayer.');
        triggerShake();
      } finally {
        setIsLoading(false);
      }
    },
    [pin, userTag, attempts, lockoutUntil, onAuthenticate]
  );

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPin(value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const isLocked = lockoutUntil !== null && lockoutUntil > Date.now();
  const remainingAttempts = Math.max(0, 3 - attempts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-alecia-navy via-[#0a2a68] to-alecia-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="diagonal-chevrons"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L60 30 L30 60 L0 30 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-chevrons)" />
        </svg>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-alecia-red/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-alecia-silver/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <AleciaLogo className="h-16 w-auto text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Alecia Presentations
          </h1>
          <p className="mt-2 text-alecia-silver/80 text-sm">
            Créateur de pitch decks M&A
          </p>
        </div>

        {/* PIN Form Card */}
        <div
          className={`bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl transition-transform ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="flex items-center gap-2 text-sm font-medium text-alecia-navy"
              >
                <Lock className="w-4 h-4" />
                Code PIN
              </label>
              <div className="relative">
                <input
                  ref={pinInputRef}
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={pin}
                  onChange={handlePinChange}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isLocked}
                  className={`alecia-input text-center text-3xl tracking-[0.5em] pr-12 transition-all ${
                    error ? 'border-alecia-red ring-2 ring-alecia-red/20' : ''
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="••••••••"
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* PIN strength indicator */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                      i <= pin.length
                        ? pin.length < 4
                          ? 'bg-alecia-red'
                          : pin.length < 6
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-alecia-silver/30'
                    }`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-alecia-red text-sm mt-2 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Lockout Timer */}
              {isLocked && (
                <div className="text-alecia-red text-sm font-medium mt-2 animate-pulse">
                  Accès temporairement verrouillé
                </div>
              )}
            </div>

            {/* User Tag Input */}
            <div className="space-y-2">
              <label
                htmlFor="userTag"
                className="flex items-center gap-2 text-sm font-medium text-alecia-navy"
              >
                <User className="w-4 h-4" />
                Votre nom <span className="text-alecia-silver font-normal">(optionnel)</span>
              </label>
              <input
                id="userTag"
                type="text"
                value={userTag}
                onChange={(e) => setUserTag(e.target.value)}
                disabled={isLoading || isLocked}
                className="alecia-input"
                placeholder="Prénom Nom"
              />
              <p className="text-xs text-alecia-silver">
                Pour identifier vos contributions dans les projets
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLocked || pin.length < 4}
              className="w-full alecia-btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </span>
              ) : isLocked ? (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Veuillez patienter...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  Accéder à la galerie
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}

              {/* Loading shimmer effect */}
              {isLoading && (
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              )}
            </button>

            {/* Remaining attempts indicator */}
            {remainingAttempts > 0 && remainingAttempts < 3 && !isLocked && (
              <div className="text-center text-xs text-alecia-silver">
                {remainingAttempts} tentative(s) restante(s)
              </div>
            )}
          </form>

          {/* Forgot PIN */}
          {onForgotPin && (
            <div className="mt-6 pt-6 border-t border-alecia-silver/20">
              <button
                type="button"
                onClick={onForgotPin}
                className="w-full flex items-center justify-center gap-2 text-sm text-alecia-silver hover:text-alecia-navy transition-colors"
              >
                <Info className="w-4 h-4" />
                Mot de passe oublié ?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-alecia-silver/60 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Outil interne - Accès réservé aux collaborateurs
          </p>
          <p className="mt-2 text-xs text-alecia-silver/40">
            alecia © 2024 - Tous droits réservés
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
