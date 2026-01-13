<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lancer et déployer l’application

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Hxq50x19iRYtr5DAz_oa6b1FBj2my0aQ

## Lancer en local

**Prerequisites:**  Node.js


1. Installer les dépendances:
   `npm install`
2. Définir `GEMINI_API_KEY` dans [.env.local](.env.local) si vous utilisez les fonctionnalités IA
3. Démarrer l’app:
   `npm run dev`

### Bridge Collecte (Mobile Money) → Émission (Cartes Visa) — Architecture recommandée

Flutterwave ne « tire » pas directement des fonds M‑Pesa à la création d’une carte. Il faut séparer:
1) Pay‑in (Collecte Mobile Money) → 2) Émission de carte (Issuing) après confirmation des fonds.

Nouveaux éléments dans l’app:
- Vue InitialDepositView: après KYC, l’utilisateur effectue un dépôt initial via Mobile Money (Vodacom M‑Pesa).
- Service payinService.ts: déclenche la charge Mobile Money via votre backend.
- issuingService.createVirtualCard accepte désormais transactionId et amount (preuve du paiement + montant initial).

Variables d’environnement supplémentaires:
- VITE_BACKEND_PAYIN_URL=https://votre-backend.exemple.com

Endpoints attendus côté backend:
- POST {VITE_BACKEND_PAYIN_URL}/payin/mobile-money → initie une charge (ex. Flutterwave Charges type mobile_money_franco). Répond { transactionId, status }.
- Webhook Flutterwave → votre backend confirme la réussite et met à jour l’état interne. Le frontend ne doit émettre la carte que si confirmé.
- POST {VITE_BACKEND_ISSUING_URL}/issuing/cards → crée la carte, le backend vérifie transactionId côté serveur avant d’appeler l’API de carte.

Sécurité:
- Secret keys (FLW_SECRET_KEY) uniquement côté serveur. Le frontend n’appelle que votre backend.
- KYC d’abord, dépôt ensuite, émission seulement après confirmation.

### Intégration KYC et Cartes Visa virtuelles (mock + providers réels)

L’app inclut désormais un flux KYC puis émission de carte virtuelle:
- KYC: services/kycService.ts
- Émission carte: services/issuingService.ts

Par défaut, ces services fonctionnent en mode « mock » (aucun appel externe), ce qui vous permet de tester le parcours sans compte fournisseur.

Pour activer des backends réels, exposez des endpoints côté serveur et définissez ces variables dans .env.local:

- VITE_BACKEND_KYC_URL=https://votre-backend.exemple.com
- VITE_BACKEND_ISSUING_URL=https://votre-backend.exemple.com
- VITE_BACKEND_PAYIN_URL=https://votre-backend.exemple.com

Endpoints attendus côté backend:
- POST {VITE_BACKEND_KYC_URL}/kyc/verify → vérifie le KYC et renvoie { approved, referenceId, riskScore? }
- POST {VITE_BACKEND_ISSUING_URL}/issuing/cards → crée une carte et renvoie les détails carte { id, pan/number, cvc, exp_month/exp_year ou expiry, balance, status, scheme }
- GET  {VITE_BACKEND_ISSUING_URL}/issuing/cards/:id → récupère une carte (optionnel)
- POST {VITE_BACKEND_PAYIN_URL}/payin/mobile-money → initie une charge Mobile Money et renvoie { transactionId, status }

Fournisseurs recommandés (selon disponibilité en Afrique/RDC):
- KYC: Smile Identity (fort sur ID africaines), Onfido, Veriff.
- Émission Visa: Flutterwave Issuing, Union54 (via partenaires), Marqeta, Rapyd. Vérifiez l’éligibilité pays/entreprise.

API choisie pour l’émission (réponse à « POUR GENERER DES CARTES QUELLE API VAS TU INTEGRER ? »)
- Nous ciblons en priorité Flutterwave Issuing pour générer des cartes Visa virtuelles, car:
  - Couverture et on‑ramp solides sur l’Afrique (dont RDC via partenaires).
  - API mature avec gestion des limites, funding, contrôle de statut, webhooks.
  - Démarrage plus rapide qu’un programme direct réseau (Visa/MC) pour une startup.

Intégration côté backend (schéma recommandé pour Flutterwave Issuing):
- Auth: clé secrète Flutterwave (Bearer <FLW_SECRET_KEY>) stockée côté serveur uniquement.
- POST /issuing/cards (votre backend) → proxy vers Flutterwave (ex: POST https://api.flutterwave.com/v3/virtual-cards)
  - Body minimal exemple: { currency: "USD", amount: 0, brand: "VISA", billing_name, email, phone }
  - Votre backend renvoie un format unifié: { id, pan/number?, cvc?, exp_month, exp_year, balance, status, scheme }
- GET /issuing/cards/:id (votre backend) → proxy vers GET https://api.flutterwave.com/v3/virtual-cards/:id

Notes importantes Flutterwave:
- Les API d’émission exposent souvent un PAN masqué et ne retournent pas toujours PAN/CVV en clair après création. Gérez la tokenisation/affichage sécurisé côté backend et front (ex.: afficher seulement 4 derniers chiffres).
- Respectez PCI DSS: ne stockez jamais PAN/CVV en clair sur le front; laissez le backend abstraire et chiffrer. Notre app front est déjà prête à consommer un format unifié via VITE_BACKEND_ISSUING_URL.

Logique côté app:
- KYCView appelle verifyKyc(), puis redirige vers InitialDepositView.
- InitialDepositView appelle initiateMobileMoneyCharge(); si succès confirmé, appelle createVirtualCard({ transactionId, amount }).
- La carte est enregistrée dans Firestore sous users/{uid}/cards/{cardId}.
- Un événement de transaction « Activation de carte virtuelle » (montant 0) est loggé.

Important:
- Nous avons supprimé le seed automatique de carte par défaut dans App.tsx. En production, la carte n’apparaît qu’après KYC.
- En l’absence de données Firestore, l’UI garde un fallback visuel local pour la démo.

## PWA (Application installable)

L’app est désormais une PWA basique:
- Manifest: `manifest.webmanifest`
- Service Worker: `sw.js` (pré-cache minimal, stratégie network-first pour HTML)
- Meta `theme-color`, safe-areas iOS/Android

Comment tester l’installation:
- Build: `npm run build` puis prévisualiser: `npm run preview`
- Ouvrir dans Chrome/Edge mobile, menu → « Ajouter à l’écran d’accueil »

## Déploiement

- Production build: `npm run build`
- Déployer sur Firebase Hosting: `npm run deploy`

### Déploiement local automatique (Windows/PowerShell)

Pour déployer en une seule commande (installe la CLI si besoin, build puis déploie):

- `npm run deploy:local`

Remarques:
- Le script PowerShell scripts/deploy-local.ps1 sélectionne le projet `paycongo` par défaut. Pour cibler un autre projet/site Hosting: `powershell -ExecutionPolicy Bypass -File ./scripts/deploy-local.ps1 -ProjectId votre-projet`.
- Vous devrez vous authentifier via le navigateur lors du premier lancement (firebase login).

### CI/CD (GitHub Actions)

Un workflow GitHub Actions est inclus: `.github/workflows/deploy.yml`.

- Sur tout push sur `main`, il build et déploie sur le canal `live` de Firebase Hosting.
- Sur une Pull Request, il build et déploie un aperçu (preview) sur un canal temporaire lié au numéro de PR.

Configuration requise dans le dépôt GitHub:
- Créez le secret `FIREBASE_SERVICE_ACCOUNT_PAYCONGO` (JSON de clé de compte de service avec rôle Firebase Admin/Hosting Admin pour le projet `paycongo`).
  - GCP Console → IAM & Admin → Comptes de service → Créer clé → JSON.
  - Copiez le contenu JSON dans le secret GitHub (Settings → Secrets and variables → Actions → New repository secret).

Commandes locales inchangées (voir ci‑dessus). Le dossier public de Firebase est `dist` (défini dans `firebase.json`).
