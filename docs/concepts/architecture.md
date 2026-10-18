# Architecture

Folder Regex Color is one module, `src/index.ts`: a `FileDecorationProvider` that VS Code asks about every path it draws (in the Explorer, the tabs, search) and that answers with a color, a badge and a tooltip when the path matches a folder the user configured.

## What VS Code loads

`package.json`'s `main` names `dist/index.cjs`, the CommonJS build of `src/index.ts`: the extension host loads an extension with `require`. `typescript build` compiles it from the manifest, beside an ESM copy and the declarations a library build always emits ([Develop](../guides/develop.md#the-build)). The `vscode` module is not in the bundle: the host hands it to the extension at load time, so the build leaves `require("vscode")` as it is.

`activationEvents` is `onStartupFinished`: the host calls `activate` once the window is up, and the extension registers one provider, held in the context's subscriptions so the host disposes of it with the extension.

## The decoration provider

The provider reads the `folder-regex-color.folders` setting into a list of folders (a regex, a color, an optional symbol and tooltip) when it is created, and again each time VS Code reports that setting changed; it then tells VS Code every decoration is stale (`onDidChangeFileDecorations` fired with `undefined`). A change of any other setting reads nothing.

For each path VS Code asks about, the provider strips the path of a workspace folder's own path, turns backslashes into slashes, and tests each folder's regex against what remains, with the `u` flag. The first folder whose regex matches, from any workspace folder, decorates the path; none matching, or no workspace folder open, leaves it undecorated. A path outside every workspace folder is tested whole.

## How a folder gets its color

A color is a name: one of six terminal colors (`blue`, `magenta`, `red`, `cyan`, `green`, `yellow`), each standing for a `terminal.ansi*` theme color, or a slot `customN`, one for each theme color `folderRegexColor.customN` that `package.json` contributes (twenty today, `custom1` to `custom20`) with its dark and light defaults. Any other name is handed to the theme as it is, so a theme color id such as `charts.red` works too.

A folder with no color takes a slot by its position in the list: the slot at that position among those no folder names. A named folder uses up a position as well, so a free slot can be skipped; past the last free slot a folder takes the slot at its position among all twenty-six, and past the twenty-sixth the count starts again.

## The contribution points

`package.json`'s `contributes` declares what VS Code reads before the extension runs: the `folder-regex-color.folders` setting (an array of objects with `regex`, `color`, `symbol` and `tooltip`) and the twenty `folderRegexColor.customN` theme colors. The module imports the manifest and makes a slot of each contributed color, `folderRegexColor.customN` named `customN`, so the build carries the list and the manifest is its one owner.
