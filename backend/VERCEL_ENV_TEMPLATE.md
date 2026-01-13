# Template de Variables d'Environnement Vercel

Copiez-collez ces commandes dans votre terminal pour configurer rapidement les variables d'environnement.

## 🚀 Configuration Rapide via CLI

```bash
cd backend

# Flutterwave - Remplacez les valeurs entre guillemets
vercel env add FLW_PUBLIC_KEY production
# Collez votre clé publique Flutterwave

vercel env add FLW_SECRET_KEY production
# Collez votre clé secrète Flutterwave

vercel env add FLW_ENCRYPTION_KEY production
# Collez votre clé de chiffrement Flutterwave

vercel env add FLW_WEBHOOK_HASH production
# Collez votre hash webhook Flutterwave (optionnel)

# Firebase - Remplacez les valeurs entre guillemets
vercel env add FIREBASE_PROJECT_ID production
# Tapez: paycongo (ou votre project ID)

vercel env add FIREBASE_PRIVATE_KEY production
# Collez votre clé privée Firebase complète (avec les retours à la ligne)

vercel env add FIREBASE_CLIENT_EMAIL production
# Collez votre email de compte de service Firebase

# CORS - Remplacez par vos URLs
vercel env add ALLOWED_ORIGINS production
# Collez: https://paycongo-frontend.vercel.app,https://paycongo-frontend-ay3ps7q1s-abraham-barakas-projects.vercel.app,https://paycongo.web.app
```

## 📋 Format des Variables

### FIREBASE_PRIVATE_KEY
⚠️ **Important**: Dans Vercel, vous pouvez coller la clé privée de deux façons:

**Option 1 (Recommandé):** Collez la clé complète avec les retours à la ligne réels:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...
-----END PRIVATE KEY-----
```

**Option 2:** Si Vercel ne gère pas bien les retours à la ligne, utilisez `\n`:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

Le code backend remplace automatiquement `\\n` par de vrais retours à la ligne.

### ALLOWED_ORIGINS
Format: URLs séparées par des virgules, **sans espaces**
```
https://paycongo-frontend.vercel.app,https://paycongo.web.app
```

## ✅ Vérification

Après avoir ajouté toutes les variables:

```bash
# Vérifier les variables configurées
vercel env ls

# Redéployer
vercel --prod

# Tester
curl https://fezapay-abraham-barakas-projects.vercel.app/health
```

## 🔗 Liens Utiles

- **Vercel Dashboard**: https://vercel.com/abraham-barakas-projects/fezapay/settings/environment-variables
- **Flutterwave Dashboard**: https://dashboard.flutterwave.com/
- **Firebase Console**: https://console.firebase.google.com/
