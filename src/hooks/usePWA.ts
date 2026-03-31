Alecia Presentations/src/hooks/usePWA.ts
```
```typescript
import { useEffect, useState } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  serviceWorkerReady: boolean;
  updateAvailable: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
}

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
};

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    serviceWorkerReady: false,
    updateAvailable: false,
    installPromptEvent: null,
  });

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setState(prev => ({ ...prev, isInstalled: true }));
    }

    // Handle online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        installPromptEvent: e as BeforeInstallPromptEvent
      }));
    };

    // Handle service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        setState(prev => ({ ...prev, updateAvailable: true }));
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setState(prev => ({ ...prev, serviceWorkerReady: true }));
        console.log('Service Worker ready');
      });
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, installPromptEvent: null }));
      console.log('App installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const installApp = async () => {
    if (!state.installPromptEvent) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      await state.installPromptEvent.prompt();
      const { outcome } = await state.installPromptEvent.userChoice;
      console.log(`Install prompt result: ${outcome}`);
      setState(prev => ({ ...prev, installPromptEvent: null }));
      return outcome === 'accepted';
    } catch (err) {
      console.error('Install prompt error:', err);
      return false;
    }
  };

  const applyUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return {
    ...state,
    installApp,
    applyUpdate,
  };
}
