# Publishes the Obsidian Themes source (including six screenshots) as a PUBLIC GitHub repo.
# Requires Git and the official GitHub CLI (gh). First log in with: gh auth login
param([string]$Repository = "uilystudio/obsidian-themes")
$ErrorActionPreference = "Stop"
if ($Repository -notmatch '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$') {
    throw "Use OWNER/REPOSITORY, e.g. uilystudio/obsidian-themes"
}
foreach ($cmd in @('git', 'gh')) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "Missing $cmd. Install Git for Windows and GitHub CLI, then retry."
    }
}
& gh auth status
if ($LASTEXITCODE -ne 0) { throw "Log in first using: gh auth login" }
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $root
& python scripts/validate-themes.py
if ($LASTEXITCODE -ne 0) { throw "Validation failed. Aborting." }
if (-not (Test-Path .git)) {
    & git init -b main
    if ($LASTEXITCODE -ne 0) { throw "git init failed" }
}
& git add -A
if ($LASTEXITCODE -ne 0) { throw "git add failed" }
& git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    & git commit -m "Release Obsidian Themes 2.0.2 with screenshots"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed. Check user.name/user.email in git config." }
} elseif ($LASTEXITCODE -ne 0) { throw "git diff failed" }
& gh repo view $Repository --json nameWithOwner --jq '.nameWithOwner' 2>$null
$exists = ($LASTEXITCODE -eq 0)
if (-not $exists) {
    Write-Host "Creating public repository $Repository and pushing code..."
    & gh repo create $Repository --public --source . --remote origin --push --description "Six premium VS Code themes in one extension"
    if ($LASTEXITCODE -ne 0) { throw "Repository creation or push failed. Check GitHub permissions." }
} else {
    $remote = (& git remote get-url origin 2>$null)
    if ($LASTEXITCODE -eq 0 -and $remote -and ($remote -notmatch [regex]::Escape($Repository))) {
        throw "Existing origin points to a different repository: $remote"
    }
    if (-not $remote) { & git remote add origin "https://github.com/$Repository.git" }
    Write-Host "Repository exists; pushing main without force..."
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Push failed; inspect existing branch or permissions." }
}
Write-Host "Repository: https://github.com/$Repository"
Write-Host "Verify screenshots at https://github.com/$Repository/tree/main/assets/screenshots"
Write-Host "To package for Marketplace: powershell -ExecutionPolicy Bypass -File .\scripts\package-marketplace.ps1 -Repository '$Repository'"
