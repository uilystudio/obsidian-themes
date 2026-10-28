# Obsidian Themes 2.0.0 — Instrukcja

Jedno rozszerzenie = **6 motywów**: Cream, Cherry Velvet, Forest, Graphite, Moonstone i Pearl (jasny).

## Instalacja

1. Pobierz `obsidian-themes-2.0.0.vsix`.
2. W VS Code naciśnij `Ctrl+Shift+X` → `...` → **Install from VSIX...**.
3. Wskaż pobraną paczkę. Poprzedniej wersji nie musisz odinstalowywać.
4. Wybierz motyw: `Ctrl+K`, potem `Ctrl+T`.
5. Jeśli nie widzisz nowych kolorów: `Ctrl+Shift+P` → **Developer: Reload Window**.

## Języki i technologie

- **Web:** JavaScript, TypeScript, JSX/TSX, React, HTML, CSS, SCSS, Less, JSON/JSONC/JSON5, XML, Vue i Svelte.
- **Backend i systemowe:** Python, Rust, Go, Java, Kotlin, C, C++, C#, PHP, Ruby, Swift, Dart, Elixir.
- **Bazy i API:** SQL, GraphQL, Prisma.
- **Skrypty i konfiguracja:** Lua/Luau (Roblox), Bash/Zsh, PowerShell, YAML, TOML, Dockerfile, Terraform/HCL.
- **Pozostałe:** Julia, R, Markdown.

Kolorowanie jest zbudowane z reguł TextMate i tokenów semantycznych. **Nie jest to instalator obsługi języków**. Dla Luau, Rust, Kotlin, Vue, Svelte, Prisma, Terraform i innych możesz potrzebować rozszerzenia językowego. Rzeczywiste zakresy tokenów zależą od zainstalowanego parsera i serwera językowego, więc nie każda kategoria otrzyma osobny kolor w każdym pliku.

## Diagnostyka

`Ctrl+Shift+P` → `Developer: Inspect Editor Tokens and Scopes`; sprawdź `TextMate scopes`, `semantic token` i `foreground`. Własne dekoracje innych rozszerzeń (np. Import Cost) mogą używać niezależnych kolorów.

## Ustawienia

Motyw nie zmienia `settings.json`: zostają Git Bash, Prettier, Geist Mono, Material Icon Theme i wszystkie pozostałe ustawienia. Nie dodaje CSS ani nie modyfikuje plików VS Code.

## Kod źródłowy

Dodatkowe przykłady składni: folder `samples/`. Test walidacji: `python scripts/validate-themes.py`.
