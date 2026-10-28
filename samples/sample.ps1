param([string]$Theme = "Obsidian Cream")
function Show-Theme { param([string]$Name) Write-Output "Theme: $Name" }
if ($Theme.Length -gt 0) { Show-Theme -Name $Theme }
