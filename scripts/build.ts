import { loadConnector, parseYamlConnector } from '@stackone/connect-sdk';
import fs from 'fs';
import path from 'path';

const errors: { file: string; error: unknown }[] = [];

const getConfigsPath = (): string => {
    const newPath = path.resolve(__dirname, '../connectors');
    const legacyPath = path.resolve(__dirname, '../src/configs');
    const newPathExists = fs.existsSync(newPath);
    const legacyPathExists = fs.existsSync(legacyPath);

    if (newPathExists && legacyPathExists) {
        // biome-ignore lint/suspicious/noConsole: Dedicated logging not required
        console.warn(
            '\x1b[33m%s\x1b[0m',
            'Warning: Both "connectors/" and "src/configs/" exist. Using "connectors/". Please remove "src/configs/" to avoid confusion.',
        );
        return newPath;
    }

    if (newPathExists) {
        return newPath;
    }

    if (legacyPathExists) {
        // biome-ignore lint/suspicious/noConsole: Dedicated logging not required
        console.warn(
            '\x1b[33m%s\x1b[0m',
            'Warning: Using deprecated path "src/configs/". Please rename to "connectors/".',
        );
        return legacyPath;
    }

    return newPath;
};

export const build = async () => {
    const configsPath = getConfigsPath();
    const distPath = path.resolve(__dirname, '../dist');

    const entries = await fs.promises.readdir(configsPath, { withFileTypes: true });

    const directories = entries.filter((entry) => entry.isDirectory());

    for (const dir of directories) {
        const dirPath = path.join(configsPath, dir.name);
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            if (file.endsWith('.s1.yaml')) {
                try {
                    const filePath = path.join(dirPath, file);

                    const fileData = loadConnector(filePath);
                    const builtConnector = parseYamlConnector(fileData);

                    const outputDir = path.join(distPath, dir.name);

                    fs.mkdirSync(outputDir, { recursive: true });

                    const baseFilename = `${file.split('.')[0]}_v${builtConnector.version.replaceAll('.', '-')}`;
                    const jsonFilename = `${baseFilename}.json`;
                    const yamlFilename = `${baseFilename}.s1.yaml`;

                    fs.writeFileSync(
                        path.join(outputDir, jsonFilename),
                        JSON.stringify(builtConnector, null, 2),
                    );

                    fs.writeFileSync(
                        path.join(outputDir, yamlFilename),
                        typeof fileData === 'string' ? fileData : JSON.stringify(fileData, null, 2),
                    );
                } catch (error) {
                    errors.push({ file, error });
                }
            }
        }
    }

    if (errors.length > 0) {
        throw new Error('Build failed with errors.');
    }
};

build()
    .then(() => {
        // biome-ignore lint/suspicious/noConsole: Dedicated logging not required
        console.log('Build completed successfully.');
        process.exit(0);
    })
    .catch((error) => {
        // biome-ignore lint/suspicious/noConsole: Dedicated logging not required
        console.dir({ error, errors }, { depth: null, colors: true });
        process.exit(1);
    });
