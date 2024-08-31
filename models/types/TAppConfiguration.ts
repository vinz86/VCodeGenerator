import type {ELoggerLevel} from "~/models/enum/ELoggerLevel";
import type {ELoggerOutput} from "~/models/enum/ELoggerOutput";

export type TAppConfiguration = {
    appName: string;
    appVersion: string;
    appVersionDate: string;
    featureX: boolean;
    featureY: boolean;
    apiBase: string;
    theme: string;
    loggingOutput: ELoggerOutput,
    loggingLevel: ELoggerLevel,
    loggingCount: number,
    //[key: string]: any;
}