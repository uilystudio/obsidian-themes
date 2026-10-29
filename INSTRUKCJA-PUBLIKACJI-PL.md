# Obsidian Themes 2.0.4 — publikacja aktualizacji

To **aktualizacja** istniejącego rozszerzenia `uilystudio.obsidian-cream` (nie twórz nowej pozycji w Marketplace).

## 1. Aktualizacja GitHub

W repozytorium `https://github.com/uilystudio/obsidian-themes` uaktualnij zawartość z tego folderu. Możesz wykonać to przez Git albo GitHub Upload files (przy zastępowaniu istniejących plików GitHub może wymagać commita). Najważniejsze zmiany: `package.json`, `assets/icon.png`, `README.md`, `CHANGELOG.md`, `scripts/validate-themes.py`, `.github/workflows/build-vsix.yml`.

> Jeśli używasz GitHub w przeglądarce, przesyłaj **zawartość rozpakowanego folderu**, a nie sam ZIP. Zachowaj dokładne ścieżki plików.

## 2. Zbuduj plik VSIX OFICJALNYM narzędziem

Najprościej uruchom `BUILD-MARKETPLACE.cmd` na Windows. Wymagany Node.js i internet.
W terminalu alternatywnie:

```powershell
npx.cmd --yes @vscode/vsce package --no-dependencies -o obsidian-themes-2.0.4.vsix
```

Albo po wrzuceniu kodu na GitHub: **Actions → Build VSIX → Run workflow**. Pobierz artifact, rozpakuj ZIP z Actions, w środku jest `.vsix`.

## 3. Aktualizuj Marketplace

Marketplace → Uily Studio → przy Obsidian Themes menu `...` → Update → wskaż **wyłącznie `obsidian-themes-2.0.4.vsix`**.

## Kontrola

* Wersja: 2.0.4.
* Publisher: `uilystudio`.
* Extension name (ID): `obsidian-cream` (zachowany).
* Icon: `assets/icon.png` (256 × 256 PNG, <1MB).
* 6 motywów i 6 screenshotów.
* Jeśli Marketplace jeszcze weryfikuje 2.0.3, poczekaj na zakończenie weryfikacji przed ponowną aktualizacją.

Nie wgrywaj całego ZIP-a do Marketplace — wyłącznie VSIX.
