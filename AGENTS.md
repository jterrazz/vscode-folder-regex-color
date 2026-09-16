# Agent brief — Folder Regex Color

A VS Code extension that colors and symbol-tags folders by regex. This file
**routes**; it does not restate what the corpus already says.

## Where knowledge lives (route here first)

The corpus is `docs/` + `README.md`, mapped by
[docs/README.md](docs/README.md). Do not duplicate it — link to it.

| Working on…                                       | Read                      |
| --------------------------------------------------- | ------------------------- |
| The provider, the contribution points, the bundle   | `docs/01-architecture.md` |
| The toolchain, lint rules, adding a color slot      | `docs/02-developing.md`   |
| What proves a change, and what nothing proves yet    | `docs/03-testing.md`      |
| Packaging the `.vsix` and publishing it by hand     | `docs/04-operating.md`    |

## Setup

```bash
yarn install
```

## Commands

| Task                         | Command       |
| ----------------------------- | ------------- |
| Compile once                  | `yarn compile` |
| Lint                           | `yarn lint`     |
| Run the test suite             | `yarn test`     |
| Package the `.vsix`            | `yarn vsix`     |
| Publish to the Marketplace     | `yarn publish`  |

`CLAUDE.md` at the root is a symlink to this file: one brief, two names, no
second copy.
