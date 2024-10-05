import type { EServiceKeys } from "~/models/enum/EServiceKeys";

export type ServiceFactory<T> = () => T;
export type AsyncServiceFactory<T> = () => Promise<T>;
export type ServiceFactoryType<T> = ServiceFactory<T> | AsyncServiceFactory<T>;

export interface ServiceConfig {
  singleton?: boolean; // Indica se il servizio deve essere trattato come singleton
}

export class DIContainer {
  private static services: Map<EServiceKeys, { factory: ServiceFactoryType<any>, instance: any, config: ServiceConfig }> = new Map();

  static registerService<T>(
      key: EServiceKeys,
      factory: ServiceFactoryType<T>,
      config: ServiceConfig = { singleton: false }
  ): void {
    if (DIContainer.services.has(key)) {
      console.warn(`Il servizio con chiave ${key} è già registrato. Sovrascrittura in corso.`);
    }
    DIContainer.services.set(key, { factory, instance: null, config });
  }

  static getService<T>(key: EServiceKeys): T {
    const serviceEntry = DIContainer.services.get(key);

    if (!serviceEntry) {
      throw new Error(`Servizio con chiave ${key} non trovato`);
    }

    if (serviceEntry.config.singleton) {
      if (!serviceEntry.instance) {
        serviceEntry.instance = serviceEntry.factory();

        // Verifica asincrona non intenzionale
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
    const serviceEntry = DIContainer.services.get(key);

    if (!serviceEntry) {
      throw new Error(`Servizio con chiave ${key} non trovato`);
    }

    if (serviceEntry.config.singleton) {
      if (!serviceEntry.instance) {
        serviceEntry.instance = await serviceEntry.factory();
      }
      return serviceEntry.instance;
    } else {
      // Crea una nuova istanza per i servizi non singleton
      return await serviceEntry.factory() as T;
    }
  }

  static removeService(key: EServiceKeys): void {
    if (DIContainer.services.has(key)) {
      DIContainer.services.delete(key);
    } else {
      console.warn(`Tentativo di rimuovere un servizio non registrato con chiave ${key}.`);
    }
  }

  static clearServices(): void {
    DIContainer.services.clear();
  }
}
