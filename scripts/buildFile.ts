import { loadConnector, parseYamlConnector } from '@stackone/connect-sdk';
import fs from 'fs';
import path from 'path';

export const buildFile = async (
    dirPath: string,
    dirName: string,
    distPath: string,
    file: string,
) => {
    if (file.endsWith('.s1.yaml')) {
        const filePath = path.join(dirPath, file);

        const fileData = loadConnector(filePath);
        const builtConnector = parseYamlConnector(fileData);

        const outputDir = path.join(distPath, dirName);

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
    }
};
