import { EServiceKeys } from "~/models/enum/EServiceKeys";

export type ServiceFactory<T> = () => T;
export type AsyncServiceFactory<T> = () => Promise<T>;
export type ServiceFactoryType<T> = ServiceFactory<T> | AsyncServiceFactory<T>;

export interface ServiceConfig {
  singleton?: boolean; // Indica se il servizio deve essere trattato come singleton
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
    const serviceEntry = ApiContainer.services.get(key);

    if (!serviceEntry) {
      throw new Error(`Servizio ${key} non trovato`);
    }

    if (serviceEntry.config.singleton) {
      if (!serviceEntry.instance) {
        serviceEntry.instance = serviceEntry.factory();
        // Se la factory ritorna una promise (asincrona), lancia un errore.
        if (serviceEntry.instance instanceof Promise) {
          throw new Error(`Servizio ${key} è stato registrato come asincrono. Utilizzare getServiceAsync.`);
        }
      }
      return serviceEntry.instance;
    } else {
      const instance = serviceEntry.factory();
      if (instance instanceof Promise) {
        throw new Error(`Servizio ${key} è stato registrato come asincrono. Utilizzare getServiceAsync.`);
      }
      return instance as T;
    }
  }

  static async getServiceAsync<T>(key: EServiceKeys): Promise<T> {
    const serviceEntry = ApiContainer.services.get(key);

    if (!serviceEntry) {
      throw new Error(`Servizio ${key} non trovato`);
    }

    if (serviceEntry.config.singleton) {
      if (!serviceEntry.instance) {
        serviceEntry.instance = await serviceEntry.factory();
      }
      return serviceEntry.instance;
    } else {
      return await serviceEntry.factory() as T;
    }
  }

  static removeService(key: EServiceKeys): void {
    if (ApiContainer.services.has(key)) {
      ApiContainer.services.delete(key);
    } else {
      console.warn(`Tentativo di rimuovere un servizio non registrato con chiave ${key}.`);
    }
  }

  static clearServices(): void {
    ApiContainer.services.clear();
  }
}
