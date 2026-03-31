import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { toast } from "sonner";

export interface Conflict<T = unknown> {
  id: number;
  projectId: string;
  conflictType: "slide_update" | "comment" | "permission" | "project_settings";
  localVersion: {
    data: T;
    timestamp: number;
  };
  serverVersion: {
    data: T;
    timestamp: number;
  };
  field?: string;
}

export interface ConflictResolutionModalProps<T = unknown> {
  conflict: Conflict<T> | null;
  onResolve: (resolution: "local" | "server" | "merge", mergedData?: T) => void;
  onCancel: () => void;
}

export function ConflictResolutionModal<T = unknown>({
  conflict,
  onResolve,
  onCancel,
}: ConflictResolutionModalProps<T>) {
  const [selectedResolution, setSelectedResolution] = useState<"local" | "server" | "merge">("server");

  if (!conflict) return null;

  const getConflictDescription = () => {
    switch (conflict.conflictType) {
      case "slide_update":
        return "Cette diapositive a été modifiée.";
      case "comment":
        return "Ce commentaire a été modifié.";
      case "permission":
        return "Les permissions ont été modifiées.";
      case "project_settings":
        return "Les paramètres du projet ont été modifiés.";
      default:
        return "Il y a un conflit de données.";
    }
  };

  const handleResolve = () => {
    if (selectedResolution === "merge") {
      toast.info("Merge functionality requires implementation");
      return;
    }
    onResolve(selectedResolution);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#111d2e] rounded-xl border border-[#1e3a5f] p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Conflit détecté</h3>
          <p className="text-gray-400 mb-4">{getConflictDescription()}</p>
          
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="resolution"
                checked={selectedResolution === "server"}
                onChange={() => setSelectedResolution("server")}
                className="text-[#e91e63]"
              />
              <span className="text-white">Utiliser la version serveur</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="resolution"
                checked={selectedResolution === "local"}
                onChange={() => setSelectedResolution("local")}
                className="text-[#e91e63]"
              />
              <span className="text-white">Garder ma version</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-[#e91e63] text-white rounded-lg hover:bg-[#c2185b] transition-colors"
            >
              Résoudre
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConflictResolutionModal;
