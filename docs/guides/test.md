# Test

What proves a change to Folder Regex Color: the specs under `specs/cli/node/`, which run the built extension in a double of the VS Code host, and the mutation run over them.

## The specs

Each spec runs `node host.mjs <scenario>.json` in a fresh directory through `@jterrazz/test`'s cli runner (`specs/cli/cli.specification.ts`). `specs/cli/node/__fixtures__/host/` is the host double: `vscode.cjs` is the `vscode` module reduced to what the extension reads — the configuration, the workspace folders, the event emitter, the decoration and theme color classes —, and `host.mjs` resolves `vscode` to it, reads the manifest at `EXTENSION_ROOT` (the checkout), `require`s its `main` as the extension host does, calls `activate`, and prints the decoration of each path the scenario lists, then again after each settings change it reports. A color id of the `folderRegexColor.` family the manifest does not contribute prints `(not contributed)`.

The scenarios, in `specs/cli/node/__fixtures__/scenarios/`, hold the workspace folders, the settings and the paths; each test compares the whole output, written in place.

| Spec                  | Proves                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `decorations.spec.ts` | the match: root stripping, slashes, the Unicode flag, first match wins, nothing to match |
| `colors.spec.ts`      | every color name and slot, a name handed through, how a folder with no color gets a slot |
| `settings.spec.ts`    | which configuration change rereads the list and refreshes every decoration               |

The specs load `dist/`, so a change to `src/` is seen only once built: `make test` builds first; a direct `npx vitest` after an edit runs the last build.

## Mutation

`make mutation` (the last step of `make check`) runs `typescript mutation`: Stryker instruments `src/index.ts` in a sandbox, builds it, and runs the specs, each spawned `node` reporting the mutants it ran. It measures the change not yet committed, or the last commit on a clean tree.

## What no spec proves

The real editor: the host double is written from the API the extension reads, so a change in how VS Code itself calls the provider is caught only in an Extension Development Host window (`Run Extension`, [Develop](develop.md#the-build)).
