
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './app/router';
import { registerSW } from './lib/serviceWorker';

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

function recoverFromChunkError(reason: unknown) {
  if (!isDynamicImportError(reason)) return;

  const alreadyRetried = sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1';
  if (alreadyRetried) return;

  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
  // Force a fresh index fetch to reconcile new asset hashes after deploy.
  window.location.reload();
}

window.addEventListener('error', (event) => {
  recoverFromChunkError(event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  recoverFromChunkError(event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Register service worker for PWA support
registerSW();
