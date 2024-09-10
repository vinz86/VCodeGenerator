import { EServiceKeys } from "~/models/enum/EServiceKeys";

export type ServiceFactory<T> = () => T;
export type AsyncServiceFactory<T> = () => Promise<T>;
export type ServiceFactoryType<T> = ServiceFactory<T> | AsyncServiceFactory<T>;

export interface ServiceConfig {
  singleton?: boolean; // il servizio deve essere trattato come singleton?
}

export class ApiContainer {
  private static services: Map<EServiceKeys, { factory: ServiceFactoryType<any>, instance: any, config: ServiceConfig }> = new Map();

  static registerService<T>(key: EServiceKeys, factory: ServiceFactoryType<T>, config: ServiceConfig = { singleton: false }): void {
    if (ApiContainer.services.has(key)) {
      console.warn(`Il servizio ${key} è già registrato. Sovrascrittura in corso.`);
      // return
    }
    ApiContainer.services.set(key, { factory, instance: null, config });
  }

  static getService<T>(key: EServiceKeys): T {
    const currentService = ApiContainer.services.get(key);

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

  static async getServiceAsync<T>(key: EServiceKeys): Promise<T> {
    const currentService = ApiContainer.services.get(key);

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
    if (ApiContainer.services.has(key)) {
      ApiContainer.services.delete(key);
    } else {
      console.warn(`Il servizio ${key} non è registrato.`);
    }
  }

  static clearServices(): void {
    ApiContainer.services.clear();
  }
}
