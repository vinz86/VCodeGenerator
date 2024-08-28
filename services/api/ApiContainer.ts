import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class ApiContainer {
  private static services: Map<EServiceKeys, () => any> = new Map();

  static registerService<T>(key: EServiceKeys, factory: () => T): void {
    if (ApiContainer.services.has(key)) {
      console.warn(`Il servizio ${key} è già registrato. Sovrascrittura in corso.`);
    }
    ApiContainer.services.set(key, factory);
  }

  static getService<T>(key: EServiceKeys): T {
    if (!ApiContainer.services.has(key)) {
      throw new Error(`Servizio ${key} non trovato`);
    }
    const factory = ApiContainer.services.get(key);
    return factory ? factory() as T : undefined;
  }
}