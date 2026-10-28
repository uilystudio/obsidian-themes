# Obsidian Themes — public Marketplace publishing helper
# Example: powershell -ExecutionPolicy Bypass -File .\scripts\package-marketplace.ps1 -Repository "uilystudio/obsidian-themes"
# Run inside the extension source folder after uploading assets/screenshots/*.png to a public GitHub repository.
param(
    [Parameter(Mandatory=$true)]
    [string]$Repository,
    [string]$Branch = "main"
)
$ErrorActionPreference = "Stop"
if ($Repository -notmatch '^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$') {
    throw "Repository must use OWNER/REPOSITORY format, e.g. uilystudio/obsidian-themes"
}
if ($Branch -notmatch '^[a-zA-Z0-9_./-]+$' -or $Branch.Contains('..')) {
    throw "Invalid branch name."
}
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $root
$images = @('cream.png','cherry-velvet.png','forest.png','graphite.png','moonstone.png','pearl.png')
$imageBase = "https://raw.githubusercontent.com/$Repository/$Branch/"
$contentBase = "https://github.com/$Repository/blob/$Branch/"
Write-Host "Checking public image URLs..."
foreach ($name in $images) {
    $url = "${imageBase}assets/screenshots/$name"
    try {
        $result = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 4 -TimeoutSec 20
        if ([int]$result.StatusCode -ne 200) { throw "HTTP $($result.StatusCode)" }
        Write-Host "  OK $name"
    } catch {
        throw "Image not publicly accessible: $url`nUpload all 6 PNGs to the $Branch branch and retry."
    }
}
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    throw 'npx is required. Install Node.js and npm first.'
}
$pkgPath = Join-Path $root 'package.json'
$manifest = Get-Content -LiteralPath $pkgPath -Raw -Encoding utf8 | ConvertFrom-Json
$manifest | Add-Member -NotePropertyName repository -NotePropertyValue @{type='git'; url="https://github.com/$Repository.git"} -Force
$manifest | ConvertTo-Json -Depth 50 | Set-Content -LiteralPath $pkgPath -Encoding utf8
$outFile = Join-Path $root 'obsidian-themes-2.0.2.vsix'
Write-Host "Packaging Marketplace-ready VSIX..."
& npx --yes @vscode/vsce package --no-dependencies --baseImagesUrl $imageBase --baseContentUrl $contentBase -o $outFile
if ($LASTEXITCODE -ne 0) { throw "vsce failed with exit code $LASTEXITCODE" }
Write-Host "VSIX created: $outFile"
Write-Host "The README in this package now uses public HTTPS image URLs."
