# Operating the extension

The shared `validate` workflow of `jterrazz-actions` runs `make build`,
`make lint` and `make test` on every push and pull request; packaging and
publishing to the Visual Studio Marketplace are run by hand, from a
developer's machine.

| Question                           | Section                 |
| ---------------------------------- | ----------------------- |
| How is the `.vsix` built?          | Packaging               |
| How does it reach the Marketplace? | Publishing              |
| What does a user install?          | The Marketplace listing |

## Packaging

`npm run vsix` runs `vsce package` (`package.json`, `scripts.vsix`). Before
`vsce` reads the tree, npm's `vscode:prepublish` lifecycle hook fires and
runs the production webpack build — `webpack --mode production
--devtool hidden-source-map` — rebuilding `dist/extension.js`
(`package.json`, `scripts["vscode:prepublish"]` and `scripts.build`).
`.vscodeignore` then excludes `src/`, `node_modules/`, config files and
`out/` from the archive, so the `.vsix` ships only `dist/`, `images/` and
the manifest (`.vscodeignore`).

## Publishing

`npm run publish` runs `vsce publish` (`package.json`, `scripts.publish`).
`vsce` reads its own Marketplace publish credential; nothing in this
repository declares or stores it. The manifest is `"private": true`: the
extension is a Marketplace package, never an npm one, so a bare
`npm publish` is refused instead of running this `publish` script as a
lifecycle step of its own.

## The Marketplace listing

The manifest fields `vsce` and the Marketplace read are declared once, in
`package.json`: `publisher` (`Jterrazz`), `displayName`, `description`,
`icon` (`/images/logo.png`), `categories` (`Other`), and the compatibility
floor `engines.vscode` (`^1.78.0`) below which the listing refuses to
install. `version` is bumped by hand before each `npm run vsix` /
`npm run publish` pass — there is no automated release or version bump.
