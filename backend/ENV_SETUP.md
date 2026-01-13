# Configuration des Variables d'Environnement Vercel

Ce guide vous aide à configurer toutes les variables d'environnement nécessaires pour le backend PayCongo sur Vercel.

## 📋 Liste des Variables Requises

### 1. Flutterwave (Paiements et Cartes Virtuelles)

```
FLW_PUBLIC_KEY=votre_cle_publique_flutterwave
FLW_SECRET_KEY=votre_cle_secrete_flutterwave
FLW_ENCRYPTION_KEY=votre_cle_chiffrement_flutterwave
FLW_WEBHOOK_HASH=votre_hash_webhook_flutterwave
```

**Où les trouver :**
- Connectez-vous à votre [Dashboard Flutterwave](https://dashboard.flutterwave.com/)
- Allez dans **Settings → API Keys**
- Copiez les clés publiques et secrètes
- Pour l'encryption key, allez dans **Settings → Security**
- Pour le webhook hash, allez dans **Settings → Webhooks** et copiez le hash de vérification

### 2. Firebase Admin (Authentification)

```
FIREBASE_PROJECT_ID=paycongo
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=votre-email@paycongo.iam.gserviceaccount.com
```

**Où les trouver :**
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `paycongo`
3. Allez dans **Project Settings → Service Accounts**
4. Cliquez sur **Generate New Private Key**
5. Téléchargez le fichier JSON
6. Extrayez :
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (remplacez `\n` par de vrais retours à la ligne)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**⚠️ Important pour FIREBASE_PRIVATE_KEY :**
- Dans Vercel, vous devez remplacer les `\n` littéraux par de vrais retours à la ligne
- Ou utilisez le format avec `\n` si Vercel le gère automatiquement
- Le code backend remplace automatiquement `\\n` par `\n`

### 3. CORS (Origines Autorisées)

```
ALLOWED_ORIGINS=https://paycongo-frontend.vercel.app,https://paycongo-frontend-ay3ps7q1s-abraham-barakas-projects.vercel.app,https://paycongo.web.app
```

**Format :** Liste d'URLs séparées par des virgules (sans espaces)

### 4. Configuration Serveur (Optionnel)

```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
```

Ces valeurs sont optionnelles et ont des valeurs par défaut.

## 🚀 Comment Configurer dans Vercel

### Méthode 1 : Via l'Interface Web (Recommandé)

1. **Accédez à votre projet Vercel :**
   - https://vercel.com/abraham-barakas-projects/fezapay/settings/environment-variables

2. **Ajoutez chaque variable :**
   - Cliquez sur **Add New**
   - Entrez le **Name** (ex: `FLW_PUBLIC_KEY`)
   - Entrez la **Value**
   - Sélectionnez les **Environments** (Production, Preview, Development)
   - Cliquez sur **Save**

3. **Répétez pour toutes les variables**

### Méthode 2 : Via Vercel CLI

```bash
cd backend

# Flutterwave
vercel env add FLW_PUBLIC_KEY production
vercel env add FLW_SECRET_KEY production
vercel env add FLW_ENCRYPTION_KEY production
vercel env add FLW_WEBHOOK_HASH production

# Firebase
vercel env add FIREBASE_PROJECT_ID production
vercel env add FIREBASE_PRIVATE_KEY production
vercel env add FIREBASE_CLIENT_EMAIL production

# CORS
vercel env add ALLOWED_ORIGINS production
```

### Méthode 3 : Import en Masse (Fichier .env)

1. Créez un fichier `.env.production` avec toutes les variables
2. Utilisez Vercel CLI pour les importer :

```bash
vercel env pull .env.production
# Puis modifiez le fichier avec vos valeurs
vercel env add .env.production
```

## ✅ Vérification

Après avoir configuré les variables :

1. **Redéployez le backend :**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Testez l'endpoint de santé :**
   ```bash
   curl https://fezapay-abraham-barakas-projects.vercel.app/health
   ```

   Vous devriez recevoir une réponse JSON avec le statut.

## 🔒 Sécurité

- ⚠️ **Ne commitez JAMAIS** les fichiers `.env` dans Git
- ⚠️ **Ne partagez JAMAIS** vos clés secrètes publiquement
- ✅ Utilisez des valeurs différentes pour Production, Preview et Development
- ✅ Régénérez les clés si elles sont compromises

## 🐛 Dépannage

### Erreur : "Missing required environment variable"
- Vérifiez que toutes les variables sont définies dans Vercel
- Vérifiez que vous avez sélectionné le bon environnement (Production)

### Erreur : "Invalid Firebase credentials"
- Vérifiez que `FIREBASE_PRIVATE_KEY` contient bien les retours à la ligne
- Vérifiez que `FIREBASE_CLIENT_EMAIL` est correct
- Vérifiez que le compte de service a les bonnes permissions

### Erreur : "CORS error"
- Vérifiez que votre URL frontend est dans `ALLOWED_ORIGINS`
- Vérifiez qu'il n'y a pas d'espaces dans la liste

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel : `vercel logs`
2. Testez l'endpoint `/health` pour voir quelles variables manquent
3. Vérifiez la documentation Flutterwave et Firebase
