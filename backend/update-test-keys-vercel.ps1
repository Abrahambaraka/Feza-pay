# Script pour METTRE A JOUR les variables avec les cles de TEST
# Supprime et re-ajoute les variables avec les nouvelles valeurs de test

Write-Host "Mise a jour des variables avec les cles de TEST" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

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

Write-Host ""
Write-Host "Selectionnez l'environnement a mettre a jour:" -ForegroundColor Cyan
Write-Host "  1. Preview (recommandé pour les tests)" -ForegroundColor Green
Write-Host "  2. Development" -ForegroundColor White
Write-Host "  3. Production (ATTENTION!)" -ForegroundColor Red

$envChoice = Read-Host "Votre choix (1-3)"

$environment = ""
switch ($envChoice) {
    "1" { $environment = "preview" }
    "2" { $environment = "development" }
    "3" { 
        $environment = "production"
        Write-Host ""
        Write-Host "ATTENTION: Mise a jour de PRODUCTION avec des cles de TEST!" -ForegroundColor Red
        $confirm = Read-Host "Etes-vous sur? (O/N)"
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
Write-Host "Mise a jour des variables pour l'environnement: $environment" -ForegroundColor Green
Write-Host ""

# Liste des variables a mettre a jour
$varsToUpdate = @(
    @{Key="FLW_PUBLIC_KEY"; Required=$true},
    @{Key="FLW_SECRET_KEY"; Required=$true},
    @{Key="FLW_ENCRYPTION_KEY"; Required=$true},
    @{Key="FLW_WEBHOOK_HASH"; Required=$false},
    @{Key="FIREBASE_PROJECT_ID"; Required=$true},
    @{Key="FIREBASE_PRIVATE_KEY"; Required=$false},
    @{Key="FIREBASE_CLIENT_EMAIL"; Required=$false},
    @{Key="ALLOWED_ORIGINS"; Required=$true}
)

foreach ($var in $varsToUpdate) {
    $key = $var.Key
    $required = $var.Required
    
    if ($variables.ContainsKey($key)) {
        $value = $variables[$key]
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            Write-Host "  -> Mise a jour $key..." -ForegroundColor Yellow
            # Supprimer l'ancienne valeur pour cet environnement
            vercel env rm $key $environment --yes 2>&1 | Out-Null
            # Ajouter la nouvelle valeur
            $value | vercel env add $key $environment
        } elseif ($required) {
            Write-Host "  -> $key est vide mais requis!" -ForegroundColor Red
        }
    } elseif ($required) {
        Write-Host "  -> $key non trouve dans .env!" -ForegroundColor Red
    }
}

# Mettre a jour ALLOWED_ORIGINS avec les URLs Vercel
$corsValue = "https://paycongo-frontend.vercel.app,https://paycongo-frontend-ay3ps7q1s-abraham-barakas-projects.vercel.app,https://paycongo.web.app"
if ($variables.ContainsKey("ALLOWED_ORIGINS")) {
    $corsValue = $variables["ALLOWED_ORIGINS"] + "," + $corsValue
}
Write-Host "  -> Mise a jour ALLOWED_ORIGINS avec URLs Vercel..." -ForegroundColor Yellow
vercel env rm ALLOWED_ORIGINS $environment --yes 2>&1 | Out-Null
$corsValue | vercel env add ALLOWED_ORIGINS $environment

Write-Host ""
Write-Host "Variables mises a jour avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Les cles Flutterwave sont des cles de TEST" -ForegroundColor Yellow
Write-Host "      (FLWPUBK_TEST-... et FLWSECK_TEST-...)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Redeplyez: vercel --$environment" -ForegroundColor White
Write-Host "  2. Testez l'endpoint: curl https://fezapay-abraham-barakas-projects.vercel.app/health" -ForegroundColor White
Write-Host ""
