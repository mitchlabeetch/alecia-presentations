/**
 * Page des paramètres
 * Configuration de l'application et du profil utilisateur
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Keyboard,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  Building,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';
import useStore from '@store/index';

/**
 * Section de paramètres
 */
interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-dark p-6"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 bg-alecia-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-alecia-pink" />
      </div>
      <div>
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        {description && (
          <p className="text-alecia-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
    {children}
  </motion.div>
);

/**
 * Champ de formulaire
 */
interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  icon: Icon,
}) => (
  <div className="mb-4">
    <label className="block text-alecia-gray-300 text-sm font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-400" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all disabled:opacity-50`}
      />
    </div>
  </div>
);

/**
 * Interrupteur (toggle)
 */
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-white font-medium">{label}</p>
      {description && (
        <p className="text-alecia-gray-400 text-sm mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-alecia-pink' : 'bg-alecia-navy-lighter'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

/**
 * Page des paramètres
 */
const SettingsPage: React.FC = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'security'>('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // État du profil
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: '',
  });

  // État des notifications
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    collaborationAlerts: true,
    mentionNotifications: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  // État de l'apparence
  const [appearance, setAppearance] = useState({
    darkMode: true,
    compactMode: false,
    showGrid: true,
    animationsEnabled: true,
  });

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simuler la sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
          <p className="text-alecia-gray-400 mt-1">
            Personnalisez votre expérience
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="btn-primary flex items-center gap-2"
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-4 h-4" />
              Sauvegardé
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Navigation latérale */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-alecia-pink text-white'
                      : 'text-alecia-gray-300 hover:bg-alecia-navy-light hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <>
              <SettingsSection
                title="Informations personnelles"
                description="Mettez à jour vos informations de profil"
                icon={User}
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-alecia-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-alecia-navy-light rounded-full flex items-center justify-center border border-alecia-navy-lighter/50 hover:bg-alecia-navy transition-colors">
                      <Camera className="w-4 h-4 text-alecia-gray-400" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-medium">Photo de profil</p>
                    <p className="text-alecia-gray-400 text-sm">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Prénom"
                    value={profile.firstName}
                    onChange={(value) => setProfile({ ...profile, firstName: value })}
                    placeholder="Votre prénom"
                  />
                  <FormField
                    label="Nom"
                    value={profile.lastName}
                    onChange={(value) => setProfile({ ...profile, lastName: value })}
                    placeholder="Votre nom"
                  />
                </div>

                <FormField
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(value) => setProfile({ ...profile, email: value })}
                  placeholder="votre@email.com"
                  icon={Mail}
                />

                <FormField
                  label="Téléphone"
                  type="tel"
                  value={profile.phone}
                  onChange={(value) => setProfile({ ...profile, phone: value })}
                  placeholder="+33 1 23 45 67 89"
                  icon={Phone}
                />

                <FormField
                  label="Département"
                  value={profile.department}
                  onChange={(value) => setProfile({ ...profile, department: value })}
                  placeholder="Votre département"
                  icon={Building}
                />
              </SettingsSection>
            </>
          )}

          {activeTab === 'notifications' && (
            <SettingsSection
              title="Préférences de notification"
              description="Choisissez comment vous souhaitez être notifié"
              icon={Bell}
            >
              <Toggle
                label="Mises à jour par email"
                description="Recevez des emails sur les mises à jour importantes"
                checked={notifications.emailUpdates}
                onChange={(checked) =>
                  setNotifications({ ...notifications, emailUpdates: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Alertes de collaboration"
                description="Soyez notifié quand quelqu'un modifie vos présentations"
                checked={notifications.collaborationAlerts}
                onChange={(checked) =>
                  setNotifications({ ...notifications, collaborationAlerts: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Notifications de mentions"
                description="Soyez notifié quand quelqu'un vous mentionne"
                checked={notifications.mentionNotifications}
                onChange={(checked) =>
                  setNotifications({ ...notifications, mentionNotifications: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Résumé hebdomadaire"
                description="Recevez un résumé de vos activités chaque semaine"
                checked={notifications.weeklyDigest}
                onChange={(checked) =>
                  setNotifications({ ...notifications, weeklyDigest: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Emails marketing"
                description="Recevez des informations sur les nouvelles fonctionnalités"
                checked={notifications.marketingEmails}
                onChange={(checked) =>
                  setNotifications({ ...notifications, marketingEmails: checked })
                }
              />
            </SettingsSection>
          )}

          {activeTab === 'appearance' && (
            <SettingsSection
              title="Apparence"
              description="Personnalisez l'interface de l'application"
              icon={Palette}
            >
              <Toggle
                label="Mode sombre"
                description="Utiliser le thème sombre par défaut"
                checked={appearance.darkMode}
                onChange={(checked) =>
                  setAppearance({ ...appearance, darkMode: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Mode compact"
                description="Réduire l'espacement entre les éléments"
                checked={appearance.compactMode}
                onChange={(checked) =>
                  setAppearance({ ...appearance, compactMode: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Afficher la grille"
                description="Afficher une grille dans l'éditeur"
                checked={appearance.showGrid}
                onChange={(checked) =>
                  setAppearance({ ...appearance, showGrid: checked })
                }
              />
              <div className="border-t border-alecia-navy-lighter/30" />
              <Toggle
                label="Animations"
                description="Activer les animations de l'interface"
                checked={appearance.animationsEnabled}
                onChange={(checked) =>
                  setAppearance({ ...appearance, animationsEnabled: checked })
                }
              />
            </SettingsSection>
          )}

          {activeTab === 'security' && (
            <SettingsSection
              title="Sécurité"
              description="Gérez la sécurité de votre compte"
              icon={Shield}
            >
              <div className="space-y-4">
                <div className="p-4 bg-alecia-navy rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Mot de passe</p>
                      <p className="text-alecia-gray-400 text-sm">
                        Dernière modification il y a 3 mois
                      </p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Modifier
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-alecia-navy rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Authentification à deux facteurs
                      </p>
                      <p className="text-alecia-gray-400 text-sm">
                        Sécurisez votre compte avec la 2FA
                      </p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Activer
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-alecia-navy rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Sessions actives</p>
                      <p className="text-alecia-gray-400 text-sm">
                        2 appareils connectés
                      </p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Gérer
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Zone dangereuse</p>
                    <p className="text-red-400/70 text-sm mt-1">
                      Ces actions sont irréversibles. Soyez prudent.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
