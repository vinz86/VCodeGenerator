import type { ILoggerConfig } from '~/models/interfaces/ILoggerConfig';
import { ELoggerLevel } from '~/models/enum/ELoggerLevel';
import { ELoggerOutput } from '~/models/enum/ELoggerOutput';
import type { INotifyManager } from '~/models/interfaces/INotifyManager';
import type {ILoggerDecorator} from "~/models/interfaces/ILoggerDecorator";

// Funzione per gestire la serializzazione sicura degli oggetti
function safeStringify(obj: object, spaces: number = 1): string {
    const cache: Set<any> = new Set();
    return JSON.stringify(obj, (key:string, value: any): string => {

        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                return '[Circular]';
            }
            cache.add(value);
        }
        return value;
    }, spaces);
}

export class LoggerDecorator<T> implements ILoggerDecorator<T>{
    protected component: T;
    private config: ILoggerConfig;
    private storageKey = 'appLogs';
    private showDebugLog: boolean = false;
    private logRecords: string[] = [];

    constructor(component: T, config: ILoggerConfig) {
        this.component = component;
        this.config = config;
    }

    logMethodCalls() {
        const handler = {
            get: (target: any, prop: PropertyKey) => {
                const originalMethod = target[prop];
                if (typeof originalMethod === 'function') {
                    return (...args: any[]) => {
                        const level = this.determineLogLevel(prop as keyof INotifyManager);
                        const shouldLog = this.shouldLog(level);

                        if (!shouldLog) {
                            return;
                        }

                        const startMessage = `Chiamo il metodo: ${String(prop)} con proprietà: ${safeStringify(args)}`;
                        this.showDebugLog && console.debug(`Inizio log: ${startMessage}`); 

                        //this.log(startMessage, level);

                        let result;
                        try {
                            result = originalMethod.apply(target, args);
                        } catch (error: any) {
                            this.showDebugLog && console.debug("Dentro il catch", error);
                            const errorMessage = `Errore nel metodo ${String(prop)}: ${error?.message}`;
                            this.log(errorMessage, ELoggerLevel.Error);
                            throw error; // rimando l'errore al livello superiore
                        }

                        const resultMessage = `Il metodo ${String(prop)} ${safeStringify(args)} restituisce: ${safeStringify(result)}`;
                        this.showDebugLog && console.debug(`Fine log: ${resultMessage}`); 
                        this.log(resultMessage, level);

                        return result;
                    };
                }
                return originalMethod;
            }
        };

        // restituisce un proxy che intercetta le chiamate ai metodi
        return new Proxy(this.component, handler);
    }

    public setStorageKey(storageKey: string): void {
        this.storageKey = storageKey;
    }

    public setShowDebugLog(showDebugLog: boolean): void {
        this.showDebugLog = showDebugLog;
    }

    private shouldLog(level: ELoggerLevel): boolean {
        const levels = {
            [ELoggerLevel.Debug]: 1,
            [ELoggerLevel.Info]: 2,
            [ELoggerLevel.Warn]: 3,
            [ELoggerLevel.Error]: 4
        };

        const isLoggingEnabled = levels[this.config.level] <= levels[level];
        this.showDebugLog && console.debug(`Livello log: ${level}\nshouldLog: ${isLoggingEnabled}`);
        return isLoggingEnabled;
    }

    private determineLogLevel(method: keyof INotifyManager): ELoggerLevel {
        const methodLevels: { [key in keyof INotifyManager]: ELoggerLevel } = {
            show: ELoggerLevel.Debug,
            success: ELoggerLevel.Debug,
            info: ELoggerLevel.Info,
            warning: ELoggerLevel.Warn,
            error: ELoggerLevel.Error,
        };
        return methodLevels[method] || ELoggerLevel.Debug;
    }

    private log(message: string, level: ELoggerLevel = this.config.level) {
        if (!this.shouldLog(level)) {
            this.showDebugLog && console.debug(`Logging non abilitato per il level: ${level}`); 
            return;
        }

        const formattedLevel = ELoggerLevel[level] ?? 'Unknown';
        const timestamp = new Date().toISOString();
        const formattedMessage = JSON.stringify({level:formattedLevel, time: timestamp, message: message});
        this.showDebugLog && console.debug(`Messaggio di log formattato: ${formattedMessage}`); 

        switch (this.config.output) {
            case ELoggerOutput.Console:
                console.log(formattedMessage);
                break;
            case ELoggerOutput.File:
                this.logToFile(formattedMessage);
                break;
            case ELoggerOutput.LocalStorage:
                this.logToLocalStorage(formattedMessage);
                break;
            case ELoggerOutput.Remote:localStorage.getItem(this.storageKey)
                this.logToRemote(formattedMessage);
                break;
        }
    }

    private logToFile(message: string) {
        //TODO: da implementare
        const fileContent = `${message}\n`;
        console.log(`Scrittura messaggio nel file: ${fileContent}`);
    }

    private logToLocalStorage(message: string) {
        try{
            this.logRecords = []
            const actualLogs = localStorage.getItem(this.storageKey)
            if (actualLogs) {
                this.logRecords = [...JSON.parse(actualLogs)]
            }
        }
        catch(error){}

        this.logRecords.push(message);

        // Limita il numero di record memorizzati
        if (this.config.length && this.logRecords.length > this.config.length) {
            this.logRecords.shift();
        }

        try {
            const logRecordsString = JSON.stringify(this.logRecords);
            this.showDebugLog &&  console.debug(`Aggiorno localStorage con: ${logRecordsString}`); 
            localStorage.setItem(this.storageKey, logRecordsString);
        } catch (e) {
            console.error("Errore durante la scrittura nel localStorage:", e);
        }
    }

    private logToRemote(message: string) {
        //TODO: da implementare
        console.log(`Chiamata servizio di log con il messaggio: ${message}`);
    }
}
