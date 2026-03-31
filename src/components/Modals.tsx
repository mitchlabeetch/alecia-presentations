import { lazy, Suspense } from 'react';
import { Skeleton } from './ui/LoadingSkeleton';

export const ExportModal = lazy(() =>
  import('./import-export/ExportModal').then((m) => ({ default: m.default }))
);
export const ImportModal = lazy(() =>
  import('./import-export/ImportModal').then((m) => ({ default: m.default }))
);
export const ShareModal = lazy(() =>
  import('./collaboration/ShareModal').then((m) => ({ default: m.ShareModal }))
);
export const ConflictModal = lazy(() =>
  import('./collaboration/ConflictResolutionModal').then((m) => ({
    default: m.ConflictResolutionModal,
  }))
);
export const Onboarding = lazy(() =>
  import('./Onboarding').then((m) => ({ default: m.Onboarding }))
);
export const AnalyticsDashboard = lazy(() =>
  import('./analytics/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard }))
);

export function LazyExportModal(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <ExportModal {...props} />
    </Suspense>
  );
}

export function LazyImportModal(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <ImportModal {...props} />
    </Suspense>
  );
}

export function LazyShareModal(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <ShareModal {...props} />
    </Suspense>
  );
}

export function LazyConflictModal(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <ConflictModal {...props} />
    </Suspense>
  );
}

export function LazyOnboarding(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <Onboarding {...props} />
    </Suspense>
  );
}

export function LazyAnalyticsDashboard(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Skeleton />
        </div>
      }
    >
      <AnalyticsDashboard {...props} />
    </Suspense>
  );
}
