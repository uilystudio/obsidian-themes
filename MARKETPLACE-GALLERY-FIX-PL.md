# Naprawa niedziałających obrazów galerii

W pakiecie 2.0.1 pliki `assets/screenshots/*.png` były obecne, ale README zawierało ścieżki względne. Marketplace/VS Code nie rozwiązuje ich automatycznie dla ręcznie spakowanego VSIX. Zgodnie z dokumentacją VS Code, obrazy w README na Marketplace wymagają publicznych adresów HTTPS.

## Co trzeba zrobić

1. Utwórz **publiczne** repozytorium GitHub (np. `uilystudio/obsidian-themes`).
2. Prześlij zawartość tej paczki do gałęzi `main`, zachowując folder `assets/screenshots/`. Nie wrzucaj samych plików `.vsix`.
3. W PowerShell przejdź do folderu projektu i uruchom:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\package-marketplace.ps1 -Repository "uilystudio/obsidian-themes"
   ```

   Jeżeli użyjesz innej nazwy repozytorium, podaj ją zamiast `uilystudio/obsidian-themes`.

4. Skrypt sprawdzi publiczne adresy sześciu plików PNG, doda właściwe `repository` do manifestu, użyje **oficjalnego `@vscode/vsce`** do przepakowania README i utworzy `obsidian-themes-2.0.2.vsix`.
5. Opublikuj **nowy VSIX** w Visual Studio Marketplace. Wersja 2.0.2 umożliwia aktualizację wcześniejszej.

## Dlaczego nie da się zrobić wszystkiego offline?

Publiczny repozytorium lub hosting obrazów musi już istnieć. Nie wolno podstawiać fikcyjnych linków HTTPS. Lokalny podgląd wszystkich obrazów jest dostępny osobno w pliku `Obsidian-Themes-gallery-preview.html`, który nie wymaga żadnego hostingu.

Dokumentacja: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
