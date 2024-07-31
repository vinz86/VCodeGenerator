import type {ELoggerLevel} from "~/models/enum/ELoggerLevel";
import type {ELoggerOutput} from "~/models/enum/ELoggerOutput";

export interface ILoggerConfig {
    level: ELoggerLevel;
    output: ELoggerOutput;
    length?: number;  // Numero massimo di log da mantenere
}