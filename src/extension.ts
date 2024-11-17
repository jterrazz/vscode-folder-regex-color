import * as vscode from "vscode";
import * as path from "path";

const colorMap: Record<string, string> = {
  blue: "terminal.ansiBlue",
  magenta: "terminal.ansiBrightMagenta",
  red: "terminal.ansiBrightRed",
  cyan: "terminal.ansiBrightCyan",
  green: "terminal.ansiBrightGreen",
  yellow: "terminal.ansiBrightYellow",
  custom1: "folderRegexColor.custom1",
  custom2: "folderRegexColor.custom2",
  custom3: "folderRegexColor.custom3",
  custom4: "folderRegexColor.custom4",
  custom5: "folderRegexColor.custom5",
  custom6: "folderRegexColor.custom6",
};

class ColorDecorationProvider implements vscode.FileDecorationProvider {
  private readonly _onDidChangeFileDecorations: vscode.EventEmitter<
    vscode.Uri | vscode.Uri[] | undefined
  > = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
  public readonly onDidChangeFileDecorations: vscode.Event<
    vscode.Uri | vscode.Uri[] | undefined
  > = this._onDidChangeFileDecorations.event;
  private folders: {
    regex: string;
    color: string;
    symbol?: string;
    tooltip?: string;
  }[] = [];

  constructFolders() {
    this.folders = [];
    const config = vscode.workspace.getConfiguration("folder-regex-color");
    const folders: {
      regex: string;
      color?: string;
      symbol?: string;
      tooltip?: string;
    }[] = config.get("folders") || [];
    const colors = Object.keys(colorMap).filter(
      (color) => !folders.find((folder) => folder.color === color)
    );
    let i = 0;
    for (const folder of folders) {
      if (!Object.keys(colorMap)[i]) {
        i = 0;
      }
      this.folders.push({
        regex: folder.regex,
        color: folder.color || colors[i] || Object.keys(colorMap)[i],
        symbol: folder.symbol,
        tooltip: folder.tooltip,
      });
      i++;
    }
  }

  constructor() {
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("folder-regex-color.folders")) {
        this.constructFolders();
        this._onDidChangeFileDecorations.fire(undefined);
      }
    });
    this.constructFolders();
  }

  provideFileDecoration(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.FileDecoration> {
    if (vscode.workspace.workspaceFolders) {
      const workspacePaths = vscode.workspace.workspaceFolders.map(
        (folder) => folder.uri.path
      );

      let i = 0;
      for (const folder of this.folders) {
        let colorId = colorMap[folder.color];

        const pathIsInConfig = workspacePaths.find((root) => {
          const normalizedUriPath = uri.path
            .replace(root, "")
            .replace(/\\/g, "/");
          const folderRegexp = new RegExp(folder.regex);

          return folderRegexp.test(normalizedUriPath);
        });

        if (pathIsInConfig) {
          return new vscode.FileDecoration(
            folder.symbol,
            folder.tooltip,
            new vscode.ThemeColor(colorId)
          );
        }
        i++;
      }
    }

    return undefined;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new ColorDecorationProvider();
  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(provider)
  );
}
