import type {TAppConfiguration} from "~/models/types/TAppConfiguration";

export interface IConfigurationManager {
    getConfig(): TAppConfiguration;
    getDefaultConfig(): TAppConfiguration;
    isFeatureEnabled(feature: keyof TAppConfiguration): boolean;
    getApiBase(): string;
    getName(): string;
    getVersion(): string;
    getVersionDate(): string
    getTheme(): string;
}