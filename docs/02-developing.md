# Developing the extension

How a change to Folder Regex Color is made: the toolchain, the lint rules,
and where a change to the color slots has to land twice.

| Question                                | Section                    |
| ---------------------------------------- | -------------------------- |
| What do I run, and with what?            | The toolchain               |
| What does the linter and compiler check? | Lint and type conventions   |
| Where does a new color slot go?          | Adding a color slot         |
| How is a change proven?                  | [03-testing.md](03-testing.md) |

This repository does not use the `@jterrazz` toolchain: it is a standalone
VS Code extension with its own webpack, ESLint and TypeScript config,
published to the marketplace by hand rather than through the estate's CLI
or CI.

## The toolchain

| Task                      | Command                |
| -------------------------- | ----------------------- |
| Compile once                | `yarn compile`           |
| Compile and watch           | `yarn watch`             |
| Lint                        | `yarn lint`               |
| Run the test suite          | `yarn test`               |
| Build the production bundle | `yarn package`            |
| Package the `.vsix`         | `yarn vsix`                |

Compiling runs `webpack` against `webpack.config.js`, which uses `ts-loader`
to read `src/**/*.ts` straight from TypeScript — there is no separate
`tsc` build step for the extension code itself. `tsconfig.json` answers for the
editor's own typechecking and for nothing else; `strict` is on
(`tsconfig.json:9`).

One lifecycle hook matters more than the script names suggest:
`vscode:prepublish` runs `package` (the production webpack build) before
`vsce` reads `dist/` — see [04-operating.md](04-operating.md). It is
hardcoded to `yarn run` even though the repository also carries a
`package-lock.json` (`package.json`, `scripts["vscode:prepublish"]`):
running that lifecycle through `npm` still shells out to `yarn`.

## Lint and type conventions

`.eslintrc.json` runs `@typescript-eslint` against `src` with four rules at
`warn` — `naming-convention`, `semi`, `curly`, `eqeqeq` — plus
`no-throw-literal`, and ignores `out`, `dist` and `*.d.ts`
(`.eslintrc.json:9-20`). Nothing is set to `error`: `yarn lint` reports a
style drift, it does not fail the process by itself.

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
