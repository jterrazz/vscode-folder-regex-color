# Develop

How a change to Folder Regex Color is made: the declaration, the gestures, the build, and the one change that lands in two places.

## The declaration

The repository is a consumer of `@jterrazz/typescript` and `@jterrazz/test`, and `jterrazz.config.ts` says what it is: a `library` on `node` — a module its host imports through the manifest's `main` — with `"private": true`, since it is published to the Visual Studio Marketplace and never to npm, so the Publish pass leaves it. It declares one root beside the spine, `images/`, the Marketplace icon and the README's screenshot the `.vsix` ships. `oxlint.config.ts`, `oxfmt.config.ts`, `tsconfig.json` and `vitest.config.ts` are derived from it by `typescript fix`; none is edited by hand.

## The gestures

| Task                           | Command        |
| ------------------------------ | -------------- |
| Install                        | `make install` |
| Build `dist/`                  | `make build`   |
| Check everything but the tests | `make lint`    |
| Repair what a fixer can        | `make fix`     |
| Run the specs                  | `make test`    |
| The whole gate, mutation last  | `make check`   |

`make test` and `make mutation` build first: the specs load `dist/index.cjs`, the file VS Code loads.

## The build

`npm run build` is `typescript build`, which reads `main` (`./dist/index.cjs`) and compiles `src/index.ts` into it, with an ESM copy and declarations beside it. `vscode` is not installed — `@types/vscode` types it — so the build reports it unresolved and leaves it external, which is what the host needs. The exported `activate` takes a context typed by the one member it reads, not the host's `ExtensionContext`: the declarations step cannot name a type of the ambient `vscode` module.

To try a change in a real editor, open the repository in VS Code and run the `Run Extension` launch configuration, which builds first and opens an Extension Development Host window.

## Adding a color slot

A `customN` slot is declared in two places that move together:

1. `package.json`'s `contributes.colors` — a `folderRegexColor.customN` entry with `dark` and `light` defaults.
2. `CUSTOM_SLOTS` in `src/index.ts`, the number of slots.

The README's table of defaults lists them for users. The `named-colors` scenario of the colors spec names one slot past the last; move it with the count, and the spec then fails on any slot the manifest does not contribute.
