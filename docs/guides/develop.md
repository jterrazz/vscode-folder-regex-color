# Develop

How a change to Folder Regex Color is made: the declaration, the gestures, the build, and adding a color slot.

## The declaration

The repository is a consumer of `@jterrazz/typescript` and `@jterrazz/test`, and `studio.config.ts` says what it is: a `library` on `node` (a module its host imports through the manifest's `main`) with `"private": true`, since it is published to the Visual Studio Marketplace and never to npm, so the Publish pass leaves it. It declares one root beside the spine, `images/`, the Marketplace icon and the README's screenshot the `.vsix` ships. `oxlint.config.ts`, `oxfmt.config.ts`, `tsconfig.json` and `vitest.config.ts` are derived from it by `typescript fix`; none is edited by hand.

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

`npm run build` is `typescript build`, which reads `main` (`./dist/index.cjs`) and compiles `src/index.ts` into it, with an ESM copy and declarations beside it. `vscode` is not installed (`@types/vscode` types it), so the build reports it unresolved and leaves it external, which is what the host needs. The exported `activate` takes a context typed by the one member it reads, not the host's `ExtensionContext`: the declarations step cannot name a type of the ambient `vscode` module.

The manifest's `"type": "module"` is not decoration: without it the build names its CommonJS output `index.js` instead of the `index.cjs` that `main` names, and the derived `vitest.config.ts`, whose top-level `await` only an ES module may hold, fails to load. That VS Code loads the `.cjs` `main` of such a package is proven by no spec (the host double loads it with Node's `require`), so a `Run Extension` before each release confirms it.

To try a change in a real editor, open the repository in VS Code and run the `Run Extension` launch configuration, which builds once and opens an Extension Development Host window. There is no watch build yet: `typescript build` takes no `--watch`, and `typescript dev` runs an application, not a library. So each change is seen by building again (the default build task, `npm run build`) and reloading that window.

## Adding a color slot

A `customN` slot is a `folderRegexColor.customN` entry in `package.json`'s `contributes.colors`, with `dark` and `light` defaults: the module imports the manifest at build time and makes a slot of each contributed color, so nothing in `src/` moves. The README's table of defaults lists them for users, and the `named-colors` scenario of the colors spec names one slot past the last; both move with the manifest.
