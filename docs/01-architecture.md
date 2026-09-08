# The architecture of the extension

Folder Regex Color is one file: a `vscode.FileDecorationProvider` that
colors and symbol-tags a workspace path when it matches a user-configured
regex, bundled by webpack into the single entry point VS Code loads.

| Question                            | Section                    |
| ------------------------------------ | -------------------------- |
| What does the extension provide?     | The decoration provider    |
| What can a user configure?           | The contribution points    |
| What ships, and how does it load?    | The build                  |

## The decoration provider

`activate()` registers one `ColorDecorationProvider` with
`vscode.window.registerFileDecorationProvider`
(`src/extension.ts:121-126`). The provider holds a `folders` list — regex,
color, optional symbol, optional tooltip — rebuilt from the
`folder-regex-color.folders` setting on activation and on every
configuration change (`src/extension.ts:47-81`).

`provideFileDecoration` walks that list for each URI VS Code asks about: it
strips the workspace root off the URI's path, normalizes backslashes to
forward slashes, and tests the regex against what remains
(`src/extension.ts:84-118`). The first match wins; a folder with no
`color` set is auto-assigned the next slot `colorMap` has not already been
given explicitly (`src/extension.ts:56-71`).

`colorMap` (`src/extension.ts:4-31`) is the one place a color NAME resolves
to a VS Code theme color id: six fixed terminal colors
(`blue`, `magenta`, `red`, `cyan`, `green`, `yellow`) and twenty
`customN` slots, each pointing at `folderRegexColor.customN`.

## The contribution points

`package.json`'s `contributes` block declares two things VS Code reads at
load time:

- `configuration` — the `folder-regex-color.folders` array setting, an
  object per folder with `regex`, `color`, `symbol` and `tooltip` string
  properties (`package.json`, `contributes.configuration`).
- `colors` — twenty theme colors, `folderRegexColor.custom1` through
  `custom20`, each with a `dark` and a `light` default hex
  (`package.json`, `contributes.colors`). This list and `colorMap`'s
  `customN` entries are two owners of the same twenty slots: adding a slot
  means editing both in the same change (see
  [02-developing.md](02-developing.md)).

## The build

`webpack.config.js` bundles `src/extension.ts` into `dist/extension.js`,
targeting `node` and `commonjs2` — the shape a VS Code extension host
loads. `vscode` is left as an `externals` entry because the host injects it
at runtime rather than shipping it in the bundle
(`webpack.config.js:11-24`). `package.json`'s `main` field points at that
same `dist/extension.js`, so nothing under `src/` or `out/` is ever loaded
by VS Code directly.
