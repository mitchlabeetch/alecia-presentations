<think>
I need to create a service worker file for offline support. Let me write the complete service worker implementation.
</think>

```Alecia Presentations/public/sw.js
/**
 * PitchForge Service Worker
 * Enables offline functionality for Alecia Presentations
 */

const CACHE_NAME = 'pitchforge-v1';
const STATIC_CACHE_NAME = 'pitchforge-static-v1';
const DYNAMIC_CACHE_NAME = 'pitchforge-dynamic-v1';
const RECENT_PROJECTS_CACHE = 'pitchforge-recent-projects-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: [
    /\.css$/,
    /\.js$/,
    /\.woff2?$/,
    /\.png$/,
    /\.svg$/,
    /\.ico$/,
  ],
  // Network first for API calls, fallback to cache
  api: [
    /\/api\//,
    /\/convex/,
  ],
  // Stale-while-revalidate for fonts and images
  fonts: [
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
  ],
};

// Maximum age for cached items (7 days)
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;

// Maximum number of recent projects to cache
const MAX_RECENT_PROJECTS = 5;

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Take control immediately
      self.skipWaiting(),
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                name.startsWith('pitchforge-') &&
                name !== CACHE_NAME &&
                name !== STATIC_CACHE_NAME &&
                name !== DYNAMIC_CACHE_NAME &&
                name !== RECENT_PROJECTS_CACHE
              );
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Claim all clients
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different request types
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isFontRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Check if request is for static assets
function isStaticAsset(request) {
  const url = new URL(request.url);
  return CACHE_STRATEGIES.static.some((pattern) => pattern.test(url.pathname));
}

// Check if request is for API
function isApiRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('convex') ||
    url.pathname.includes('convex')
  );
}

// Check if request is for fonts
function isFontRequest(request) {
  const url = new URL(request.url);
  return CACHE_STRATEGIES.fonts.some((pattern) => pattern.test(url.href));
}

// Check if request is for images
function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
}

/**
 * Cache First Strategy
 * For static assets that don't change often
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Check if cache is still valid
    const cacheDate = cachedResponse.headers.get('sw-cache-date');
    if (cacheDate) {
      const age = Date.now() - parseInt(cacheDate, 10);
      if (age < MAX_CACHE_AGE) {
        return cachedResponse;
      }
    } else {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const responseToCache = networkResponse.clone();

      // Add cache date header
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cache-date', Date.now().toString());

      const cachedResponseWithDate = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers,
      });

      cache.put(request, cachedResponseWithDate);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first fetch failed:', error);
    // Return offline fallback if available
    return caches.match('/index.html');
  }
}

/**
 * Network First Strategy
 * For API calls and dynamic content
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first fallback to cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline JSON response for API errors
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ error: 'offline', message: 'Vous êtes hors ligne' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fallback to cached index.html for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }

    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 * For fonts and images - serve cached, update in background
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(STATIC_CACHE_NAME);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => {
      // Silently fail for background updates
      return cachedResponse;
    });

  return cachedResponse || fetchPromise;
}

/**
 * Handle background sync for offline edits
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-project-updates') {
    event.waitUntil(syncProjectUpdates());
  }
});

/**
 * Sync project updates when back online
 */
async function syncProjectUpdates() {
  try {
    // Get pending updates from IndexedDB
    const db = await openDatabase();
    const tx = db.transaction('pendingUpdates', 'readonly');
    const store = tx.objectStore('pendingUpdates');
    const pendingUpdates = await store.getAll();

    for (const update of pendingUpdates) {
      try {
        await fetch(update.url, {
          method: update.method,
          headers: update.headers,
          body: update.body,
        });

        // Remove successfully synced update
        const deleteTx = db.transaction('pendingUpdates', 'readwrite');
        const deleteStore = deleteTx.objectStore('pendingUpdates');
        await deleteStore.delete(update.id);
      } catch (error) {
        console.error('[SW] Failed to sync update:', update.id, error);
      }
    }

    // Notify clients of sync completion
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        syncedCount: pendingUpdates.length,
      });
    });
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

/**
 * Open IndexedDB for storing pending updates
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PitchForgeOffline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store for pending offline updates
      if (!db.objectStoreNames.contains('pendingUpdates')) {
        db.createObjectStore('pendingUpdates', { keyPath: 'id', autoIncrement: true });
      }

      // Store for cached projects
      if (!db.objectStoreNames.contains('cachedProjects')) {
        db.createObjectStore('cachedProjects', { keyPath: 'projectId' });
      }
    };
  });
}

/**
 * Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_PROJECT':
      cacheProject(payload.projectId, payload.projectData);
      break;

    case 'GET_CACHED_PROJECT':
      getCachedProject(payload.projectId)
        .then((data) => {
          event.ports[0].postMessage({ success: true, data });
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;

    case 'CLEAR_PROJECT_CACHE':
      clearProjectCache(payload.projectId);
      break;

    case 'GET_OFFLINE_STATUS':
      getOfflineStatus()
        .then((status) => {
          event.ports[0].postMessage({ success: true, data: status });
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
  }
});

/**
 * Cache a project for offline access
 */
async function cacheProject(projectId, projectData) {
  try {
    const db = await openDatabase();
    const tx = db.transaction('cachedProjects', 'readwrite');
    const store = tx.objectStore('cachedProjects');

    const cacheEntry = {
      projectId,
      data: projectData,
      cachedAt: Date.now(),
    };

    // Limit cached projects
    const allKeys = await new Promise((resolve, reject) => {
      const getAllKeys = store.getAllKeys();
      getAllKeys.onsuccess = () => resolve(getAllKeys.result);
      getAllKeys.onerror = () => reject(getAllKeys.error);
    });

    if (allKeys.length >= MAX_RECENT_PROJECTS) {
      // Remove oldest cache entry
      const oldest = allKeys[0];
      store.delete(oldest);
    }

    await new Promise((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[SW] Cached project:', projectId);
  } catch (error) {
    console.error('[SW] Failed to cache project:', error);
  }
}

/**
 * Get a cached project
 */
async function getCachedProject(projectId) {
  const db = await openDatabase();
  const tx = db.transaction('cachedProjects', 'readonly');
  const store = tx.objectStore('cachedProjects');

  return new Promise((resolve, reject) => {
    const request = store.get(projectId);
    request.onsuccess = () => resolve(request.result?.data);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear a project from cache
 */
async function clearProjectCache(projectId) {
  const db = await openDatabase();
  const tx = db.transaction('cachedProjects', 'readwrite');
  const store = tx.objectStore('cachedProjects');

  return new Promise((resolve, reject) => {
    const request = store.delete(projectId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get offline status including pending syncs
 */
async function getOfflineStatus() {
  try {
    const db = await openDatabase();

    // Count pending updates
    const pendingTx = db.transaction('pendingUpdates', 'readonly');
    const pendingStore = pendingTx.objectStore('pendingUpdates');
    const pendingCount = await new Promise((resolve, reject) => {
      const countRequest = pendingStore.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });

    // Count cached projects
    const cachedTx = db.transaction('cachedProjects', 'readonly');
    const cachedStore = cachedTx.objectStore('cachedProjects');
    const cachedCount = await new Promise((resolve, reject) => {
      const countRequest = cachedStore.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });

    return {
      isOnline: navigator.onLine,
      pendingSyncCount: pendingCount,
      cachedProjectsCount: cachedCount,
      lastSyncTime: localStorage.getItem('lastSyncTime') || null,
    };
  } catch (error) {
    console.error('[SW] Failed to get offline status:', error);
    return {
      isOnline: navigator.onLine,
      pendingSyncCount: 0,
      cachedProjectsCount: 0,
      lastSyncTime: null,
    };
  }
}

// Listen for online/offline events
self.addEventListener('online', () => {
  console.log('[SW] Back online');
  self.registration.sync.register('sync-project-updates');
});

self.addEventListener('offline', () => {
  console.log('[SW] Gone offline');
});
