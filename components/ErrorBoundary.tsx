import React from 'react';
import { useI18n } from './i18n';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // On pourrait envoyer l'erreur vers un service de logs ici
    console.error('UI ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      // Utiliser un composant fonctionnel interne pour accéder au contexte i18n
      const LocalizedError: React.FC = () => {
        const { t } = useI18n();
        return (
          <div className="min-h-dvh grid place-items-center p-6 text-center">
            <div>
              <div className="text-4xl mb-2">😕</div>
              <h1 className="text-xl font-semibold mb-1">{t('error_title')}</h1>
              <p className="text-sm opacity-80">{t('error_msg')}</p>
            </div>
          </div>
        );
      };
      return <LocalizedError />;
    }
    return this.props.children;
  }
}
