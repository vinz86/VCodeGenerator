import type {TAppConfiguration} from "~/models/types/TAppConfiguration";
import {ELoggerOutput} from "~/models/enum/ELoggerOutput";
import {ELoggerLevel} from "~/models/enum/ELoggerLevel";

const defaultConfig: TAppConfiguration = {
    appName: 'Default App',
    appVersion: '0.0.2',
    appVersionDate: '24/08/2024 02:57',
    apiBase: 'https://api.default.com',
    theme: 'light',
    featureX: true,
    featureY: false,
    loggingOutput: ELoggerOutput.LocalStorage,
    loggingLevel: ELoggerLevel.Error,
    loggingCount: 50,
};

export default defaultConfig;