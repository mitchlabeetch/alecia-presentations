/**
 * Layout principal de l'application
 * Inclut la barre de navigation latérale et l'en-tête
 */

import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react';
import useStore from '@store/index';

/**
 * Élément de navigation dans la barre latérale
 */
interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive 
        ? 'bg-alecia-pink text-white shadow-alecia-pink' 
        : 'text-alecia-gray-300 hover:bg-alecia-navy-light hover:text-white'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-auto bg-alecia-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </NavLink>
);

/**
 * Fil d'Ariane
 */
const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const labels: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'presentations': 'Mes présentations',
    'templates': 'Templates',
    'settings': 'Paramètres',
    'editor': 'Éditeur',
  };
  
  return (
    <nav className="flex items-center gap-2 text-sm text-alecia-gray-400">
      <NavLink to="/dashboard" className="hover:text-white transition-colors">
        Accueil
      </NavLink>
      {pathnames.map((name, index) => (
        <React.Fragment key={name}>
          <ChevronRight className="w-4 h-4" />
          <span className={index === pathnames.length - 1 ? 'text-white' : ''}>
            {labels[name] || name}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Layout principal
 */
const MainLayout: React.FC = () => {
  const { user, logout } = useStore();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: '1', title: 'Nouveau collaborateur', message: 'Marie a rejoint votre présentation', read: false },
    { id: '2', title: 'Présentation sauvegardée', message: 'Votre présentation a été sauvegardée', read: true },
  ]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-alecia-navy flex">
      {/* Barre latérale */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-72 bg-alecia-navy-light border-r border-alecia-navy-lighter/30 flex flex-col fixed h-full z-20"
      >
        {/* Logo */}
        <div className="p-6 border-b border-alecia-navy-lighter/30">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-alecia-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">&</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">alecia</h1>
              <p className="text-alecia-gray-400 text-xs">Présentations</p>
            </div>
          </NavLink>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-6">
            <p className="text-alecia-gray-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">
              Menu principal
            </p>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" />
            <NavItem to="/presentations" icon={FileText} label="Mes présentations" />
            <NavItem to="/templates" icon={LayoutTemplate} label="Templates" />
          </div>
          
          <div>
            <p className="text-alecia-gray-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">
              Configuration
            </p>
            <NavItem to="/settings" icon={Settings} label="Paramètres" />
          </div>
        </nav>
        
        {/* Pied de page de la barre latérale */}
        <div className="p-4 border-t border-alecia-navy-lighter/30">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-alecia-navy/50">
            <div className="w-10 h-10 rounded-full bg-alecia-pink/20 flex items-center justify-center">
              <User className="w-5 h-5 text-alecia-pink" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-alecia-gray-400 text-xs truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
      
      {/* Contenu principal */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* En-tête */}
        <header className="h-16 bg-alecia-navy-light/50 backdrop-blur-sm border-b border-alecia-navy-lighter/30 flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Fil d'Ariane */}
          <Breadcrumb />
          
          {/* Actions de l'en-tête */}
          <div className="flex items-center gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-alecia-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 pl-10 pr-4 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-sm text-white placeholder:text-alecia-gray-400 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none transition-all"
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-alecia-navy-light transition-colors"
              >
                <Bell className="w-5 h-5 text-alecia-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-alecia-pink text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Menu des notifications */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-alecia-navy-light rounded-xl border border-alecia-navy-lighter/30 shadow-alecia-lg z-50"
                >
                  <div className="p-4 border-b border-alecia-navy-lighter/30">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-alecia-gray-400 text-center">
                        Aucune notification
                      </p>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-alecia-navy-lighter/20 hover:bg-alecia-navy/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-alecia-pink/5' : ''
                          }`}
                          onClick={() => {
                            setNotifications(prev =>
                              prev.map(n =>
                                n.id === notification.id ? { ...n, read: true } : n
                              )
                            );
                          }}
                        >
                          <p className="text-white text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-alecia-gray-400 text-xs mt-1">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Profil utilisateur */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-alecia-navy-light transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-alecia-pink flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </button>
              
              {/* Menu du profil */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-alecia-navy-light rounded-xl border border-alecia-navy-lighter/30 shadow-alecia-lg z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {/* Ouvrir les paramètres du profil */}}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-alecia-gray-300 hover:bg-alecia-navy hover:text-white transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mon profil</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-alecia-gray-300 hover:bg-alecia-navy hover:text-white transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>
        
        {/* Contenu de la page */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
