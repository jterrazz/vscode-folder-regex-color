import { EventEmitter, FileDecoration, ThemeColor, window, workspace } from 'vscode';
import type { Event, FileDecorationProvider, ProviderResult, Uri } from 'vscode';

const SECTION = 'folder-regex-color';

// invariant: as many slots as package.json's contributes.colors declares, folderRegexColor.custom1 to customN.
const CUSTOM_SLOTS = 20;

const THEME_COLORS: Record<string, string> = {
    blue: 'terminal.ansiBlue',
    magenta: 'terminal.ansiBrightMagenta',
    red: 'terminal.ansiBrightRed',
    cyan: 'terminal.ansiBrightCyan',
    green: 'terminal.ansiBrightGreen',
    yellow: 'terminal.ansiBrightYellow',
    ...Object.fromEntries(
        Array.from({ length: CUSTOM_SLOTS }, (_, index) => [
            `custom${index + 1}`,
            `folderRegexColor.custom${index + 1}`,
        ]),
    ),
};

const SLOTS = Object.keys(THEME_COLORS);

type FolderSetting = {
    regex: string;
    color?: string;
    symbol?: string;
    tooltip?: string;
};

type FolderRule = FolderSetting & { color: string };

type DecorationChange = undefined | Uri | Uri[];

function configuredFolders(): FolderRule[] {
    const settings = workspace.getConfiguration(SECTION).get<FolderSetting[]>('folders', []);
    const free = SLOTS.filter((slot) => !settings.some((folder) => folder.color === slot));

    return settings.map((folder, index) => {
        const slot = index % SLOTS.length;
        // Stryker disable next-line StringLiteral: dead guard of noUncheckedIndexedAccess, slot is always an index of SLOTS
        return { ...folder, color: folder.color ?? free[slot] ?? SLOTS[slot] ?? '' };
    });
}

class ColorDecorationProvider implements FileDecorationProvider {
    private readonly decorationsChanged = new EventEmitter<DecorationChange>();

    readonly onDidChangeFileDecorations: Event<DecorationChange> = this.decorationsChanged.event;

    private folders = configuredFolders();

    constructor() {
        workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(`${SECTION}.folders`)) {
                this.folders = configuredFolders();
                // oxlint-disable-next-line unicorn/no-useless-undefined -- the emitter's parameter is mandatory, and undefined means every decoration
                this.decorationsChanged.fire(undefined);
            }
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
            new ThemeColor(THEME_COLORS[match.color] ?? match.color),
        );
    }
}

// hazard: the published declarations cannot name a type of the ambient `vscode` module — the build's dts step fails on @types/vscode — so the host's ExtensionContext is met by the one member read.
export function activate(context: { subscriptions: { dispose: () => unknown }[] }): void {
    context.subscriptions.push(
        window.registerFileDecorationProvider(new ColorDecorationProvider()),
    );
}
