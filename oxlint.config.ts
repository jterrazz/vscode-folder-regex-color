import { testing } from '@jterrazz/test/oxlint';
import { compose, defineConfig, node } from '@jterrazz/typescript/oxlint';

export default defineConfig(compose(node, testing));
