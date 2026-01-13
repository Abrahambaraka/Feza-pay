
import React, { useState } from 'react';
import { verifyKyc } from '../services/kycService';

interface KYCViewProps {
  onBack: () => void;
  onComplete: () => void;
}

const KYCView: React.FC<KYCViewProps> = ({ onBack, onComplete }) => {
  const [docType, setDocType] = useState<'voter' | 'passport'>('voter');
  const [frontUploaded, setFrontUploaded] = useState(true); // Default true for demo visual match
  const [backUploaded, setBackUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // Minimal payload for demo; real app would send signed upload URLs or file refs
      const kyc = await verifyKyc({
        documentType: docType,
        frontImageUrl: frontUploaded ? 'mock://front' : undefined,
        backImageUrl: backUploaded ? 'mock://back' : undefined,
      });

      if (!kyc.approved) {
        throw new Error('Votre vérification KYC a été refusée.');
      }

      // Ne pas émettre la carte ici. Rediriger vers le dépôt initial.
      onComplete();
    } catch (e: any) {
      setError(e?.message || 'Échec de la vérification. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="text-[#111418] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Vérification</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 px-6 pt-2 pb-6">
        <div className="flex justify-between items-end">
          <p className="text-[#637588] dark:text-[#93a2b1] text-xs font-semibold uppercase tracking-wider">Étape 2 sur 3</p>
          <p className="text-primary text-xs font-bold">66%</p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#e0e2e5] dark:bg-[#233429]">
          <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '66%' }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-56">
        {/* Hero / Intro */}
        <div className="px-6 pb-6">
          <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center mb-6 border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#13ec5b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>badge</span>
          </div>
          <h1 className="text-[#111418] dark:text-white text-[28px] font-extrabold leading-tight tracking-tight mb-3">Vérifiez votre identité</h1>
          <p className="text-[#637588] dark:text-[#9ca3af] text-base font-normal leading-relaxed">
            Pour activer votre carte virtuelle, nous devons confirmer votre identité. Vos données sont chiffrées.
          </p>
        </div>

        {/* Document Selector */}
        <div className="px-6 mb-6">
          <label className="block text-sm font-bold mb-3 text-[#111418] dark:text-white">Type de document</label>
          <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl">
            <button 
              onClick={() => setDocType('voter')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${docType === 'voter' ? 'shadow-sm bg-white dark:bg-[#344e3d] text-[#111418] dark:text-white' : 'text-[#637588] dark:text-[#9ca3af]'}`}
            >
              Carte d'électeur
            </button>
            <button 
              onClick={() => setDocType('passport')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${docType === 'passport' ? 'shadow-sm bg-white dark:bg-[#344e3d] text-[#111418] dark:text-white' : 'text-[#637588] dark:text-[#9ca3af]'}`}
            >
              Passeport
            </button>
          </div>
        </div>

        {/* Upload Zones */}
        <div className="px-6 flex flex-col gap-4">
          {/* Front Side */}
          <div className="group relative">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-[#111418] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Recto de la carte
              </label>
              {frontUploaded && <span className="text-xs font-medium text-primary">Téléchargé</span>}
            </div>
            <button 
              onClick={() => setFrontUploaded(!frontUploaded)}
              className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden ${frontUploaded ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-dashed border-gray-300 dark:border-[#344e3d] bg-gray-50 dark:bg-surface-dark'}`}
            >
              {frontUploaded ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/id_front/400/200')" }}></div>
                  <div className="z-10 flex flex-col items-center">
                    <div className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined">edit</span>
                    </div>
                    <span className="text-sm font-bold text-[#111418] dark:text-white">Modifier la photo</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="size-12 rounded-full bg-gray-200 dark:bg-[#2a4032] text-[#637588] dark:text-[#93a2b1] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-[#111418] dark:text-white block">Prendre une photo</span>
                    <span className="text-xs text-[#637588] dark:text-[#93a2b1]">ou importer un fichier</span>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Back Side */}
          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-[#111418] dark:text-white">Verso de la carte</label>
              {backUploaded && <span className="text-xs font-medium text-primary">Téléchargé</span>}
            </div>
            <button 
              onClick={() => setBackUploaded(!backUploaded)}
              className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all group-focus:ring-2 group-focus:ring-primary ${backUploaded ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-dashed border-gray-300 dark:border-[#344e3d] bg-gray-50 dark:bg-surface-dark'}`}
            >
              {backUploaded ? (
                 <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/id_back/400/200')" }}></div>
                  <div className="z-10 flex flex-col items-center">
                    <div className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined">edit</span>
                    </div>
                    <span className="text-sm font-bold text-[#111418] dark:text-white">Modifier la photo</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="size-12 rounded-full bg-gray-200 dark:bg-[#2a4032] text-[#637588] dark:text-[#93a2b1] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-[#111418] dark:text-white block">Prendre une photo</span>
                    <span className="text-xs text-[#637588] dark:text-[#93a2b1]">ou importer un fichier</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="px-6 mt-8">
          <div className="bg-blue-50 dark:bg-[#162636] p-4 rounded-xl flex gap-3 border border-blue-100 dark:border-[#1e3a52]">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Conseils pour la photo</h4>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Assurez-vous que les 4 coins sont visibles</li>
                <li>Évitez les reflets et le flou</li>
                <li>Le texte doit être clairement lisible</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Spacer to ensure last content is not hidden behind the submit bar */}
        <div className="h-10" aria-hidden />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 max-w-md mx-auto z-20">
        {error && (
          <div className="mb-3 text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>
        )}
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full bg-primary hover:bg-[#0fd650] text-[#0a2814] font-bold text-base py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span>{submitting ? 'Vérification en cours…' : 'Soumettre les documents'}</span>
          <span className="material-symbols-outlined text-[20px]">{submitting ? 'hourglass_top' : 'arrow_forward'}</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-4 opacity-60">
          <span className="material-symbols-outlined text-[14px] text-[#637588] dark:text-[#93a2b1]">lock</span>
          <p className="text-[11px] font-medium text-[#637588] dark:text-[#93a2b1] text-center">
          Vos données personnelles sont chiffrées et sécurisées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCView;
