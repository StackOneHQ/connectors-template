import fs from 'node:fs';
import path from 'node:path';

const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
} as const;

interface McpServer {
    type: string;
    url: string;
    headers?: {
        Authorization: string;
    };
}

interface McpConfig {
    mcpServers: {
        [key: string]: McpServer;
    };
}

const generateMcpConfig = () => {
    // Load environment variables from .env file if it exists
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                }
            }
        }
    }

    // Read template from .mcp.template.json
    const templatePath = path.join(__dirname, '..', '.mcp.template.json');
    if (!fs.existsSync(templatePath)) {
        throw new Error('.mcp.template.json not found');
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Extract all environment variable references from the template
    const envVarMatches = templateContent.matchAll(/\$\{([^}]+)\}/g);
    const requiredEnvVars = new Set<string>();
    for (const match of envVarMatches) {
        requiredEnvVars.add(match[1]);
    }

    // Check for missing environment variables
    const missingVars: string[] = [];
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    }

    // Substitute environment variables in the template
    const configContent = templateContent.replace(/\$\{([^}]+)\}/g, (_match, varName) => {
        return process.env[varName] || '';
    });

    const mcpConfig: McpConfig = JSON.parse(configContent);

    // Write the config file
    const outputPath = path.join(__dirname, '..', '.mcp.json');
    fs.writeFileSync(outputPath, JSON.stringify(mcpConfig, null, 4));

    // biome-ignore lint/suspicious/noConsole: Script output
    console.log(`${colors.green}✅ Generated .mcp.json with environment variables${colors.reset}`);

    // Warn if required env vars are missing
    if (missingVars.length > 0) {
        // biome-ignore lint/suspicious/noConsole: Script warning
        console.warn(
            `${colors.yellow}⚠️  Missing environment variables: ${missingVars.join(', ')}${colors.reset}`,
        );
        // biome-ignore lint/suspicious/noConsole: Script warning
        console.warn(
            `${colors.yellow}   Create a .env file with the missing variables${colors.reset}`,
        );
    }
};

try {
    generateMcpConfig();
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // biome-ignore lint/suspicious/noConsole: Script error output
    console.error(`${colors.red}❌ Failed to generate .mcp.json: ${message}${colors.reset}`);
    process.exitCode = 1;
}
