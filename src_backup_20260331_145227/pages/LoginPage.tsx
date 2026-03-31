/**
 * Page de connexion
 * Interface d'authentification des utilisateurs
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import useStore from '@store/index';

/**
 * Page de connexion
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-alecia-navy flex">
      {/* Partie gauche - Visuel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Fond avec gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-alecia-navy via-alecia-navy-light to-alecia-navy" />
        
        {/* Filigrane */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[30rem] font-bold text-alecia-navy-light/10 select-none">
            &
          </span>
        </div>
        
        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-alecia-pink rounded-2xl flex items-center justify-center shadow-alecia-pink">
                <span className="text-white font-bold text-3xl">&</span>
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">alecia</h1>
                <p className="text-alecia-gray-400">Présentations</p>
              </div>
            </div>
            
            {/* Tagline */}
            <h2 className="text-white text-4xl font-bold leading-tight mb-6">
              Créez des présentations<br />
              <span className="text-alecia-pink">professionnelles</span> en quelques clics
            </h2>
            
            <p className="text-alecia-gray-300 text-lg max-w-md">
              L'outil de création de présentations conçu pour les équipes d'Alecia. 
              Collaborez en temps réel et exportez au format PowerPoint.
            </p>
            
            {/* Fonctionnalités */}
            <div className="mt-12 space-y-4">
              {[
                'Collaboration en temps réel',
                'Templates professionnels',
                'Export PowerPoint & PDF',
                'Assistant IA intégré',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-alecia-pink/20 rounded-full flex items-center justify-center">
                    <span className="text-alecia-pink text-xs">✓</span>
                  </div>
                  <span className="text-alecia-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-alecia-pink rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">&</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">alecia</h1>
              <p className="text-alecia-gray-400 text-sm">Présentations</p>
            </div>
          </div>

          {/* Titre du formulaire */}
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">
              Connexion
            </h2>
            <p className="text-alecia-gray-400">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-alecia-gray-300 text-sm font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@alecia.fr"
                  className="w-full pl-12 pr-4 py-3 bg-alecia-navy-light border border-alecia-navy-lighter/50 rounded-lg text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-alecia-gray-300 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-alecia-navy-light border border-alecia-navy-lighter/50 rounded-lg text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-alecia-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-alecia-navy-lighter/50 bg-alecia-navy-light text-alecia-pink focus:ring-alecia-pink/20"
                />
                <span className="text-alecia-gray-300 text-sm">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                onClick={() => {/* Ouvrir modal de réinitialisation */}}
                className="text-alecia-pink hover:text-alecia-pink-light text-sm transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-alecia-navy-lighter/50" />
            <span className="text-alecia-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-alecia-navy-lighter/50" />
          </div>

          {/* Connexion SSO */}
          <button
            onClick={() => {/* Connexion SSO Microsoft */}}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-alecia-navy-light border border-alecia-navy-lighter/50 rounded-lg text-white hover:bg-alecia-navy-lighter transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21">
              <path fill="#f25022" d="M1 1h9v9H1z" />
              <path fill="#00a4ef" d="M1 11h9v9H1z" />
              <path fill="#7fba00" d="M11 1h9v9h-9z" />
              <path fill="#ffb900" d="M11 11h9v9h-9z" />
            </svg>
            Continuer avec Microsoft
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-alecia-gray-500 text-sm">
            En vous connectant, vous acceptez les{' '}
            <button className="text-alecia-pink hover:underline">
              conditions d'utilisation
            </button>{' '}
            et la{' '}
            <button className="text-alecia-pink hover:underline">
              politique de confidentialité
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
