# Publikacja Obsidian Themes na GitHub

Projekt jest gotowy do umieszczenia w **publicznym** repozytorium `uilystudio/obsidian-themes`.
Zawiera sześć motywów, sześć plików PNG, README, licencję MIT i skrypt pakujący do Marketplace.
Nie ma w nim plików `.env`, kluczy API ani danych logowania.

## Sposób A — najłatwiejszy, z GitHub CLI

1. Zainstaluj Git for Windows i GitHub CLI (`gh`).
2. W terminalu PowerShell zaloguj się poleceniem `gh auth login`.
3. Rozpakuj projekt, otwórz PowerShell w rozpakowanym folderze, uruchom:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-github.ps1
```

Skrypt zweryfikuje projekt, utworzy repozytorium publiczne (jeśli nie istnieje), doda wszystkie pliki, zrobi commit i wykona `git push`. Nie publikuje jeszcze w VS Code Marketplace.

## Sposób B — przez stronę GitHub

1. Otwórz https://github.com/new i wybierz właściciela `uilystudio`, nazwę `obsidian-themes`, widoczność **Public**, bez inicjalizowania README.
2. Utwórz repozytorium.
3. Prześlij pliki poprzez Git albo wróć do tej rozmowy z linkiem do repozytorium, aby można było dokończyć upload w połączonym GitHub.

## Marketplace — kiedy repo już jest publiczne

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-marketplace.ps1 -Repository 'uilystudio/obsidian-themes'
```

To sprawdzi publiczne PNG i utworzy `.vsix` z HTTPS w galerii. Wgrywa się go osobno do VS Code Marketplace.

Jeśli wydawca w Marketplace jest inny niż `uilystudio`, zmień `publisher` w `package.json` przed wydaniem.
