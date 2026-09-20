import { defineSpecConfig, unit } from '@jterrazz/test/vitest';

export default defineSpecConfig({
    test: { projects: [unit()] },
});
