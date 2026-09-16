// @ts-check
import path from 'node:path';

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type {WebpackConfig} */
const extensionConfig = {
    // VS Code extensions run in a Node.js context and are loaded as CommonJS.
    target: 'node',
    mode: 'none',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(import.meta.dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
    },
    // The vscode module is created on the fly by the host and must stay external.
    externals: { vscode: 'commonjs vscode' },
    resolve: { extensions: ['.ts', '.js'] },
    module: {
        rules: [
            {
                test: /\.ts$/u,
                exclude: /node_modules/u,
                use: [
                    {
                        loader: 'ts-loader',
                        // The shared tsconfig preset type-checks only; webpack needs the emit.
                        options: { compilerOptions: { noEmit: false } },
                    },
                ],
            },
        ],
    },
    devtool: 'nosources-source-map',
    // Log level the VS Code problem matchers read.
    infrastructureLogging: { level: 'log' },
};

export default [extensionConfig];
