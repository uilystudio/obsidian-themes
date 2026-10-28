# Publishing screenshots in Visual Studio Marketplace

The six screenshot PNGs are included in `assets/screenshots/`, and `README.md` links to them using repository-relative paths.

**Important:** The Marketplace requires public HTTPS image URLs. Simply uploading the local `.vsix` does **not** guarantee the README images will display on the public Marketplace page. The images must be hosted publicly, typically in your GitHub repository, before publishing.

## Recommended workflow

1. Create a **public GitHub repository** for Obsidian Themes. Upload this entire source folder, including `README.md` and `assets/screenshots/`, to the `main` branch.
2. Edit `package.json` to include the real repository URL:

   ```json
   "repository": { "type": "git", "url": "https://github.com/<YOUR_USER>/<YOUR_REPO>.git" }
   ```

   Replace the placeholders with the **actual** owner and repository. Do not copy this placeholder unchanged.
3. Package with the official VS Code CLI in the source folder:

   ```bash
   npx @vscode/vsce package
   ```

   `vsce` will rewrite relative README images to public GitHub URLs when a valid public GitHub repository is declared. You can also provide `--baseImagesUrl` with the actual HTTPS image directory URL.
4. Inspect the generated VSIX and preview the README to confirm every image resolves over HTTPS; then upload that newly packaged VSIX through publisher management.
5. The six screenshot paths in the public repo must exactly match the paths in README.

**No repository has been created or published as part of this package.** The provided VSIX is suitable for local installation and contains all screenshot assets, but the public Marketplace links require the hosting step above.

See: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
