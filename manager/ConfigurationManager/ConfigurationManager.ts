import type { TAppConfiguration } from '~/models/types/TAppConfiguration';
import type { EClientConfiguration } from '~/models/enum/EClientConfiguration';
import type { IConfigurationManager } from '~/models/interfaces/IConfigurationManager';

export class ConfigurationManager implements IConfigurationManager {
    private static instance: ConfigurationManager;
    private readonly includePath: string = 'manager/ConfigurationManager/configs' ;
    private defaultConfig: TAppConfiguration;
    private clientConfig: TAppConfiguration;

    private constructor() {
        const config = useRuntimeConfig();
        const clientId: EClientConfiguration = config.public.clientConfig;

        this.clientConfig = {} as TAppConfiguration;

        this.loadClientConfig(clientId).then((config) => {
            this.clientConfig = config;
        }).catch((error) => {
            console.error("Errore nel caricamento della configurazione:", error);
        });
    }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    // Carica la configurazione del cliente e quella di default
    private async loadClientConfig(clientId: EClientConfiguration): Promise<TAppConfiguration> {
        // configurazione di default
        const defaultConfigPath: string = `@/${this.includePath}/default.ts`;
        console.log('defaultConfigPath', `defaultConfigPath`)
        const defaultConfigModule = await import(`@/manager/ConfigurationManager/configs/default.ts`);
        const defaultConfig: TAppConfiguration = this.defaultConfig = defaultConfigModule.default;

        let clientConfig: Partial<TAppConfiguration> = {};

        try {
            // configurazione cliente
            const clientConfigModule = await import(`@/manager/ConfigurationManager/configs/${clientId}.ts`);
            clientConfig = clientConfigModule.default;
        } catch (error) {
            console.warn(`Configurazione per "${clientId}" non trovata, utilizzo configurazione di default.`);
        }

        return { ...defaultConfig, ...clientConfig } as TAppConfiguration;
    }

    public getConfig(): TAppConfiguration {
        return this.clientConfig;
    }

    public getDefaultConfig(): TAppConfiguration {
        return this.defaultConfig;
    }

    public isFeatureEnabled(feature: keyof TAppConfiguration): boolean {
        return this.clientConfig[feature];
    }

    public getApiBase(): string {
        return this.clientConfig.apiBase;
    }

    public getTheme(): string {
        return this.clientConfig.theme;
    }
}
