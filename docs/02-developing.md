# Developing the extension

How a change to Folder Regex Color is made: the toolchain, the lint rules,
and where a change to the color slots has to land twice.

| Question                                 | Section                        |
| ---------------------------------------- | ------------------------------ |
| What do I run, and with what?            | The toolchain                  |
| What does the linter and compiler check? | Lint and type conventions      |
| Where does a new color slot go?          | Adding a color slot            |
| How is a change proven?                  | [03-testing.md](03-testing.md) |

The repository is a consumer of `@jterrazz/typescript`, on its `node`
profile: one devDependency carries the compiler, the rulebook, the
formatter and every pass of `typescript check`. What stays its own is the
webpack bundle VS Code loads, and the marketplace publishing.

## The toolchain

| Task                        | Command                          |
| --------------------------- | -------------------------------- |
| Install                     | `make install`                   |
| Build the production bundle | `make build` (`npm run build`)   |
| Compile and watch           | `npm run watch`                  |
| Check everything            | `make lint` (`typescript check`) |
| Repair what a fixer can     | `npm run lint:fix`               |
| Run the test suite          | `make test`                      |
| Package the `.vsix`         | `npm run vsix`                   |

Compiling runs `webpack` against `webpack.config.mjs`, which uses
`ts-loader` to read `src/**/*.ts` straight from TypeScript — there is no
separate `tsc` build step for the extension code itself. `tsconfig.json` is
one line, extending the toolchain's `node` preset; the only thing the
bundle overrides is `noEmit`, because the preset type-checks and webpack
needs the emit (`webpack.config.mjs`, the `ts-loader` options).

`vscode:prepublish` runs `build` before `vsce` reads `dist/` — see
[04-operating.md](04-operating.md).

## Lint and type conventions

The rulebook, the profile and every pass are the toolchain's; nothing is
decided here. The two directives in `src/extension.ts` carry their reason on
the line: the host's `EventEmitter` is not Node's, and firing `undefined`
is the host's way of saying every decoration. There is no
`oxlint.baseline.json`: the tree stands at zero.

## Adding a color slot

A `customN` slot is declared in two places that must move together:

1. `package.json`'s `contributes.colors` array — a new
   `folderRegexColor.customN` entry with `dark` and `light` defaults.
2. `colorMap` in `src/extension.ts` — a new `customN` key pointing at that
   same `folderRegexColor.customN` id.

Nothing mechanical checks the two stay in sync (see
[01-architecture.md](01-architecture.md)): a slot added to `package.json`
without a matching `colorMap` entry is never resolved to a theme color id at
decoration time, and the mismatch shows only when a user configures it.
