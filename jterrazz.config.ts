import { test } from '@jterrazz/test/config';
import { defineConfig } from '@jterrazz/typescript/config';

export default defineConfig({
    kind: 'library',
    platform: 'node',
    presets: [test()],
    typescript: {
        roots: {
            images: 'the Marketplace icon the manifest’s `icon` names and the README’s screenshot, both shipped in the .vsix',
        },
    },
});
