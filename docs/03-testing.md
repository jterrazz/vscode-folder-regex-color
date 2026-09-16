# Testing the extension

Nothing mechanical proves `ColorDecorationProvider` today: the repository
carries a test runner and no spec.

| Question                               | Section                     |
| --------------------------------------- | ---------------------------- |
| What does `make test` run?              | The runner                   |
| What is not proven, and what would prove it | What a first spec owes    |

## The runner

`npm test` runs `vitest --run --passWithNoTests`
(`package.json`, `scripts.test`), and the shared CI runs it through
`make test` — see [04-operating.md](04-operating.md). With no spec in the
tree the run is green by the flag, not by evidence: it exists so the gate
is wired before the first spec, not to claim anything about the extension.

The suite that used to sit under `src/test/` is gone. It was the
`yo code` scaffold — `@vscode/test-electron` downloading a real VS Code,
launching it with this extension loaded, and running one Mocha spec that
asserted a fact about `Array.prototype.indexOf`. It exercised no line of
`src/extension.ts`, and a headless CI cannot launch the editor it needs, so
it cost a download and a second test framework to prove nothing.

## What a first spec owes

`ColorDecorationProvider` holds three behaviours that a spec can reach, and
none of them needs a running editor once the `vscode` module is stubbed
([01-architecture.md](01-architecture.md)):

- `constructFolders` assigns a color to a folder that declares none — the
  next slot no other folder claimed, wrapping when the slots run out.
- `provideFileDecoration` strips the workspace root off the URI path,
  normalizes backslashes, and returns the FIRST folder whose regex matches.
- A `folder-regex-color.folders` change rebuilds the list and fires
  `onDidChangeFileDecorations`.

Until one of those is written, a behavior change to `src/extension.ts` is
verified by hand, in a real VS Code window launched by the `Run Extension`
configuration (`.vscode/launch.json`).
