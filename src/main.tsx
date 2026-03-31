import { createRoot } from 'react-dom/client';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import './index.css';
import App from './App';
import { initSentry } from './lib/sentry';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { registerServiceWorker } from '@/lib/offlineStorage';

// Initialize Sentry for error tracking
initSentry();

// Register service worker for offline support
registerServiceWorker()
  .then((registration) => {
    if (registration) {
      console.log('Service Worker registered successfully');

      // Handle updates
      registration.addEventListener('updatefound', () => {
        console.log('New Service Worker available');
      });

      // Handle successful install
      registration.addEventListener('installed', () => {
        console.log('App installed - works offline');
      });
    }
  })
  .catch((error) => {
    console.warn('Service Worker registration failed:', error);
  });

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </ErrorBoundary>
);
