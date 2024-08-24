export type TAppConfiguration = {
    featureX: boolean;
    featureY: boolean;
    apiBase: string;
    theme: string;
    [key: string]: any; // Per proprietà dinamiche
}