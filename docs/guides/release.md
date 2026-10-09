# Release

Folder Regex Color is published to the Visual Studio Marketplace by hand, from a developer's machine; the shared `validate` workflow of `jterrazz-actions` runs `make build`, `make lint`, `make test` and `make mutation` on every push and pull request — the mutation run measuring the lines the push or pull request changed — and publishes nothing.

## Packaging

`npm run vsix` runs `vsce package`. Before `vsce` reads the tree, npm's `vscode:prepublish` hook runs `npm run build`, so `dist/` is rebuilt from `src/`. `.vscodeignore` then leaves out everything but `dist/index.cjs`, `images/`, the README and the manifest — the ESM copy and the declarations the library build also writes into `dist/` stay out; `npx vsce ls` lists what the archive would hold.

## Publishing

`npm run publish` runs `vsce publish`, which reads its own Marketplace credential; nothing in this repository declares or stores it. The manifest is `"private": true`: the extension is a Marketplace package, never an npm one, so a bare `npm publish` is refused instead of running this `publish` script.

## The Marketplace listing

The fields `vsce` and the Marketplace read are declared once, in `package.json`: `publisher` (`Jterrazz`), `displayName`, `description`, `icon` (`images/logo.png`), `categories`, and `engines.vscode` (`^1.78.0`), the oldest VS Code the listing installs on. `version` is bumped by hand before each `npm run vsix` or `npm run publish`; there is no automated release.
