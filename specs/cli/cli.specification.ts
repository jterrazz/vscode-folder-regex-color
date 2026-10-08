import { specification } from '@jterrazz/test';
import { resolve } from 'node:path';
import { afterAll } from 'vitest';

// hazard: NODE_OPTIONS stays inherited — the mutation run hands every spawned node its coverage reporter through it.
export const { cleanup, cli } = await specification.cli('node', {
    defaults: { EXTENSION_ROOT: resolve(import.meta.dirname, '../..') },
});

afterAll(cleanup);
