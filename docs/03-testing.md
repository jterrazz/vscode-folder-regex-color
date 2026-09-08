# Testing the extension

What `yarn test` runs today, and what it does — and does not — prove about
`ColorDecorationProvider`.

| Question                          | Section                        |
| ----------------------------------- | ------------------------------- |
| What does `yarn test` run?          | The compiled Mocha suite         |
| What does it actually prove?        | What the suite proves today      |

## The compiled Mocha suite

`yarn test` runs `node ./out/test/runTest.js`
(`package.json`, `scripts.test`), and the `pretest` lifecycle hook compiles
the test sources and the extension, and lints, first
(`package.json`, `scripts.pretest`) — see
[02-developing.md](02-developing.md).

`src/test/runTest.ts` calls `@vscode/test-electron`'s `runTests`, which
downloads a real VS Code build, launches it with this extension loaded from
the repository root, and points it at the compiled entry
`out/test/suite/index.js` (`src/test/runTest.ts:9-16`). That entry
(`src/test/suite/index.ts`) is a Mocha `tdd` runner that globs every
`**/**.test.js` under `out/test` and runs them inside that VS Code
instance (`src/test/suite/index.ts:5-38`).

## What the suite proves today

The only spec compiled into that glob is `src/test/suite/extension.test.ts`,
and it asserts an unrelated fact about `Array.prototype.indexOf`
(`src/test/suite/extension.test.ts:11-14`) — it never imports or exercises
`ColorDecorationProvider`. Today nothing mechanical proves that a regex
match assigns the right color or symbol, that the auto-assignment order in
`constructFolders` is correct, or that a configuration change re-renders
decorations. A behavior change to `src/extension.ts` is verified by hand,
in a real VS Code window, until a spec is written against the provider
itself.
