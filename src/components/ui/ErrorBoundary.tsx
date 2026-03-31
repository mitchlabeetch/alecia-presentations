/**
 * Composant ErrorBoundary pour capturer les erreurs React
 * Affiche une interface utilisateur conviviale en cas d'erreur
 * Intégré avec Sentry pour le monitoring des erreurs
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary a capturé une erreur:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Envoyer l'erreur à Sentry
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-alecia-navy flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>

            <h1 className="text-white text-2xl font-bold text-center mb-2">
              Une erreur est survenue
            </h1>

            <p className="text-alecia-gray-400 text-center mb-6">
              Nous sommes désolés, mais quelque chose s'est mal passé. Notre équipe a été notifiée
              et travaille sur le problème.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-alecia-navy-light rounded-lg p-4 mb-6 overflow-auto">
                <p className="text-red-400 font-mono text-sm mb-2">{this.state.error.message}</p>
                {this.state.errorInfo && (
                  <pre className="text-alecia-gray-500 font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-6 py-3 bg-alecia-pink text-white rounded-lg hover:bg-alecia-pink-dark transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Recharger la page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 bg-alecia-navy-light text-white rounded-lg hover:bg-alecia-navy-lighter transition-colors border border-alecia-navy-lighter/50"
              >
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </button>
            </div>

            <p className="text-alecia-gray-500 text-sm text-center mt-8">
              Si le problème persiste, veuillez contacter le support technique.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
