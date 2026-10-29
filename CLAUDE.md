# Agent brief: Folder Regex Color

A VS Code extension that colors and symbol-tags folders by regex. This file **routes**; it does not restate what the manual says.

## Where knowledge lives

The manual is `docs/`, mapped by [docs/README.md](docs/README.md); the user-facing description and settings are the root `README.md`.

| Working on                                        | Read                                                           |
| ------------------------------------------------- | -------------------------------------------------------------- |
| The provider, how a folder gets its color, `main` | [docs/concepts/architecture.md](docs/concepts/architecture.md) |
| The declaration, the gestures, the build, a slot  | [docs/guides/develop.md](docs/guides/develop.md)               |
| What proves a change: the host double, mutation   | [docs/guides/test.md](docs/guides/test.md)                     |
| Packaging the `.vsix` and publishing it           | [docs/guides/release.md](docs/guides/release.md)               |

## Setup

```bash
make install
```

## Commands

| Task                       | Command           |
| -------------------------- | ----------------- |
| Build `dist/`              | `make build`      |
| Check everything           | `make check`      |
| Repair what a fixer can    | `make fix`        |
| Run the specs              | `make test`       |
| Package the `.vsix`        | `npm run vsix`    |
| Publish to the Marketplace | `npm run publish` |
