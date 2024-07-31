export interface ILoggerDecorator<T>{
    logMethodCalls(): T;
    setStorageKey(storageKey: string): void;
    setShowDebugLog(showDebugLog: boolean): void;
}