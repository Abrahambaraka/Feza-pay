# Script PowerShell pour configurer les variables d'environnement Vercel
# Usage: .\setup-vercel-env-simple.ps1

Write-Host "Configuration des Variables d'Environnement Vercel" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que Vercel CLI est installe
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI n'est pas installe." -ForegroundColor Red
    Write-Host "Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "Vercel CLI detecte" -ForegroundColor Green
Write-Host ""

# Variables Flutterwave
Write-Host "Configuration Flutterwave" -ForegroundColor Yellow
$flwPublicKey = Read-Host "FLW_PUBLIC_KEY"
$flwSecretKey = Read-Host "FLW_SECRET_KEY"
$flwEncryptionKey = Read-Host "FLW_ENCRYPTION_KEY"
$flwWebhookHash = Read-Host "FLW_WEBHOOK_HASH (optionnel)"

# Variables Firebase
Write-Host ""
Write-Host "Configuration Firebase" -ForegroundColor Yellow
$firebaseProjectId = Read-Host "FIREBASE_PROJECT_ID (defaut: paycongo)"
if ([string]::IsNullOrWhiteSpace($firebaseProjectId)) {
    $firebaseProjectId = "paycongo"
}

Write-Host "Collez votre FIREBASE_PRIVATE_KEY (appuyez sur Entree apres avoir colle):"
$firebasePrivateKey = Read-Host

$firebaseClientEmail = Read-Host "FIREBASE_CLIENT_EMAIL"

# Variables CORS
Write-Host ""
Write-Host "Configuration CORS" -ForegroundColor Yellow
Write-Host "URLs autorisees (separees par des virgules):"
Write-Host "Exemple: https://paycongo-frontend.vercel.app,https://paycongo.web.app"
$allowedOrigins = Read-Host "ALLOWED_ORIGINS"

# Confirmation
Write-Host ""
Write-Host "Recapitulatif:" -ForegroundColor Cyan
Write-Host "  FLW_PUBLIC_KEY: $flwPublicKey"
Write-Host "  FLW_SECRET_KEY: [MASQUE]"
Write-Host "  FLW_ENCRYPTION_KEY: [MASQUE]"
Write-Host "  FLW_WEBHOOK_HASH: $flwWebhookHash"
Write-Host "  FIREBASE_PROJECT_ID: $firebaseProjectId"
Write-Host "  FIREBASE_PRIVATE_KEY: [MASQUE]"
Write-Host "  FIREBASE_CLIENT_EMAIL: $firebaseClientEmail"
Write-Host "  ALLOWED_ORIGINS: $allowedOrigins"
Write-Host ""

$confirm = Read-Host "Voulez-vous continuer et ajouter ces variables a Vercel? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "Anule" -ForegroundColor Red
    exit 0
}

# Ajouter les variables a Vercel
Write-Host ""
Write-Host "Ajout des variables a Vercel..." -ForegroundColor Green

# Flutterwave
Write-Host "  -> FLW_PUBLIC_KEY..." -ForegroundColor Yellow
echo $flwPublicKey | vercel env add FLW_PUBLIC_KEY production

Write-Host "  -> FLW_SECRET_KEY..." -ForegroundColor Yellow
echo $flwSecretKey | vercel env add FLW_SECRET_KEY production

Write-Host "  -> FLW_ENCRYPTION_KEY..." -ForegroundColor Yellow
echo $flwEncryptionKey | vercel env add FLW_ENCRYPTION_KEY production

if (-not [string]::IsNullOrWhiteSpace($flwWebhookHash)) {
    Write-Host "  -> FLW_WEBHOOK_HASH..." -ForegroundColor Yellow
    echo $flwWebhookHash | vercel env add FLW_WEBHOOK_HASH production
}

# Firebase
Write-Host "  -> FIREBASE_PROJECT_ID..." -ForegroundColor Yellow
echo $firebaseProjectId | vercel env add FIREBASE_PROJECT_ID production

Write-Host "  -> FIREBASE_PRIVATE_KEY..." -ForegroundColor Yellow
echo $firebasePrivateKey | vercel env add FIREBASE_PRIVATE_KEY production

Write-Host "  -> FIREBASE_CLIENT_EMAIL..." -ForegroundColor Yellow
echo $firebaseClientEmail | vercel env add FIREBASE_CLIENT_EMAIL production

# CORS
Write-Host "  -> ALLOWED_ORIGINS..." -ForegroundColor Yellow
echo $allowedOrigins | vercel env add ALLOWED_ORIGINS production

Write-Host ""
Write-Host "Variables d'environnement ajoutees avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Redeployez le backend: vercel --prod" -ForegroundColor White
Write-Host "  2. Testez l endpoint de sante" -ForegroundColor White
Write-Host ""
