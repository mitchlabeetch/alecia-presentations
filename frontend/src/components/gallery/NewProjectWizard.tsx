import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  TrendingUp,
  Briefcase,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TemplateSelector } from './TemplateSelector';
import type { Project, Template } from '@/types';

type DealType = 'cession_vente' | 'lbo_levee_fonds' | 'acquisition_achats' | 'custom';

const DEAL_TYPE_OPTIONS = [
  {
    value: 'cession_vente' as DealType,
    label: 'Cession',
    description: 'Vente d\'une entreprise ou d\'un actif',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    value: 'lbo_levee_fonds' as DealType,
    label: 'Levée de fonds',
    description: 'Acquisition par effet de levier ou levée de capitaux',
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    value: 'acquisition_achats' as DealType,
    label: 'Acquisition',
    description: 'Achat d\'une entreprise ou d\'une participation',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    value: 'custom' as DealType,
    label: 'Personnalisé',
    description: 'Créer un projet sans modèle prédéfini',
    icon: <Sparkles className="w-6 h-6" />,
  },
];

interface WizardData {
  name: string;
  targetCompany: string;
  targetSector: string;
  dealType: DealType;
  templateId: string | null;
  hasPin: boolean;
  projectPin: string;
  userTag: string;
}

const initialData: WizardData = {
  name: '',
  targetCompany: '',
  targetSector: '',
  dealType: 'cession_vente',
  templateId: null,
  hasPin: false,
  projectPin: '',
  userTag: '',
};

export function NewProjectWizard() {
  const navigate = useNavigate();
  const createProject = useAppStore((state) => state.createProject);

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const totalSteps = 5;

  const handleClose = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
    setError(null);
    setSelectedTemplate(null);
  }, []);

  const updateData = useCallback(<K extends keyof WizardData>(
    key: K,
    value: WizardData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        if (!data.name.trim()) {
          setError('Le nom du projet est requis');
          return false;
        }
        return true;
      case 4:
        if (data.hasPin && data.projectPin.length < 4) {
          setError('Le code PIN doit contenir au moins 4 chiffres');
          return false;
        }
        return true;
      default:
        return true;
    }
  }, [data]);

  const goToNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  }, [currentStep, validateStep]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  }, []);

  const handleCreateProject = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const project = createProject(data.name, data.userTag || undefined);

      if (project) {
        handleClose();
        navigate(`/editor/${project.id}`);
      } else {
        setError('Erreur lors de la création du projet');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [data, createProject, handleClose, navigate]);

  const handleTemplateSelect = useCallback((template: Template | null) => {
    setSelectedTemplate(template);
    updateData('templateId', template?.id || null);
  }, [updateData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-alecia-navy/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-alecia-silver/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i + 1 === currentStep
                      ? 'bg-alecia-red'
                      : i + 1 < currentStep
                      ? 'bg-green-500'
                      : 'bg-alecia-silver/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-alecia-silver">
              Étape {currentStep} sur {totalSteps}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {currentStep === 1 && (
            <StepProjectInfo data={data} updateData={updateData} error={error} />
          )}

          {currentStep === 2 && (
            <StepDealType data={data} updateData={updateData} />
          )}

          {currentStep === 3 && (
            <StepTemplate
              data={data}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
          )}

          {currentStep === 4 && (
            <StepPinSetup data={data} updateData={updateData} error={error} />
          )}

          {currentStep === 5 && (
            <StepUserTag data={data} updateData={updateData} />
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-alecia-silver/20 bg-alecia-silver/5">
          <button
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            className="alecia-btn-secondary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          {currentStep < totalSteps ? (
            <button onClick={goToNextStep} className="alecia-btn-primary gap-2">
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreateProject}
              disabled={isLoading}
              className="alecia-btn-accent gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Créer le projet
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepProjectInfo({
  data,
  updateData,
  error,
}: {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-alecia-navy">
          Informations du projet
        </h2>
        <p className="mt-2 text-alecia-silver">
          Commencez par définir les informations de base de votre projet
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-alecia-navy mb-2">
            Nom du projet *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            className="alecia-input"
            placeholder="ex: Projet Alpha - Cession"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-alecia-navy mb-2">
            Entreprise cible
          </label>
          <input
            type="text"
            value={data.targetCompany}
            onChange={(e) => updateData('targetCompany', e.target.value)}
            className="alecia-input"
            placeholder="Nom de l'entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-alecia-navy mb-2">
            Secteur d'activité
          </label>
          <input
            type="text"
            value={data.targetSector}
            onChange={(e) => updateData('targetSector', e.target.value)}
            className="alecia-input"
            placeholder="ex: Industrie, Tech, Santé..."
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-alecia-red text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

function StepDealType({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-alecia-navy">
          Type d'opération
        </h2>
        <p className="mt-2 text-alecia-silver">
          Sélectionnez le type d'opération M&A que vous souhaitez créer
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DEAL_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateData('dealType', option.value)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              data.dealType === option.value
                ? 'border-alecia-red bg-alecia-red/5'
                : 'border-alecia-silver/20 hover:border-alecia-silver/50'
            }`}
          >
            <div className={`mb-3 ${
              data.dealType === option.value ? 'text-alecia-red' : 'text-alecia-navy'
            }`}>
              {option.icon}
            </div>
            <h3 className="font-semibold text-alecia-navy">{option.label}</h3>
            <p className="mt-1 text-sm text-alecia-silver">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepTemplate({
  data,
  selectedTemplate,
  onSelectTemplate,
}: {
  data: WizardData;
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template | null) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-alecia-navy">
          Choix du modèle
        </h2>
        <p className="mt-2 text-alecia-silver">
          Sélectionnez un modèle de présentation ou partez de zéro
        </p>
      </div>

      <TemplateSelector
        category={data.dealType}
        selectedTemplateId={selectedTemplate?.id || null}
        onSelectTemplate={onSelectTemplate}
      />

      <div className="flex justify-center">
        <button
          onClick={() => onSelectTemplate(null)}
          className={`px-6 py-3 rounded-lg border-2 transition-all ${
            selectedTemplate === null
              ? 'border-alecia-navy bg-alecia-navy text-white'
              : 'border-alecia-silver/30 hover:border-alecia-silver/50'
          }`}
        >
          Commencer de zéro
        </button>
      </div>
    </div>
  );
}

function StepPinSetup({
  data,
  updateData,
  error,
}: {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  error: string | null;
}) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-alecia-navy">
          Protection par PIN
        </h2>
        <p className="mt-2 text-alecia-silver">
          Protégez votre projet avec un code PIN (optionnel)
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        <label className="flex items-center gap-3 p-4 bg-alecia-silver/5 rounded-xl cursor-pointer hover:bg-alecia-silver/10 transition-colors">
          <input
            type="checkbox"
            checked={data.hasPin}
            onChange={(e) => updateData('hasPin', e.target.checked)}
            className="sr-only"
          />
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            data.hasPin
              ? 'bg-alecia-navy border-alecia-navy'
              : 'border-alecia-silver'
          }`}>
            {data.hasPin && (
              <Check className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-alecia-navy" />
            <div>
              <p className="font-medium text-alecia-navy">Protéger par PIN</p>
              <p className="text-sm text-alecia-silver">
                Limiter l'accès à certaines personnes
              </p>
            </div>
          </div>
        </label>

        {data.hasPin && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-alecia-navy">
              Code PIN du projet
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={data.projectPin}
                onChange={(e) => updateData('projectPin', e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="alecia-input text-center text-2xl tracking-[0.3em]"
                placeholder="••••"
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-alecia-silver"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-alecia-silver">
              Minimum 4 chiffres. Partagez ce code avec les personnes qui doivent accéder au projet.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-alecia-red text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

function StepUserTag({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-alecia-navy">
          Identification
        </h2>
        <p className="mt-2 text-alecia-silver">
          Définissez comment vous apparaîtrez dans le projet
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-alecia-navy mb-2">
            Votre nom ou initiale
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-silver" />
            <input
              type="text"
              value={data.userTag}
              onChange={(e) => updateData('userTag', e.target.value)}
              className="alecia-input pl-10"
              placeholder="Prénom Nom"
            />
          </div>
          <p className="mt-2 text-xs text-alecia-silver">
            Utilisé pour vous identifier dans les commentaires et la collaboration
          </p>
        </div>
      </div>

      <div className="bg-alecia-silver/5 rounded-xl p-6 max-w-sm mx-auto">
        <h3 className="font-medium text-alecia-navy mb-4">Récapitulatif</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-alecia-silver">Projet</dt>
            <dd className="font-medium text-alecia-navy">{data.name || '-'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-alecia-silver">Entreprise</dt>
            <dd className="font-medium text-alecia-navy">{data.targetCompany || '-'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-alecia-silver">Type</dt>
            <dd className="font-medium text-alecia-navy">
              {DEAL_TYPE_OPTIONS.find((d) => d.value === data.dealType)?.label}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-alecia-silver">Protection PIN</dt>
            <dd className="font-medium text-alecia-navy">
              {data.hasPin ? 'Oui' : 'Non'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
