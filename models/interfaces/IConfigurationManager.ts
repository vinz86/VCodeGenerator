import type {TAppConfiguration} from "~/models/types/TAppConfiguration";

export interface IConfigurationManager {
    getConfig(): TAppConfiguration;
    getDafaultConfig(): TAppConfiguration;
    isFeatureEnabled(feature: keyof TAppConfiguration): boolean;
    getApiBase(): string;
    getTheme(): string;
}