export type TAppConfiguration = {
    appName: string;
    appVersion: string;
    appVersionDate: string;
    featureX: boolean;
    featureY: boolean;
    apiBase: string;
    theme: string;
    [key: string]: any; // Per proprietà dinamiche
}