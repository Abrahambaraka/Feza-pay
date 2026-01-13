import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './components/i18n';
import { AuthProvider } from './src/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const LoadingFallback: React.FC = () => {
  return <div className="w-full h-dvh grid place-items-center">Chargement…</div>;
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Enregistrement du Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {
        // silencieux: ne pas bloquer l'app si le SW échoue
      });
  });
}
