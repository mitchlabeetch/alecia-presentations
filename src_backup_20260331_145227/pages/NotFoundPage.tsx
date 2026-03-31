/**
 * Page 404 - Page non trouvée
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

/**
 * Page 404
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-alecia-navy flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-alecia-navy-light rounded-3xl flex items-center justify-center mx-auto border border-alecia-navy-lighter/30">
            <span className="text-7xl font-bold text-alecia-pink">404</span>
          </div>
        </motion.div>

        {/* Titre */}
        <h1 className="text-white text-3xl font-bold mb-4">
          Page non trouvée
        </h1>

        {/* Message */}
        <p className="text-alecia-gray-400 text-lg mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Suggestions */}
        <div className="bg-alecia-navy-light rounded-xl p-6 mb-8 border border-alecia-navy-lighter/30">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-alecia-pink" />
            Vous cherchiez peut-être :
          </h2>
          <ul className="space-y-2 text-left">
            {[
              { label: 'Tableau de bord', path: '/dashboard' },
              { label: 'Mes présentations', path: '/presentations' },
              { label: 'Bibliothèque de templates', path: '/templates' },
            ].map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="text-alecia-pink hover:text-alecia-pink-light hover:underline transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-alecia-navy-light text-white rounded-lg hover:bg-alecia-navy-lighter transition-colors border border-alecia-navy-lighter/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-alecia-pink text-white rounded-lg hover:bg-alecia-pink-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-alecia-gray-500 text-sm">
          Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le{' '}
          <button className="text-alecia-pink hover:underline">
            support technique
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
