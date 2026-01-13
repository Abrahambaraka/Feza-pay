import React, { useState } from 'react';
import { useAuth } from '../src/AuthContext';

interface SignupViewProps {
  onBack: () => void;
  onSuccess: () => void;
  onLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onBack, onSuccess, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<null | 'google' | 'classic'>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });

  const { signup, loginWithGoogle } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleClassicSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoadingProvider('classic');
    try {
      await signup(formData.email, formData.password, formData.fullname);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = () => {
    setLoadingProvider('google');
    loginWithGoogle();
  };


  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      {/* Top Bar */}
      <header className="flex items-center px-4 pt-6 pb-2 justify-between z-10 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
        <button
          onClick={onBack}
          className="group flex size-10 shrink-0 items-center justify-center rounded-full active:bg-gray-200 dark:active:bg-surface-dark transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white group-hover:opacity-70 transition-opacity" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors" type="button">
          Aide
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-8 pt-2 overflow-y-auto no-scrollbar">
        {/* Hero / Branding */}
        <div className="mb-8 mt-2">
          <div className="size-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-[#0e8a38] flex items-center justify-center shadow-[0_0_20px_rgba(19,236,91,0.3)]">
            <span className="material-symbols-outlined text-background-dark" style={{ fontSize: '32px' }}>credit_card</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3">
            Créer un compte
          </h1>
          <p className="text-gray-600 dark:text-text-subtle text-base font-normal leading-relaxed">
            Rejoignez la révolution des paiements en RDC. Obtenez votre carte virtuelle instantanément.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleClassicSignup}>
          {/* Nom Complet */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="fullname">Nom complet</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
              </div>
              <input
                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-14 pl-12 pr-4 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:text-white"
                id="fullname"
                placeholder="Ex: Jean Kabila"
                type="text"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">Adresse email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
              </div>
              <input
                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-14 pl-12 pr-4 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:text-white"
                id="email"
                placeholder="nom@exemple.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="phone">Numéro de téléphone</label>
            <div className="flex gap-3">
              <div className="w-28 shrink-0 relative bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-14 flex items-center justify-center gap-2">
                <span className="text-xl">🇨🇩</span>
                <span className="text-gray-900 dark:text-white font-medium">+243</span>
              </div>
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>smartphone</span>
                </div>
                <input
                  className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-14 pl-12 pr-4 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:text-white"
                  id="phone"
                  placeholder="81 000 0000"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-text-subtle ml-1">Utilisé pour les dépôts Mobile Money (M-Pesa, Orange, Airtel).</p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="password">Mot de passe</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
              </div>
              <input
                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-14 pl-12 pr-12 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:text-white"
                id="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* TOS Checkbox */}
          <div className="flex items-start gap-3 mt-2 px-1">
            <div className="relative flex items-center">
              <input
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                id="tos"
                type="checkbox"
                required
              />
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontWeight: 'bold' }}>check</span>
              </span>
            </div>
            <label className="text-sm text-gray-500 dark:text-gray-400 leading-snug cursor-pointer select-none" htmlFor="tos">
              J'accepte les <a className="text-primary hover:underline font-medium" href="#">Termes et Conditions</a> et la <a className="text-primary hover:underline font-medium" href="#">Politique de Confidentialité</a>.
            </label>
          </div>

          {/* Action Button */}
          <button
            disabled={!!loadingProvider}
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg h-14 rounded-xl shadow-[0_4px_14px_0_rgba(19,236,91,0.39)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            type="submit"
          >
            {loadingProvider === 'classic' ? 'Création...' : 'Créer un compte'}
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative my-8">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background-light dark:bg-background-dark px-3 text-sm text-gray-400 dark:text-gray-500 font-medium">Ou continuer avec</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={!!loadingProvider}
            className="flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-[#1f402b] h-12 rounded-lg transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
            type="button">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
              <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8455 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"></path>
              <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
              <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"></path>
            </svg>
            <span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">{loadingProvider === 'google' ? 'Redirection Google...' : 'Continuer avec Google'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 text-center text-sm text-red-500">{errorMsg}</div>
        )}

        {/* Bottom Link */}
        <div className="mt-8 text-center pb-8">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vous avez déjà un compte ?
            <button onClick={onLogin} className="text-primary font-bold hover:underline ml-1 transition-all" type="button">Se connecter</button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupView;
