import chalk from 'chalk';
import { watch } from 'chokidar';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { buildFile } from './buildFile';

const CONFIGS_DIR = path.resolve(__dirname, '../src/configs');
const DIST_DIR = path.resolve(__dirname, '../dist');

const print = (text: string) => {
    // biome-ignore lint/suspicious/noConsole: valid use case
    console.info(text);
};

const spinner = ora('Watching for connector changes...');

const displayWatchModeEnabled = () => {
    // biome-ignore lint/suspicious/noConsole: valid use case
    console.clear();
    print(chalk.yellow('Connectors build watch mode enabled. Press "q" to quit.\n'));
};

const watcher = watch(CONFIGS_DIR, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
});

const cleanup = () => {
    print(chalk.grey('\n\nExiting watch mode...'));
    watcher.close();
    spinner.stop();
    process.exit(0);
};

try {
    fs.statSync(CONFIGS_DIR);
} catch {
    print(chalk.redBright(`File or directory not found: ${CONFIGS_DIR}`));
    process.exit(1);
}

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
} else {
    print(chalk.yellow('Warning: TTY not available. Press Ctrl+C to exit.\n'));
}

displayWatchModeEnabled();

spinner.start();

watcher.on('change', async (filePath) => {
    displayWatchModeEnabled();
    spinner.stop();

    const relativePath = path.relative(CONFIGS_DIR, filePath);
    print(chalk.blue(`File changed: ${relativePath}. Building...`));
    const segments = relativePath.split(path.sep);
    if (segments.length !== 2) {
        print(chalk.yellow(`Skipping file at unexpected path: ${relativePath}`));
        spinner.start();
        return;
    }
    const [dirName, file] = segments;
    const dirPath = path.join(CONFIGS_DIR, dirName);

    try {
        await buildFile(dirPath, dirName, DIST_DIR, file);
        print(chalk.greenBright(`Done!\n`));
    } catch (error) {
        print(
            chalk.redBright(
                `Error building file ${filePath}: ${error instanceof Error ? error.message : String(error)}\n`,
            ),
        );
    }

    spinner.start();
});

process.stdin.on('data', (key) => {
    if (key.toString() === 'q') {
        cleanup();
    }
});

process.on('SIGINT', () => {
    cleanup();
});
