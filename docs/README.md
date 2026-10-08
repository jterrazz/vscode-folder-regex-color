# Folder Regex Color — the manual

A VS Code extension that colors and symbol-tags the paths of a workspace whose path matches a regex. What it does for a user, and its settings, are the repository's README; this page lists every page of the manual, by what the reader came to do.

## Guides

| Page                         | Answers                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| [Develop](guides/develop.md) | Changing the extension: the declaration, the gestures, the build, adding a color slot  |
| [Test](guides/test.md)       | Proving a change: the specs that load the built extension into a host double, mutation |
| [Release](guides/release.md) | Packaging the `.vsix` and publishing it to the Marketplace by hand                     |

## Concepts

| Page                                     | Answers                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| [Architecture](concepts/architecture.md) | The decoration provider, how a folder gets its color, what VS Code loads |

## Decisions

The records of decisions this repository alone took are in [`decisions/`](decisions/), numbered in the order they were taken, the mold `_template.md` beside them.
