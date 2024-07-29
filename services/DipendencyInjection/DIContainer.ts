import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class DIContainer {
  private static services: Map<EServiceKeys, any> = new Map();

  static registerService<T>(key: EServiceKeys, instance: T): void {
    if (DIContainer.services.has(key)) {
      console.warn(`Il servizio ${key} è già registrato. Sovrascrittura in corso.`);
    }
    DIContainer.services.set(key, instance);
  }

  static getService<T>(key: EServiceKeys): T {
    if (!DIContainer.services.has(key)) {
      throw new Error(`Servizio ${key} non trovato`);
    }
    return DIContainer.services.get(key);
  }
}
