# 🚀 Guide de Déploiement - Configuration Base de Données

## ✅ Étape 1 : Ajouter les Variables d'Environnement dans Vercel

### Instructions Détaillées

1. **Accédez à votre projet Vercel**
   - Allez sur https://vercel.com/dashboard
   - Sélectionnez votre projet **fezapay**

2. **Ouvrez les paramètres**
   - Cliquez sur **Settings** (en haut)
   - Dans le menu latéral, cliquez sur **Environment Variables**

3. **Ajoutez les variables suivantes**

   Pour chaque variable ci-dessous :
   - Cliquez sur **Add New**
   - Entrez le **Name** (nom de la variable)
   - Entrez la **Value** (valeur)
   - Sélectionnez **Production**, **Preview**, et **Development**
   - Cliquez sur **Save**

   **Variables à ajouter :**

   ```
   Name: POSTGRES_URL
   Value: postgres://50cc325f5280784e2745f72434acd74b2fbe3916c0de14325896ce7c6d6183f5:sk_7ayG37NJKxSMwHbk7iRlH@db.prisma.io:5432/postgres?sslmode=require
   ```

   ```
   Name: POSTGRES_URL_NON_POOLING
   Value: postgres://50cc325f5280784e2745f72434acd74b2fbe3916c0de14325896ce7c6d6183f5:sk_7ayG37NJKxSMwHbk7iRlH@db.prisma.io:5432/postgres?sslmode=require
   ```

   ```
   Name: DATABASE_URL
   Value: postgres://50cc325f5280784e2745f72434acd74b2fbe3916c0de14325896ce7c6d6183f5:sk_7ayG37NJKxSMwHbk7iRlH@db.prisma.io:5432/postgres?sslmode=require
   ```

4. **Vérifiez les autres variables requises**

   Assurez-vous que ces variables sont également configurées :

   - `JWT_SECRET` - Clé secrète pour les tokens JWT
   - `FRONTEND_URL` - URL de votre frontend (ex: https://fezapay.vercel.app)
   - `GOOGLE_CLIENT_ID` - Si vous utilisez Google OAuth
   - `GOOGLE_CLIENT_SECRET` - Si vous utilisez Google OAuth
   - `GOOGLE_CALLBACK_URL` - URL de callback Google OAuth
   - `CINETPAY_API_KEY` - Clé API CinetPay
   - `CINETPAY_SITE_ID` - Site ID CinetPay
   - `BITNOB_API_KEY` - Clé API Bitnob

## ✅ Étape 2 : Redéployer l'Application

### Option A : Depuis le Dashboard Vercel

1. Allez dans l'onglet **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur le bouton **⋯** (trois points)
4. Sélectionnez **Redeploy**
5. Confirmez en cliquant sur **Redeploy**

### Option B : Depuis Git (Recommandé)

1. **Commitez les changements récents**
   ```bash
   git add .
   git commit -m "fix: Add database configuration and improve error handling"
   git push
   ```

2. Vercel détectera automatiquement le push et redéploiera

## ✅ Étape 3 : Vérifier le Déploiement

1. **Attendez la fin du déploiement**
   - Le statut devrait passer à "Ready" (vert)

2. **Testez l'endpoint de signup**
   - Ouvrez votre application
   - Essayez de créer un nouveau compte
   - L'erreur 500 devrait être résolue

3. **Vérifiez les logs si nécessaire**
   - Allez dans **Deployments** → Cliquez sur le déploiement
   - Cliquez sur **Functions** pour voir les logs des serverless functions

## 🔍 Vérification de la Base de Données

### Tables Créées Automatiquement

Lors du premier appel à la base de données, ces tables seront créées :

- ✅ `users` - Utilisateurs de l'application
- ✅ `user_cards` - Cartes virtuelles des utilisateurs
- ✅ `user_transactions` - Transactions
- ✅ `kyc_verifications` - Vérifications KYC

### Tester la Connexion Localement (Optionnel)

Si vous voulez tester localement avant de déployer :

```bash
cd backend
npm install
npm run dev
```

Puis testez avec curl ou Postman :

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "displayName": "Test User"
  }'
```

## 🎯 Résultat Attendu

Après configuration, vous devriez voir :

✅ **Succès (201)** :
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_1234567890_abc123",
      "email": "test@example.com",
      "displayName": "Test User",
      "photoURL": null
    }
  }
}
```

## ❌ Dépannage

### Si vous voyez encore l'erreur 500

1. **Vérifiez que les variables sont bien enregistrées**
   - Settings → Environment Variables
   - Les 3 variables de base de données doivent être présentes

2. **Vérifiez les logs Vercel**
   - Deployments → Votre déploiement → Functions
   - Cherchez les erreurs dans les logs

3. **Assurez-vous que le redéploiement a bien eu lieu**
   - Les variables ne sont appliquées qu'après un nouveau déploiement

### Si l'erreur persiste

Vérifiez que la connexion à la base de données fonctionne :
- La base de données Prisma est-elle active ?
- Les credentials sont-ils corrects ?
- Le SSL est-il requis ? (normalement oui avec `?sslmode=require`)

## 📝 Checklist Finale

- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Application redéployée
- [ ] Test de création de compte réussi
- [ ] Tables de base de données créées
- [ ] Logs Vercel vérifiés (pas d'erreurs)

## 🎉 Prochaines Étapes

Une fois la base de données configurée :

1. Testez toutes les fonctionnalités d'authentification
2. Configurez les autres services (CinetPay, Bitnob)
3. Testez les flux de paiement
4. Configurez Google OAuth si nécessaire

---

**Note de Sécurité :** Ne partagez jamais vos credentials de base de données publiquement. Le fichier `.env` est dans `.gitignore` pour éviter qu'il soit commité par erreur.
