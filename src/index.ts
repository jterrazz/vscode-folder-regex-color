import { EventEmitter, FileDecoration, ThemeColor, window, workspace } from 'vscode';
import type { Event, FileDecorationProvider, ProviderResult, Uri } from 'vscode';

const colorMap: Record<string, string> = {
    blue: 'terminal.ansiBlue',
    magenta: 'terminal.ansiBrightMagenta',
    red: 'terminal.ansiBrightRed',
    cyan: 'terminal.ansiBrightCyan',
    green: 'terminal.ansiBrightGreen',
    yellow: 'terminal.ansiBrightYellow',
    custom1: 'folderRegexColor.custom1',
    custom2: 'folderRegexColor.custom2',
    custom3: 'folderRegexColor.custom3',
    custom4: 'folderRegexColor.custom4',
    custom5: 'folderRegexColor.custom5',
    custom6: 'folderRegexColor.custom6',
    custom7: 'folderRegexColor.custom7',
    custom8: 'folderRegexColor.custom8',
    custom9: 'folderRegexColor.custom9',
    custom10: 'folderRegexColor.custom10',
    custom11: 'folderRegexColor.custom11',
    custom12: 'folderRegexColor.custom12',
    custom13: 'folderRegexColor.custom13',
    custom14: 'folderRegexColor.custom14',
    custom15: 'folderRegexColor.custom15',
    custom16: 'folderRegexColor.custom16',
    custom17: 'folderRegexColor.custom17',
    custom18: 'folderRegexColor.custom18',
    custom19: 'folderRegexColor.custom19',
    custom20: 'folderRegexColor.custom20',
};

const slots = Object.keys(colorMap);

type FolderSetting = {
    regex: string;
    color?: string;
    symbol?: string;
    tooltip?: string;
};

type FolderRule = FolderSetting & { color: string };

type DecorationChange = undefined | Uri | Uri[];

class ColorDecorationProvider implements FileDecorationProvider {
    private readonly decorationsChanged = new EventEmitter<DecorationChange>();

    readonly onDidChangeFileDecorations: Event<DecorationChange> = this.decorationsChanged.event;

    private folders: FolderRule[] = [];

    constructor() {
        workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('folder-regex-color.folders')) {
                this.constructFolders();
                // oxlint-disable-next-line unicorn/no-useless-undefined -- the emitter's parameter is mandatory, and undefined means every decoration
                this.decorationsChanged.fire(undefined);
            }
        });
        this.constructFolders();
    }

    constructFolders(): void {
        const settings = workspace
            .getConfiguration('folder-regex-color')
            .get<FolderSetting[]>('folders', []);
        const free = slots.filter((slot) => !settings.some((folder) => folder.color === slot));
        let next = 0;
        this.folders = settings.map((folder) => {
            if (next >= slots.length) {
                next = 0;
            }
            const color = folder.color ?? free[next] ?? slots[next] ?? slots[0] ?? '';
            next += 1;
            const rule: FolderRule = { color, regex: folder.regex };
            if (folder.symbol !== undefined) {
                rule.symbol = folder.symbol;
            }
            if (folder.tooltip !== undefined) {
                rule.tooltip = folder.tooltip;
            }
            return rule;
        });
    }

    provideFileDecoration(uri: Uri): ProviderResult<FileDecoration> {
        const roots = workspace.workspaceFolders?.map((folder) => folder.uri.path) ?? [];
        const match = this.folders.find((folder) =>
            roots.some((root) => {
                const relative = uri.path.replace(root, '').replaceAll('\\', '/');
                return new RegExp(folder.regex, 'u').test(relative);
            }),
        );
        if (match === undefined) {
            return null;
        }
        return new FileDecoration(
            match.symbol,
            match.tooltip,
            new ThemeColor(colorMap[match.color] ?? match.color),
        );
    }
}

// hazard: the published declarations cannot name a type of the ambient `vscode` module — the build's dts step fails on @types/vscode — so the host's ExtensionContext is met by the one member read.
export function activate(context: { subscriptions: { dispose: () => unknown }[] }): void {
    context.subscriptions.push(
        window.registerFileDecorationProvider(new ColorDecorationProvider()),
    );
}
