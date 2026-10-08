import { directory, file } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('decorations', () => {
    test('a folder whose regex matches takes its color, its symbol as the badge and its tooltip, and so does every path below it the regex still matches', async () => {
        // Given - a workspace with a frontend folder decorated in full and a common package colored only
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/symbol-and-tooltip.json'))
            .exec('host.mjs symbol-and-tooltip.json');

        // Then - the anchored regex stops at the folder, an unanchored one reaches what it holds
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/frontend  color=folderRegexColor.custom1 badge=⚛️ tooltip=Frontend Source
            /work/shop/frontend/app.ts  color=folderRegexColor.custom1 badge=⚛️ tooltip=Frontend Source
            /work/shop/packages/common  color=terminal.ansiBlue
            /work/shop/packages/common/index.ts  none
            /work/shop/backend  none
        `);
        expect(result.stderr.text).toBe('');
    });

    test('the regex reads the path from its workspace folder, with forward slashes, and the first folder that matches wins', async () => {
        // Given - two workspace folders, and three folders listed in order: an anchored src, any src, a docs folder starting upper-case
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/first-match.json'))
            .exec('host.mjs first-match.json');

        // Then - each root is stripped, a backslash reads as a slash, the regex is Unicode-aware, and a path outside every root is tested whole
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/web/src  color=terminal.ansiBrightRed
            /work/api\\src  color=terminal.ansiBrightRed
            /work/api/lib/src  color=terminal.ansiBrightGreen
            /elsewhere/src  color=terminal.ansiBrightGreen
            /work/web/docs/Ünits  color=terminal.ansiBrightCyan
            /work/web/docs/units  none
            /work/web/README.md  none
        `);
    });

    test('a window with no workspace folder decorates nothing, whatever the settings match', async () => {
        // Given - a folder whose regex matches every path, and no folder open
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/no-workspace.json'))
            .exec('host.mjs no-workspace.json');

        // Then - with no root to read a path from, no regex is tested
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/src  none
        `);
    });

    test('a workspace that configures no folder decorates nothing', async () => {
        // Given - the setting left at its default
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/nothing-configured.json'))
            .exec('host.mjs nothing-configured.json');

        // Then - the default list is empty, so no path is decorated
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/src  none
        `);
    });
});
