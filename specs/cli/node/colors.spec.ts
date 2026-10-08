import { directory, file } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('colors', () => {
    test('a color name resolves to the theme color it stands for, every slot package.json contributes resolves, and any other name is handed to the theme as it is', async () => {
        // Given - one folder per name: the six terminal colors, custom1 to custom21, and a theme color id
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/named-colors.json'))
            .exec('host.mjs named-colors.json');

        // Then - custom21 is no slot, so it reaches the theme unresolved, as charts.red does
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/blue  color=terminal.ansiBlue
            /work/shop/magenta  color=terminal.ansiBrightMagenta
            /work/shop/red  color=terminal.ansiBrightRed
            /work/shop/cyan  color=terminal.ansiBrightCyan
            /work/shop/green  color=terminal.ansiBrightGreen
            /work/shop/yellow  color=terminal.ansiBrightYellow
            /work/shop/custom1  color=folderRegexColor.custom1
            /work/shop/custom2  color=folderRegexColor.custom2
            /work/shop/custom3  color=folderRegexColor.custom3
            /work/shop/custom4  color=folderRegexColor.custom4
            /work/shop/custom5  color=folderRegexColor.custom5
            /work/shop/custom6  color=folderRegexColor.custom6
            /work/shop/custom7  color=folderRegexColor.custom7
            /work/shop/custom8  color=folderRegexColor.custom8
            /work/shop/custom9  color=folderRegexColor.custom9
            /work/shop/custom10  color=folderRegexColor.custom10
            /work/shop/custom11  color=folderRegexColor.custom11
            /work/shop/custom12  color=folderRegexColor.custom12
            /work/shop/custom13  color=folderRegexColor.custom13
            /work/shop/custom14  color=folderRegexColor.custom14
            /work/shop/custom15  color=folderRegexColor.custom15
            /work/shop/custom16  color=folderRegexColor.custom16
            /work/shop/custom17  color=folderRegexColor.custom17
            /work/shop/custom18  color=folderRegexColor.custom18
            /work/shop/custom19  color=folderRegexColor.custom19
            /work/shop/custom20  color=folderRegexColor.custom20
            /work/shop/custom21  color=custom21
            /work/shop/charts.red  color=charts.red
        `);
    });

    test('a folder with no color takes the free slot at its own position in the list, a position a named folder uses up too', async () => {
        // Given - a, then b named blue, then c, none of them naming another slot
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/auto-colors.json'))
            .exec('host.mjs auto-colors.json');

        // Then - blue leaves the free slots, and c takes the third of them, not the second
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/a  color=terminal.ansiBrightMagenta
            /work/shop/b  color=terminal.ansiBlue
            /work/shop/c  color=terminal.ansiBrightCyan
        `);
    });

    test('past the last free slot a folder takes the slot at its position among all of them, and past the last slot the count starts again', async () => {
        // Given - 27 folders: the first named blue, the 26 others naming none
        const result = await cli
            .fixture(directory('./__fixtures__/host/'))
            .fixture(file('./__fixtures__/scenarios/slots-run-out.json'))
            .exec('host.mjs slots-run-out.json');

        // Then - f25 finds no 26th free slot and takes custom20, the 26th of all; f26 starts again on the first free slot
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            activated: 1 subscription(s), 1 provider(s)
            /work/shop/f0  color=terminal.ansiBlue
            /work/shop/f1  color=terminal.ansiBrightRed
            /work/shop/f2  color=terminal.ansiBrightCyan
            /work/shop/f3  color=terminal.ansiBrightGreen
            /work/shop/f4  color=terminal.ansiBrightYellow
            /work/shop/f5  color=folderRegexColor.custom1
            /work/shop/f6  color=folderRegexColor.custom2
            /work/shop/f7  color=folderRegexColor.custom3
            /work/shop/f8  color=folderRegexColor.custom4
            /work/shop/f9  color=folderRegexColor.custom5
            /work/shop/f10  color=folderRegexColor.custom6
            /work/shop/f11  color=folderRegexColor.custom7
            /work/shop/f12  color=folderRegexColor.custom8
            /work/shop/f13  color=folderRegexColor.custom9
            /work/shop/f14  color=folderRegexColor.custom10
            /work/shop/f15  color=folderRegexColor.custom11
            /work/shop/f16  color=folderRegexColor.custom12
            /work/shop/f17  color=folderRegexColor.custom13
            /work/shop/f18  color=folderRegexColor.custom14
            /work/shop/f19  color=folderRegexColor.custom15
            /work/shop/f20  color=folderRegexColor.custom16
            /work/shop/f21  color=folderRegexColor.custom17
            /work/shop/f22  color=folderRegexColor.custom18
            /work/shop/f23  color=folderRegexColor.custom19
            /work/shop/f24  color=folderRegexColor.custom20
            /work/shop/f25  color=folderRegexColor.custom20
            /work/shop/f26  color=terminal.ansiBrightMagenta
        `);
    });
});
