import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {EApiHttpClientType} from "~/models/enum/EApiHttpClientType";
import {ApiClient} from "~/services/api/ApiClient";
import {UserRepository} from "~/services/api/repositories/UserRepository";
import {AuthRepository} from "~/services/api/repositories/AuthRepository";
import {ProjectRepository} from "~/services/api/repositories/ProjectRepository";
import {FileRepository} from "~/services/api/repositories/FileRepository";

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

export function initApiContainer() {
  const client: EApiHttpClientType = EApiHttpClientType.AsyncDataClient;

  ApiContainer.registerService(EServiceKeys.ApiClient, () => ApiClient.getInstance(client));
  ApiContainer.registerService(EServiceKeys.UserRepository, () => UserRepository.getInstance(client));
  ApiContainer.registerService(EServiceKeys.AuthRepository, () => AuthRepository.getInstance(client));
  ApiContainer.registerService(EServiceKeys.ProjectRepository, () => ProjectRepository.getInstance(client));
  ApiContainer.registerService(EServiceKeys.FileRepository, () => FileRepository.getInstance(client));
}