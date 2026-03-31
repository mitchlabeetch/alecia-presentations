/**
 * Page d'authentification
 * Design épuré avec branding Alecia
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    clearError();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-alecia-navy flex items-center justify-center relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-[60vw] md:text-[50vw] font-black text-alecia-navy-light/[0.08] leading-none"
        >
          &
        </motion.span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-alecia-navy/50 to-alecia-navy pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-alecia-pink to-alecia-pink-dark mb-6 shadow-2xl shadow-alecia-pink/30">
            <span className="text-4xl font-black text-white">a</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">alecia</h1>
          <p className="text-alecia-gray-400 text-sm font-medium tracking-wide uppercase">Présentations</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="bg-alecia-navy-light/80 backdrop-blur-xl rounded-3xl border border-alecia-navy-lighter/50 p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-1">Bienvenue</h2>
            <p className="text-alecia-gray-500 text-sm">Connectez-vous pour continuer</p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-alecia-gray-400 mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-500 group-focus-within:text-alecia-pink transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@alecia.fr"
                  className="w-full pl-12 pr-4 py-3.5 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white placeholder:text-alecia-gray-600 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-alecia-gray-400 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-500 group-focus-within:text-alecia-pink transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white placeholder:text-alecia-gray-600 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-alecia-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-alecia-pink to-alecia-pink-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-alecia-pink/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-alecia-navy-lighter/30">
            <p className="text-xs text-alecia-gray-500 text-center mb-4">
              Comptes de démonstration
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('jean.dupont@alecia.fr', 'password123')}
                className="w-full p-3 bg-alecia-navy rounded-xl text-xs text-alecia-gray-400 hover:text-white hover:bg-alecia-navy-lighter transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-alecia-pink/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-alecia-pink" />
                </div>
                <div>
                  <span className="text-alecia-pink font-medium">Admin</span>
                  <span className="block text-alecia-gray-500">jean.dupont@alecia.fr</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('marie.martin@alecia.fr', 'password123')}
                className="w-full p-3 bg-alecia-navy rounded-xl text-xs text-alecia-gray-400 hover:text-white hover:bg-alecia-navy-lighter transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Editor</span>
                  <span className="block text-alecia-gray-500">marie.martin@alecia.fr</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-alecia-gray-600 text-xs mt-8"
        >
          © 2026 Alecia. Tous droits réservés.
        </motion.p>
      </div>
    </div>
  );
};

export default AuthPage;
