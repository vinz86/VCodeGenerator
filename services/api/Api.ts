import type { EServiceKeys } from "~/models/enum/EServiceKeys";
import type {IServiceConfig} from "~/services/api/core/models/interface/IServiceConfig";
import type {IApi} from "~/services/api/core/models/interface/IApi";
import type {TServiceFactoryType} from "~/services/api/core/models/type/TServiceFactoryType";
import type {TServiceFactory} from "~/services/api/core/models/type/TServiceFactory";
import type {TAsyncServiceFactory} from "~/services/api/core/models/type/TAsyncServiceFactory";

export class Api implements IApi {
  private static services: Map<EServiceKeys, { factory: TServiceFactoryType<any>, instance: any, config: IServiceConfig }> = new Map();

  static registerService<T>(key: EServiceKeys, factory: TServiceFactoryType<T>, config: IServiceConfig = { singleton: false }): void {
    if (Api.services.has(key)) {
      console.warn(`Il servizio ${key} è già registrato. Sovrascrittura in corso.`);
    }
    Api.services.set(key, { factory, instance: null, config });
  }

  static getService<T>(key: EServiceKeys): TServiceFactory<T> {
    const currentService = Api.services.get(key);

    if (!currentService) {
      throw new Error(`Servizio ${key} non trovato`);
    }

    if (currentService.config.singleton) {
      if (!currentService.instance) {
        currentService.instance = currentService.factory();
        if (currentService.instance instanceof Promise) {
          throw new Error(`Servizio ${key} è stato registrato come asincrono. Utilizzare getServiceAsync.`);
        }
      }
      return currentService.instance;
    } else {
      const instance = currentService.factory();
      if (instance instanceof Promise) {
        throw new Error(`Servizio ${key} è stato registrato come asincrono. Utilizzare getServiceAsync.`);
      }
      return instance as T;
    }
  }

  static async getServiceAsync<T>(key: EServiceKeys): Promise<TAsyncServiceFactory<T>> {
    const currentService = Api.services.get(key);

    if (!currentService) {
      throw new Error(`Servizio ${key} non trovato`);
    }

    if (currentService.config.singleton) {
      if (!currentService.instance) {
        currentService.instance = await currentService.factory();
      }
      return currentService.instance;
    } else {
      return await currentService.factory() as T;
    }
  }

  static removeService(key: EServiceKeys): void {
    if (Api.services.has(key)) {
      Api.services.delete(key);
    } else {
      console.warn(`Il servizio ${key} non è registrato.`);
    }
  }

  static clearServices(): void {
    Api.services.clear();
  }
}
