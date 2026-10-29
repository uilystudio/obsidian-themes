@echo off
setlocal
cd /d "%~dp0"
echo.
echo [Obsidian Themes 2.0.4] Checking Node.js and npm...
where node >nul 2>nul || (echo ERROR: Install Node.js LTS from nodejs.org & pause & exit /b 1)
where npx.cmd >nul 2>nul || (echo ERROR: npx is not available & pause & exit /b 1)
echo.
echo Building VSIX with official @vscode/vsce...
call npx.cmd --yes @vscode/vsce package --no-dependencies -o "obsidian-themes-2.0.4.vsix"
if errorlevel 1 (
  echo.
  echo ERROR: Packaging failed. Read the error above.
  pause
  exit /b 1
)
echo.
echo SUCCESS: obsidian-themes-2.0.4.vsix
pause
