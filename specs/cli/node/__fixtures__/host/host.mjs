// outside: plays VS Code for the extension at $EXTENSION_ROOT — loads its manifest's `main`, activates it, and prints
// the decoration it gives each path of the scenario named on the command line, then again after each change it makes.
import { readFileSync } from 'node:fs';
import { createRequire, registerHooks } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const double = new URL('./vscode.cjs', import.meta.url).href;
registerHooks({
    resolve: (specifier, context, next) =>
        specifier === 'vscode' ? { shortCircuit: true, url: double } : next(specifier, context),
});

const require = createRequire(import.meta.url);
const vscode = require('./vscode.cjs');
const scenario = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const root = process.env.EXTENSION_ROOT;
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

vscode.state.settings = scenario.settings ?? {};
vscode.state.workspaceFolders = scenario.workspaceFolders?.map((path) => ({ uri: { path } }));

const extension = createRequire(pathToFileURL(join(root, 'package.json')))(join(root, manifest.main));
const context = { subscriptions: [] };
extension.activate(context);
console.log(`activated: ${context.subscriptions.length} subscription(s), ${vscode.state.providers.length} provider(s)`);

const [provider] = vscode.state.providers;
const fired = [];
provider.onDidChangeFileDecorations((change) => fired.push(change));

function printDecorations() {
    for (const path of scenario.paths) {
        const decoration = provider.provideFileDecoration({ path });
        if (decoration === null || decoration === undefined) {
            console.log(`${path}  none`);
            continue;
        }
        const parts = [`color=${decoration.color.id}`];
        if (decoration.badge !== undefined) parts.push(`badge=${decoration.badge}`);
        if (decoration.tooltip !== undefined) parts.push(`tooltip=${decoration.tooltip}`);
        console.log(`${path}  ${parts.join(' ')}`);
    }
}

printDecorations();
for (const change of scenario.changes ?? []) {
    Object.assign(vscode.state.settings, change.settings);
    const affected = change.affects;
    for (const listener of vscode.state.changeListeners) {
        listener({
            affectsConfiguration: (section) =>
                affected.some((name) => name === section || name.startsWith(`${section}.`)),
        });
    }
    console.log(`changed ${affected.join(', ')}: ${fired.length} refresh(es)${fired.length > 0 ? ` of ${fired.map((change) => change === undefined ? 'every decoration' : 'some').join(', ')}` : ''}`);
    fired.length = 0;
    printDecorations();
}
