/**
 * Écran de chargement avec animation
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Chargement...',
  subMessage,
}) => {
  return (
    <div className="fixed inset-0 bg-alecia-navy flex flex-col items-center justify-center z-50">
      {/* Logo animé */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-alecia-pink rounded-2xl flex items-center justify-center shadow-alecia-pink">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white font-bold text-4xl"
          >
            &
          </motion.span>
        </div>
      </motion.div>

      {/* Texte de chargement */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white text-xl font-semibold mb-2"
      >
        {message}
      </motion.h2>

      {subMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-alecia-gray-400 text-sm"
        >
          {subMessage}
        </motion.p>
      )}

      {/* Indicateur de progression */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="h-1 bg-alecia-pink rounded-full mt-6"
        style={{ maxWidth: 200 }}
      />

      {/* Points animés */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-alecia-pink rounded-full"
          />
        ))}
      </div>

      {/* Marque */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 text-alecia-gray-500 text-sm"
      >
        alecia présentations
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
