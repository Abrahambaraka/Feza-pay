# Script pour ajouter les variables d'environnement de TEST depuis .env vers Vercel
# Usage: .\add-test-env-to-vercel.ps1

Write-Host "Ajout des variables de TEST a Vercel (Preview/Development)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
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
    Write-Host "Fichier .env non trouve dans le repertoire actuel" -ForegroundColor Red
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
        if (-not [string]::IsNullOrWhiteSpace($key)) {
            $variables[$key] = $value
        }
    }
}

Write-Host "Variables trouvees:" -ForegroundColor Yellow
foreach ($key in $variables.Keys) {
    if ($key -like "*SECRET*" -or $key -like "*PRIVATE*" -or $key -like "*KEY*") {
        Write-Host "  $key = [MASQUE]" -ForegroundColor Gray
    } else {
        Write-Host "  $key = $($variables[$key])" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Selectionnez l'environnement Vercel:" -ForegroundColor Cyan
Write-Host "  1. Preview (recommandé pour les tests)" -ForegroundColor White
Write-Host "  2. Development" -ForegroundColor White
Write-Host "  3. Production (non recommandé pour les clés de test)" -ForegroundColor Yellow
Write-Host "  4. Preview ET Development" -ForegroundColor White

$envChoice = Read-Host "Votre choix (1-4)"

$environments = @()
switch ($envChoice) {
    "1" { $environments = @("preview") }
    "2" { $environments = @("development") }
    "3" { 
        $environments = @("production")
        Write-Host "ATTENTION: Vous ajoutez des cles de TEST en PRODUCTION!" -ForegroundColor Red
        $confirm = Read-Host "Etes-vous sur? (O/N)"
        if ($confirm -ne "O" -and $confirm -ne "o") {
            Write-Host "Anule" -ForegroundColor Yellow
            exit 0
        }
    }
    "4" { $environments = @("preview", "development") }
    default {
        Write-Host "Choix invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Ajout des variables a Vercel pour: $($environments -join ', ')" -ForegroundColor Green
Write-Host ""

foreach ($env in $environments) {
    Write-Host "--- Environnement: $env ---" -ForegroundColor Cyan
    
    foreach ($key in $variables.Keys) {
        $value = $variables[$key]
        Write-Host "  -> $key..." -ForegroundColor Yellow
        echo $value | vercel env add $key $env
    }
}

Write-Host ""
Write-Host "Variables ajoutees avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Les variables sont maintenant disponibles pour les deploiements Preview/Development" -ForegroundColor White
Write-Host "  2. Pour tester, creez un nouveau deploiement preview: vercel" -ForegroundColor White
Write-Host "  3. Ou testez avec: vercel --preview" -ForegroundColor White
Write-Host ""
