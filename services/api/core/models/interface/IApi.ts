import type { EServiceKeys } from "~/models/enum/EServiceKeys";
import type { IServiceConfig } from "~/services/api/core/models/interface/IServiceConfig";

export interface IApi {
    registerService<T>(key: EServiceKeys, factory: ServiceFactoryType<T>, config?: IServiceConfig): void;
    getService<T>(key: EServiceKeys): T;
    getServiceAsync<T>(key: EServiceKeys): Promise<T>;
    removeService(key: EServiceKeys): void;
    clearServices(): void;
}
