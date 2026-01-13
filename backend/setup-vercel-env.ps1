# Script PowerShell pour configurer les variables d'environnement Vercel
# Usage: .\setup-vercel-env.ps1

Write-Host "🔧 Configuration des Variables d'Environnement Vercel" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Vercel CLI est installé
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI n'est pas installé." -ForegroundColor Red
    Write-Host "Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Vercel CLI détecté" -ForegroundColor Green
Write-Host ""

# Variables Flutterwave
Write-Host "📝 Configuration Flutterwave" -ForegroundColor Yellow
$flwPublicKey = Read-Host "FLW_PUBLIC_KEY"
$flwSecretKey = Read-Host "FLW_SECRET_KEY" -AsSecureString
$flwEncryptionKey = Read-Host "FLW_ENCRYPTION_KEY" -AsSecureString
$flwWebhookHash = Read-Host "FLW_WEBHOOK_HASH (optionnel)"

# Variables Firebase
Write-Host ""
Write-Host "📝 Configuration Firebase" -ForegroundColor Yellow
$firebaseProjectId = Read-Host "FIREBASE_PROJECT_ID (défaut: paycongo)"
if ([string]::IsNullOrWhiteSpace($firebaseProjectId)) {
    $firebaseProjectId = "paycongo"
}

Write-Host "Collez votre FIREBASE_PRIVATE_KEY (appuyez sur Entrée après avoir collé):"
$firebasePrivateKey = Read-Host

$firebaseClientEmail = Read-Host "FIREBASE_CLIENT_EMAIL"

# Variables CORS
Write-Host ""
Write-Host "📝 Configuration CORS" -ForegroundColor Yellow
Write-Host "URLs autorisées (séparées par des virgules):"
Write-Host "Exemple: https://paycongo-frontend.vercel.app,https://paycongo.web.app"
$allowedOrigins = Read-Host "ALLOWED_ORIGINS"

# Convertir SecureString en texte clair
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($flwSecretKey)
$flwSecretKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($flwEncryptionKey)
$flwEncryptionKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Confirmation
Write-Host ""
Write-Host "📋 Récapitulatif:" -ForegroundColor Cyan
Write-Host "  FLW_PUBLIC_KEY: $flwPublicKey"
Write-Host "  FLW_SECRET_KEY: [MASQUÉ]"
Write-Host "  FLW_ENCRYPTION_KEY: [MASQUÉ]"
Write-Host "  FLW_WEBHOOK_HASH: $flwWebhookHash"
Write-Host "  FIREBASE_PROJECT_ID: $firebaseProjectId"
Write-Host "  FIREBASE_PRIVATE_KEY: [MASQUÉ]"
Write-Host "  FIREBASE_CLIENT_EMAIL: $firebaseClientEmail"
Write-Host "  ALLOWED_ORIGINS: $allowedOrigins"
Write-Host ""

$confirm = Read-Host "Voulez-vous continuer et ajouter ces variables à Vercel? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "❌ Annulé" -ForegroundColor Red
    exit 0
}

# Ajouter les variables à Vercel
Write-Host ""
Write-Host "🚀 Ajout des variables à Vercel..." -ForegroundColor Green

# Flutterwave
Write-Host "  → FLW_PUBLIC_KEY..." -ForegroundColor Yellow
echo $flwPublicKey | vercel env add FLW_PUBLIC_KEY production 2>&1 | Out-Null

Write-Host "  → FLW_SECRET_KEY..." -ForegroundColor Yellow
echo $flwSecretKeyPlain | vercel env add FLW_SECRET_KEY production 2>&1 | Out-Null

Write-Host "  → FLW_ENCRYPTION_KEY..." -ForegroundColor Yellow
echo $flwEncryptionKeyPlain | vercel env add FLW_ENCRYPTION_KEY production 2>&1 | Out-Null

if (-not [string]::IsNullOrWhiteSpace($flwWebhookHash)) {
    Write-Host "  → FLW_WEBHOOK_HASH..." -ForegroundColor Yellow
    echo $flwWebhookHash | vercel env add FLW_WEBHOOK_HASH production 2>&1 | Out-Null
}

# Firebase
Write-Host "  → FIREBASE_PROJECT_ID..." -ForegroundColor Yellow
echo $firebaseProjectId | vercel env add FIREBASE_PROJECT_ID production 2>&1 | Out-Null

Write-Host "  → FIREBASE_PRIVATE_KEY..." -ForegroundColor Yellow
echo $firebasePrivateKey | vercel env add FIREBASE_PRIVATE_KEY production 2>&1 | Out-Null

Write-Host "  → FIREBASE_CLIENT_EMAIL..." -ForegroundColor Yellow
echo $firebaseClientEmail | vercel env add FIREBASE_CLIENT_EMAIL production 2>&1 | Out-Null

# CORS
Write-Host "  → ALLOWED_ORIGINS..." -ForegroundColor Yellow
echo $allowedOrigins | vercel env add ALLOWED_ORIGINS production 2>&1 | Out-Null

Write-Host ""
Write-Host "✅ Variables d'environnement ajoutées avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Redeployez le backend: vercel --prod" -ForegroundColor White
Write-Host "  2. Testez l endpoint de sante" -ForegroundColor White
Write-Host ""
