import 'dotenv/config'

interface ENV {
    JWT_SECRET : string | undefined;
    HOST_API: string | undefined;
    PORT: number | undefined;
}

interface Config {
    JWT_SECRET : string;
    HOST_API: string;
    PORT: number;
}

const getConfig = (): ENV => {
    return {
        JWT_SECRET: process.env.JWT_SECRET ?? "secret",
        HOST_API: process.env.HOST_API ?? "localhost/api",
        PORT: process.env.PORT ? Number(process.env.PORT) : 3000
    }
};

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;