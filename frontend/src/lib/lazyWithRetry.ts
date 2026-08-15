import { lazy, type ComponentType } from 'react';

const CHUNK_RELOAD_KEY = 'rm_chunk_reload_once';

function isDynamicImportError(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('ChunkLoadError')
  );
}

/**
 * Wrapper around React.lazy that recovers from stale-chunk failures (a new
 * deploy replaced hashed assets while a user still had an old index.html
 * cached). React.lazy swallows the import rejection and re-throws it during
 * render, bypassing window-level error/unhandledrejection handlers, so we must
 * handle the failure here.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(() =>
    factory().catch((error: unknown) => {
      if (!isDynamicImportError(error)) {
        throw error;
      }

      const alreadyRetried = sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1';
      if (!alreadyRetried) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        // Force a fresh index.html fetch so the app picks up the new asset hashes.
        window.location.reload();
        // Keep Suspense pending while the page reload is in progress.
        return new Promise<{ default: T }>(() => {});
      }

      // Already reloaded once; give the chunk one cache-busted retry before
      // letting the ErrorBoundary render.
      return factory();
    })
  );
}