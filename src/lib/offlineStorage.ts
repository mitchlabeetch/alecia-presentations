/**
 * Offline Storage Utility for Alecia Presentations
 * Handles IndexedDB operations for offline data persistence
 * Includes conflict resolution for multi-device editing
 */

interface CachedProject {
  projectId: string;
  data: unknown;
  lastModified: number;
  version: number;
}

interface PendingUpdate {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

interface ConflictRecord {
  id?: number;
  projectId: string;
  localData: unknown;
  serverData: unknown;
  localTimestamp: number;
  serverTimestamp: number;
  resolved: boolean;
}

interface OfflineStatus {
  isOnline: boolean;
  pendingSyncCount: number;
  cachedProjectsCount: number;
  lastSyncTime: string | null;
  hasConflicts: boolean;
  conflicts: ConflictRecord[];
}

const DB_NAME = 'PitchForgeOffline';
const DB_VERSION = 1;
const STORE_NAME = 'cachedProjects';
const PENDING_UPDATES_STORE = 'pendingUpdates';
const CONFLICTS_STORE = 'conflicts';
const SYNC_META_STORE = 'syncMeta';

let db: IDBDatabase | null = null;

type SyncListener = (status: OfflineStatus) => void;
const syncListeners: SyncListener[] = [];

async function initOfflineStorage(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Cached projects store
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const projectStore = database.createObjectStore(STORE_NAME, { keyPath: 'projectId' });
        projectStore.createIndex('lastModified', 'lastModified');
      }

      // Pending updates store
      if (!database.objectStoreNames.contains(PENDING_UPDATES_STORE)) {
        const pendingStore = database.createObjectStore(PENDING_UPDATES_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        pendingStore.createIndex('timestamp', 'timestamp');
      }

      // Conflicts store
      if (!database.objectStoreNames.contains(CONFLICTS_STORE)) {
        const conflictsStore = database.createObjectStore(CONFLICTS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        conflictsStore.createIndex('projectId', 'projectId');
        conflictsStore.createIndex('resolved', 'resolved');
      }

      // Sync metadata store
      if (!database.objectStoreNames.contains(SYNC_META_STORE)) {
        database.createObjectStore(SYNC_META_STORE, { keyPath: 'key' });
      }
    };
  });
}

async function saveProjectOffline(projectId: string, data: unknown): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put({
      projectId,
      data,
      lastModified: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getProjectOffline(projectId: string): Promise<CachedProject | undefined> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(projectId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteProjectOffline(projectId: string): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(projectId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getAllOfflineProjects(): Promise<CachedProject[]> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function queuePendingUpdate(update: Omit<PendingUpdate, 'id' | 'timestamp'>): Promise<number> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_UPDATES_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_UPDATES_STORE);

    const request = store.add({
      ...update,
      timestamp: Date.now(),
    });

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingUpdates(): Promise<PendingUpdate[]> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_UPDATES_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_UPDATES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const updates = (request.result || []).sort((a, b) => a.timestamp - b.timestamp);
      resolve(updates);
    };
    request.onerror = () => reject(request.error);
  });
}

async function removePendingUpdate(id: number): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_UPDATES_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_UPDATES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clearPendingUpdates(): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_UPDATES_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_UPDATES_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function recordConflict(conflict: Omit<ConflictRecord, 'id'>): Promise<number> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONFLICTS_STORE], 'readwrite');
    const store = transaction.objectStore(CONFLICTS_STORE);

    const request = store.add({
      ...conflict,
      resolved: false,
    });

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

async function getUnresolvedConflicts(): Promise<ConflictRecord[]> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONFLICTS_STORE], 'readonly');
    const store = transaction.objectStore(CONFLICTS_STORE);
    const index = store.index('resolved');
    const request = index.getAll(IDBKeyRange.only(false));

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function resolveConflict(id: number, resolution: 'local' | 'server'): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONFLICTS_STORE, STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CONFLICTS_STORE);
    const projectStore = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const conflict = getRequest.result as ConflictRecord;
      if (!conflict) {
        reject(new Error('Conflict not found'));
        return;
      }

      conflict.resolved = true;

      const putRequest = store.put(conflict);

      putRequest.onsuccess = () => {
        // Update the cached project with the resolved data
        if (resolution === 'local') {
          projectStore.put({
            projectId: conflict.projectId,
            data: conflict.localData,
            lastModified: Date.now(),
          });
        }
        resolve();
      };

      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function getOfflineStatus(): Promise<OfflineStatus> {
  const pendingCount = await countPendingUpdates();
  const cachedProjects = await countCachedProjects();
  const conflicts = await getUnresolvedConflicts();
  const lastSyncTime = await getLastSyncTime();

  return {
    isOnline: navigator.onLine,
    pendingSyncCount: pendingCount,
    cachedProjectsCount: cachedProjects,
    lastSyncTime,
    hasConflicts: conflicts.length > 0,
    conflicts,
  };
}

async function countPendingUpdates(): Promise<number> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_UPDATES_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_UPDATES_STORE);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function countCachedProjects(): Promise<number> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getLastSyncTime(): Promise<string | null> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_META_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_META_STORE);
    const request = store.get('lastSyncTime');

    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => reject(request.error);
  });
}

async function setLastSyncTime(time: string): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_META_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_META_STORE);
    const request = store.put({ key: 'lastSyncTime', value: time });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function syncPendingUpdates(): Promise<{ success: number; failed: number }> {
  const pendingUpdates = await getPendingUpdates();
  const conflicts = await getUnresolvedConflicts();

  let syncedCount = 0;
  let failedCount = 0;

  const result = { success: 0, failed: 0 };

  for (const update of pendingUpdates) {
    try {
      const response = await fetch(update.url, {
        method: update.method,
        headers: update.headers,
        body: update.body,
      });

      if (response.ok) {
        await removePendingUpdate(update.id!);
        syncedCount++;
      } else {
        failedCount++;
      }
    } catch {
      failedCount++;
    }
  }

  result.success = syncedCount;
  result.failed = failedCount;

  if (syncedCount > 0) {
    const now = new Date().toISOString();
    await setLastSyncTime(now);
  }

  notifySyncStatusChange();

  return result;
}

function detectConflict(localData: unknown, serverData: unknown): boolean {
  if (!localData || !serverData) return false;
  return JSON.stringify(localData) !== JSON.stringify(serverData);
}

function subscribeSyncStatus(listener: SyncListener): () => void {
  syncListeners.push(listener);
  return () => {
    const index = syncListeners.indexOf(listener);
    if (index > -1) syncListeners.splice(index, 1);
  };
}

function notifySyncStatusChange(): void {
  getOfflineStatus().then((status) => {
    syncListeners.forEach((listener) => listener(status));
  });
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content available, refresh to update');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

function isOnline(): boolean {
  return navigator.onLine;
}

function addConnectivityListener(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

async function cacheProjectForOffline(projectId: string, projectData: unknown): Promise<void> {
  const existing = await getProjectOffline(projectId);

  await saveProjectOffline(projectId, {
    projectId,
    data: projectData,
    lastModified: Date.now(),
    version: existing ? (existing as { version?: number }).version || 0 + 1 : 1,
  });

  notifySyncStatusChange();
}

async function clearAllOfflineData(): Promise<void> {
  const database = await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const stores = [STORE_NAME, PENDING_UPDATES_STORE, CONFLICTS_STORE, SYNC_META_STORE];

    let completed = 0;
    const transaction = database.transaction(stores, 'readwrite');

    stores.forEach((storeName) => {
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        completed++;
        if (completed === stores.length) {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  });
}

export {
  initOfflineStorage,
  saveProjectOffline,
  getProjectOffline,
  deleteProjectOffline,
  getAllOfflineProjects,
  queuePendingUpdate,
  getPendingUpdates,
  removePendingUpdate,
  clearPendingUpdates,
  recordConflict,
  getUnresolvedConflicts,
  resolveConflict,
  getOfflineStatus,
  countPendingUpdates,
  countCachedProjects,
  getLastSyncTime,
  setLastSyncTime,
  syncPendingUpdates,
  detectConflict,
  subscribeSyncStatus,
  registerServiceWorker,
  isOnline,
  addConnectivityListener,
  cacheProjectForOffline,
  clearAllOfflineData,
};

export type { CachedProject, PendingUpdate, ConflictRecord, OfflineStatus, SyncListener };
