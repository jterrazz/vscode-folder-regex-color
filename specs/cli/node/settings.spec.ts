import { directory, file } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('settings', () => {
    test('a change of the folders setting refreshes every decoration from the new list, and a change of any other setting refreshes none', async () => {
        // Given - src colored red, then the list changed to green while VS Code reports another setting, then the folders setting reported
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/settings-change.json'))
            .exec('host.mjs settings-change.json');

        // Then - the list is read again only when its own setting is reported changed
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/src  color=terminal.ansiBrightRed
            changed editor.fontSize: 0 refresh(es)
            /work/shop/src  color=terminal.ansiBrightRed
            changed folder-regex-color.folders: 1 refresh(es) of every decoration
            /work/shop/src  color=terminal.ansiBrightGreen
        `);
    });
});
