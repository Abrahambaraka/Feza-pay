# Script rapide pour mettre a jour Preview avec les cles de TEST
# Usage: .\quick-update-preview.ps1

Write-Host "Mise a jour Preview avec cles de TEST" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Lire .env
$envFile = ".\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Fichier .env non trouve" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envFile
$vars = @{}
foreach ($line in $envContent) {
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim() -replace '^"(.*)"$', '$1'
        if ($key -and $value) { $vars[$key] = $value }
    }
}

Write-Host "Mise a jour des variables pour Preview..." -ForegroundColor Green
Write-Host ""

# Mettre a jour chaque variable
$varsToUpdate = @("FLW_PUBLIC_KEY", "FLW_SECRET_KEY", "FLW_ENCRYPTION_KEY", "FIREBASE_PROJECT_ID", "ALLOWED_ORIGINS")

foreach ($key in $varsToUpdate) {
    if ($vars.ContainsKey($key)) {
        $value = $vars[$key]
        Write-Host "  -> $key..." -ForegroundColor Yellow
        
        # Supprimer pour Preview uniquement
        vercel env rm $key preview --yes 2>&1 | Out-Null
        
        # Ajouter avec la bonne syntaxe
        $tempFile = [System.IO.Path]::GetTempFileName()
        $value | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
        Get-Content $tempFile | vercel env add $key preview
        Remove-Item $tempFile
    }
}

# Mettre a jour ALLOWED_ORIGINS avec URLs Vercel
$cors = "https://paycongo-frontend.vercel.app,https://paycongo-frontend-ay3ps7q1s-abraham-barakas-projects.vercel.app,https://paycongo.web.app"
if ($vars.ContainsKey("ALLOWED_ORIGINS")) {
    $cors = $vars["ALLOWED_ORIGINS"] + "," + $cors
}
Write-Host "  -> ALLOWED_ORIGINS (avec URLs Vercel)..." -ForegroundColor Yellow
vercel env rm ALLOWED_ORIGINS preview --yes 2>&1 | Out-Null
$tempFile = [System.IO.Path]::GetTempFileName()
$cors | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
Get-Content $tempFile | vercel env add ALLOWED_ORIGINS preview
Remove-Item $tempFile

Write-Host ""
Write-Host "Variables mises a jour pour Preview!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour tester, creez un deploiement preview:" -ForegroundColor Cyan
Write-Host "  vercel" -ForegroundColor White
Write-Host ""
