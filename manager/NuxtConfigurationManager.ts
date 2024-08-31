import { useRuntimeConfig } from '#app'

export class NuxtConfigurationManager {
    private static instance: ConfigService | null = null;
    private readonly config: any;

    private constructor() {
        const runtimeConfig = useRuntimeConfig();
        this.config = runtimeConfig.public;
    }

    public static getInstance(): ConfigService {
        if (this.instance === null) {
            this.instance = new NuxtConfigurationManager();
        }
        return this.instance;
    }

    public getConfig(): string {
        return this.config;
    }

    public getMainAppVersion(): string {
        return this.config?.mainAppVersion;
    }

    public getEnvironment(): string {
        return this.config?.environment;
    }
}
