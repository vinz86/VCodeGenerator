import type {TAppConfiguration} from '~/models/types/TAppConfiguration';
import {EClientConfiguration} from '~/models/enum/EClientConfiguration';
import type {IConfigurationManager} from '~/models/interfaces/IConfigurationManager';

import defaultConfig from '@/manager/ConfigurationManager/configs/default.ts';
import VCodeGenerator from "~/manager/ConfigurationManager/configs/VCodeGenerator";

export class ConfigurationManager implements IConfigurationManager {
    private static instance: ConfigurationManager;
    private defaultConfig: TAppConfiguration = defaultConfig;
    private clientConfig: TAppConfiguration = defaultConfig;

    private constructor() { }

    public static getInstance(clientId: EClientConfiguration = EClientConfiguration.Default): IConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
            ConfigurationManager.instance.initialize(clientId);
        }
        return ConfigurationManager.instance;
    }

    private loadClientConfig(clientId: EClientConfiguration): TAppConfiguration {

        const clientConfigs: { [key in EClientConfiguration]: TAppConfiguration } = {
            [EClientConfiguration.VCodeGenerator]: VCodeGenerator,
            [EClientConfiguration.Default]: this.defaultConfig,
        };

        const clientConfig = clientConfigs[clientId] || this.defaultConfig;
        return { ...this.defaultConfig, ...clientConfig };
    }

    private initialize(clientId: EClientConfiguration): void {
        try {
            this.clientConfig = this.loadClientConfig(clientId);
        } catch (error) {
            console.error("Errore nel caricamento della configurazione:", error);
            this.clientConfig = this.defaultConfig; // fallback in caso di errore
        }
    }

    public getConfig(): TAppConfiguration {
        return this.clientConfig;
    }

    public getDefaultConfig(): TAppConfiguration {
        return this.defaultConfig;
    }

    public isFeatureEnabled(feature: keyof TAppConfiguration): boolean {
        return !!this.clientConfig[feature];
    }

    public getApiBase(): string {
        return this.clientConfig.apiBase;
    }

    public getTheme(): string {
        return this.clientConfig.theme;
    }

    public getName(): string {
        return this.clientConfig.appName;
    }

    public getVersion(): string {
        return this.clientConfig.appVersion;
    }

    public getVersionDate(): string {
        return this.clientConfig.appVersionDate;
    }
}
