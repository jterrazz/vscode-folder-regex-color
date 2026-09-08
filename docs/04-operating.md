# Operating the extension

There is no CI in this repository (no `.github/` workflow): packaging and
publishing to the Visual Studio Marketplace are both run by hand, from a
developer's machine.

| Question                         | Section              |
| ---------------------------------- | --------------------- |
| How is the `.vsix` built?          | Packaging             |
| How does it reach the Marketplace? | Publishing            |
| What does a user install?          | The Marketplace listing |

## Packaging

`yarn vsix` runs `vsce package` (`package.json`, `scripts.vsix`). Before
`vsce` reads the tree, npm's `vscode:prepublish` lifecycle hook fires and
runs the production webpack build — `webpack --mode production
--devtool hidden-source-map` — rebuilding `dist/extension.js`
(`package.json`, `scripts["vscode:prepublish"]` and `scripts.package`).
`.vscodeignore` then excludes `src/`, `node_modules/`, config files and
`out/` from the archive, so the `.vsix` ships only `dist/`, `images/` and
the manifest (`.vscodeignore`).

## Publishing

`yarn publish` runs `vsce publish` (`package.json`, `scripts.publish`).
`vsce` reads its own Marketplace publish credential; nothing in this
repository declares or stores it. Running `npm publish` directly instead of
`npm run publish` (or `yarn publish`) is a real hazard on this manifest:
npm treats `publish` as a package.json lifecycle script it runs as PART of
its own `npm publish` command, and because `package.json` carries no
`"private": true`, a bare `npm publish` would both invoke this `publish`
script AND attempt to publish `folder-regex-color` to the npm registry —
the extension is a Marketplace package, not an npm one.

## The Marketplace listing

The manifest fields `vsce` and the Marketplace read are declared once, in
`package.json`: `publisher` (`Jterrazz`), `displayName`, `description`,
`icon` (`/images/logo.png`), `categories` (`Other`), and the compatibility
floor `engines.vscode` (`^1.78.0`) below which the listing refuses to
install. `version` is bumped by hand before each `yarn vsix` / `yarn
publish` pass — there is no automated release or version bump.
