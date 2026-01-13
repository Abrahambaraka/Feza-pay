# Script pour ajouter automatiquement les cles de TEST a Vercel Preview
# Usage: .\add-test-keys-preview.ps1

Write-Host "Ajout des cles de TEST a Vercel Preview" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que Vercel CLI est installe
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI n'est pas installe." -ForegroundColor Red
    exit 1
}

# Lire le fichier .env
$envFile = ".\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Fichier .env non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "Lecture du fichier .env..." -ForegroundColor Green
$envContent = Get-Content $envFile

# Extraire les variables
$variables = @{}
foreach ($line in $envContent) {
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $value = $value -replace '^"(.*)"$', '$1'
        if (-not [string]::IsNullOrWhiteSpace($key) -and -not [string]::IsNullOrWhiteSpace($value)) {
            $variables[$key] = $value
        }
    }
}

Write-Host "Ajout des variables a Vercel Preview..." -ForegroundColor Green
Write-Host ""

# Variables Flutterwave (TEST)
if ($variables.ContainsKey("FLW_PUBLIC_KEY")) {
    Write-Host "  -> FLW_PUBLIC_KEY..." -ForegroundColor Yellow
    echo $variables["FLW_PUBLIC_KEY"] | vercel env add FLW_PUBLIC_KEY preview
}

if ($variables.ContainsKey("FLW_SECRET_KEY")) {
    Write-Host "  -> FLW_SECRET_KEY..." -ForegroundColor Yellow
    echo $variables["FLW_SECRET_KEY"] | vercel env add FLW_SECRET_KEY preview
}

if ($variables.ContainsKey("FLW_ENCRYPTION_KEY")) {
    Write-Host "  -> FLW_ENCRYPTION_KEY..." -ForegroundColor Yellow
    echo $variables["FLW_ENCRYPTION_KEY"] | vercel env add FLW_ENCRYPTION_KEY preview
}

if ($variables.ContainsKey("FLW_WEBHOOK_HASH") -and -not [string]::IsNullOrWhiteSpace($variables["FLW_WEBHOOK_HASH"])) {
    Write-Host "  -> FLW_WEBHOOK_HASH..." -ForegroundColor Yellow
    echo $variables["FLW_WEBHOOK_HASH"] | vercel env add FLW_WEBHOOK_HASH preview
}

# Variables Firebase
if ($variables.ContainsKey("FIREBASE_PROJECT_ID")) {
    Write-Host "  -> FIREBASE_PROJECT_ID..." -ForegroundColor Yellow
    echo $variables["FIREBASE_PROJECT_ID"] | vercel env add FIREBASE_PROJECT_ID preview
}

if ($variables.ContainsKey("FIREBASE_PRIVATE_KEY") -and -not [string]::IsNullOrWhiteSpace($variables["FIREBASE_PRIVATE_KEY"])) {
    Write-Host "  -> FIREBASE_PRIVATE_KEY..." -ForegroundColor Yellow
    echo $variables["FIREBASE_PRIVATE_KEY"] | vercel env add FIREBASE_PRIVATE_KEY preview
}

if ($variables.ContainsKey("FIREBASE_CLIENT_EMAIL") -and -not [string]::IsNullOrWhiteSpace($variables["FIREBASE_CLIENT_EMAIL"])) {
    Write-Host "  -> FIREBASE_CLIENT_EMAIL..." -ForegroundColor Yellow
    echo $variables["FIREBASE_CLIENT_EMAIL"] | vercel env add FIREBASE_CLIENT_EMAIL preview
}

# CORS - Mettre a jour avec les URLs Vercel
$corsValue = "https://paycongo-frontend.vercel.app,https://paycongo-frontend-ay3ps7q1s-abraham-barakas-projects.vercel.app,https://paycongo.web.app"
if ($variables.ContainsKey("ALLOWED_ORIGINS")) {
    $corsValue = $variables["ALLOWED_ORIGINS"] + "," + $corsValue
}
Write-Host "  -> ALLOWED_ORIGINS..." -ForegroundColor Yellow
echo $corsValue | vercel env add ALLOWED_ORIGINS preview

# Variables optionnelles
if ($variables.ContainsKey("NODE_ENV")) {
    Write-Host "  -> NODE_ENV..." -ForegroundColor Yellow
    echo $variables["NODE_ENV"] | vercel env add NODE_ENV preview
}

if ($variables.ContainsKey("LOG_LEVEL")) {
    Write-Host "  -> LOG_LEVEL..." -ForegroundColor Yellow
    echo $variables["LOG_LEVEL"] | vercel env add LOG_LEVEL preview
}

Write-Host ""
Write-Host "Variables ajoutees avec succes a Vercel Preview!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Les cles Flutterwave sont des cles de TEST (commencent par TEST)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Creez un deploiement preview: vercel" -ForegroundColor White
Write-Host "  2. Ou testez localement: vercel dev" -ForegroundColor White
Write-Host "  3. Verifiez les variables: vercel env ls" -ForegroundColor White
Write-Host ""
