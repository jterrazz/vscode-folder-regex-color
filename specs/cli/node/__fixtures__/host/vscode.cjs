// outside: the `vscode` module the extension host hands an extension, reduced to what Folder Regex Color reads.
const state = {
    changeListeners: [],
    providers: [],
    settings: {},
    workspaceFolders: undefined,
};

class EventEmitter {
    #listeners = [];
    fired = [];
    event = (listener) => {
        this.#listeners.push(listener);
        return { dispose() {} };
    };
    fire(data) {
        this.fired.push(data);
        for (const listener of this.#listeners) listener(data);
    }
}

class ThemeColor {
    constructor(id) {
        this.id = id;
    }
}

class FileDecoration {
    constructor(badge, tooltip, color) {
        this.badge = badge;
        this.tooltip = tooltip;
        this.color = color;
    }
}

const workspace = {
    get workspaceFolders() {
        return state.workspaceFolders;
    },
    getConfiguration(section) {
        return {
            get(key, defaultValue) {
                const name = `${section}.${key}`;
                return name in state.settings ? state.settings[name] : defaultValue;
            },
        };
    },
    onDidChangeConfiguration(listener) {
        state.changeListeners.push(listener);
        return { dispose() {} };
    },
};

const window = {
    registerFileDecorationProvider(provider) {
        state.providers.push(provider);
        return { dispose() {}, provider };
    },
};

module.exports = { EventEmitter, FileDecoration, ThemeColor, window, workspace, state };
