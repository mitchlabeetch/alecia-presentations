/**
 * Onboarding Component - First-run tutorial for new users
 * 5-step tour with spotlight effect and skip option
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "./Button";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: React.ReactNode;
  targetSelector?: string;
}

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bienvenue sur Alecia",
    description: "Votre assistant IA pour créer des présentations M&A professionnels. Découvrez toutes nos fonctionnalités pour accélérer votre travail.",
    image: (
      <div className="w-full h-40 bg-gradient-to-br from-alecia-pink/20 to-alecia-gold/20 rounded-xl flex items-center justify-center">
        <Sparkles className="w-16 h-16 text-alecia-gold" />
      </div>
    ),
  },
  {
    id: "create-project",
    title: "Créez votre premier projet",
    description: "Commencez par créer un nouveau projet. Choisissez parmi nos modèles spécialisés pour les opérations de cession, LBO, acquisition ou levée de fonds.",
    targetSelector: '[data-onboarding="new-project"]',
  },
  {
    id: "add-slides",
    title: "Ajoutez des diapositives",
    description: "Utilisez notre bibliothèque de blocs pour construire vos slides. Glissez-déposez, modifiez et personnalisez chaque élément.",
    targetSelector: '[data-onboarding="block-library"]',
  },
  {
    id: "use-ai",
    title: "Utilisez l'IA",
    description: "Notre assistant IA vous aide à générer du contenu, résumer des documents et améliorer vos présentations automatiquement.",
    targetSelector: '[data-onboarding="ai-chat"]',
  },
  {
    id: "export",
    title: "Exportez votre présentation",
    description: "Exportez votre présentation finale en PPTX, prêt à être partagée avec vos clients ou partenaires.",
    targetSelector: '[data-onboarding="export"]',
  },
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (step.targetSelector) {
      const element = document.querySelector(step.targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setSpotlightOpen(true);
      } else {
        setTargetRect(null);
        setSpotlightOpen(false);
      }
    } else {
      setTargetRect(null);
      setSpotlightOpen(false);
    }
  }, [step.targetSelector, currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dontShowAgain]);

  const handleNext = () => {
    if (isLastStep) {
      if (dontShowAgain) {
        localStorage.setItem("onboarding_completed", "true");
      }
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem("onboarding_completed", "true");
    }
    onSkip();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {spotlightOpen && targetRect ? (
          <>
            <svg className="fixed inset-0 w-full h-full pointer-events-none">
              <defs>
                <mask id="spotlight-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <rect
                    x={targetRect.x - 8}
                    y={targetRect.y - 8}
                    width={targetRect.width + 16}
                    height={targetRect.height + 16}
                    rx="8"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(10, 22, 40, 0.85)"
                mask="url(#spotlight-mask)"
              />
            </svg>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed border-2 border-alecia-gold rounded-lg shadow-lg shadow-alecia-gold/30 pointer-events-none"
              style={{
                left: targetRect.x - 8,
                top: targetRect.y - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          </>
        ) : (
          <div className="fixed inset-0 bg-alecia-navy/90 backdrop-blur-sm" />
        )}

        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-lg mx-4 bg-alecia-navy-light rounded-2xl border border-alecia-navy-lighter/50 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <div className="bg-gradient-to-r from-alecia-pink/10 to-alecia-gold/10 p-6 border-b border-alecia-navy-lighter/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-alecia-pink/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-alecia-pink" />
                </div>
                <span className="text-sm text-alecia-gray-400">
                  Étape {currentStep + 1} sur {ONBOARDING_STEPS.length}
                </span>
              </div>
              <button
                onClick={handleSkip}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-alecia-gray-400 hover:text-white"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {step.image && <div className="mb-4">{step.image}</div>}
            
            <h2
              id="onboarding-title"
              className="text-xl font-bold text-white mb-2"
            >
              {step.title}
            </h2>
            <p className="text-alecia-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="p-6 bg-alecia-navy/50 border-t border-alecia-navy-lighter/30">
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-alecia-navy-lighter bg-alecia-navy text-alecia-pink focus:ring-alecia-pink/50"
              />
              <span className="text-sm text-alecia-gray-400">
                Ne plus afficher ce tutoriel
              </span>
            </label>

            <div className="flex items-center justify-between">
              <div>
                {!isFirstStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                >
                  Passer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {isLastStep ? "Commencer" : "Suivant"}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-alecia-navy-lighter/30">
            <motion.div
              className="h-full bg-gradient-to-r from-alecia-pink to-alecia-gold"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    const hasSeenOnboarding = localStorage.getItem("onboarding_has_seen");
    
    if (!completed && !hasSeenOnboarding) {
      localStorage.setItem("onboarding_has_seen", "true");
      setShowOnboarding(true);
    }
    setLoading(false);
  }, []);

  const completeOnboarding = () => setShowOnboarding(false);
  const skipOnboarding = () => setShowOnboarding(false);
  
  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed");
    localStorage.removeItem("onboarding_has_seen");
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    loading,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}

export default Onboarding;
