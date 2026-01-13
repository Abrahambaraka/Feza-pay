# Script pour ajouter les cles de TEST depuis .env vers Vercel Preview
# Usage: .\add-test-keys-to-vercel.ps1

Write-Host "Ajout des cles de TEST a Vercel Preview" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que Vercel CLI est installe
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI n'est pas installe." -ForegroundColor Red
    Write-Host "Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
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
    # Ignorer les commentaires et lignes vides
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Enlever les guillemets
        $value = $value -replace '^"(.*)"$', '$1'
        if (-not [string]::IsNullOrWhiteSpace($key) -and -not [string]::IsNullOrWhiteSpace($value)) {
            $variables[$key] = $value
        }
    }
}

Write-Host ""
Write-Host "Variables trouvees dans .env:" -ForegroundColor Yellow
foreach ($key in $variables.Keys) {
    if ($key -like "*SECRET*" -or $key -like "*PRIVATE*" -or $key -like "*KEY*") {
        $masked = $variables[$key].Substring(0, [Math]::Min(10, $variables[$key].Length)) + "..."
        Write-Host "  $key = $masked" -ForegroundColor Gray
    } else {
        Write-Host "  $key = $($variables[$key])" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Selectionnez l'environnement Vercel:" -ForegroundColor Cyan
Write-Host "  1. Preview (recommandé pour les tests)" -ForegroundColor Green
Write-Host "  2. Development" -ForegroundColor White
Write-Host "  3. Preview ET Development" -ForegroundColor White
Write-Host "  4. Production (ATTENTION: cles de test en production!)" -ForegroundColor Red

$envChoice = Read-Host "Votre choix (1-4)"

$environments = @()
switch ($envChoice) {
    "1" { $environments = @("preview") }
    "2" { $environments = @("development") }
    "3" { $environments = @("preview", "development") }
    "4" { 
        $environments = @("production")
        Write-Host ""
        Write-Host "ATTENTION: Vous allez ajouter des cles de TEST en PRODUCTION!" -ForegroundColor Red
        Write-Host "Les cles commencent par FLWPUBK_TEST et FLWSECK_TEST" -ForegroundColor Yellow
        $confirm = Read-Host "Etes-vous absolument sur? (O/N)"
        if ($confirm -ne "O" -and $confirm -ne "o") {
            Write-Host "Anule" -ForegroundColor Yellow
            exit 0
        }
    }
    default {
        Write-Host "Choix invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Ajout des variables a Vercel pour: $($environments -join ', ')" -ForegroundColor Green
Write-Host ""

# Variables importantes a ajouter
$importantVars = @(
    "FLW_PUBLIC_KEY",
    "FLW_SECRET_KEY", 
    "FLW_ENCRYPTION_KEY",
    "FLW_WEBHOOK_HASH",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "ALLOWED_ORIGINS"
)

foreach ($env in $environments) {
    Write-Host "--- Environnement: $env ---" -ForegroundColor Cyan
    
    foreach ($varName in $importantVars) {
        if ($variables.ContainsKey($varName)) {
            $value = $variables[$varName]
            if (-not [string]::IsNullOrWhiteSpace($value)) {
                Write-Host "  -> $varName..." -ForegroundColor Yellow
                echo $value | vercel env add $varName $env
            } else {
                Write-Host "  -> $varName (vide, ignore)" -ForegroundColor Gray
            }
        } else {
            Write-Host "  -> $varName (non trouve dans .env)" -ForegroundColor Gray
        }
    }
    
    # Ajouter aussi les autres variables optionnelles
    foreach ($key in $variables.Keys) {
        if ($importantVars -notcontains $key) {
            $value = $variables[$key]
            Write-Host "  -> $key..." -ForegroundColor Yellow
            echo $value | vercel env add $key $env
        }
    }
}

Write-Host ""
Write-Host "Variables ajoutees avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Les variables sont maintenant disponibles pour l'environnement $($environments -join '/')" -ForegroundColor White
Write-Host "  2. Pour tester avec Preview: vercel (cree un deploiement preview)" -ForegroundColor White
Write-Host "  3. Pour tester avec Development: vercel dev" -ForegroundColor White
Write-Host "  4. Pour voir les variables: vercel env ls" -ForegroundColor White
Write-Host ""
