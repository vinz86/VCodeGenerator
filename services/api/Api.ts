import { EApiHttpClientType } from "~/models/enum/EApiHttpClientType";
import { ApiClient } from "~/services/api/ApiClient";
import { FileRepository } from "~/services/api/repositories/FileRepository";
import { ApiContainer } from "~/services/api/ApiContainer";
import { UserRepository } from "~/services/api/repositories/UserRepository";
import { AuthRepository } from "~/services/api/repositories/AuthRepository";
import { ProjectRepository } from "~/services/api/repositories/ProjectRepository";
import type { IApiRepositories } from "~/models/interfaces/IApiRepositories";
import {EApiKeys} from "~/models/enum/EApiKeys";

export class Api {
    private static instance: Api | null = null;

    private constructor() {
        this.registerServices();
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        } else {
            console.warn('Servizi già registrati');
        }

        return Api.instance;
    }

    private registerServices(): void {
        try {
            const client: EApiHttpClientType = EApiHttpClientType.AsyncData;

            ApiContainer.registerService(EApiKeys.ApiClient, () => ApiClient.getInstance(client));
            ApiContainer.registerService(EApiKeys.AuthRepository, () => new AuthRepository(client));
            ApiContainer.registerService(EApiKeys.UserRepository, () => new UserRepository(client));
            ApiContainer.registerService(EApiKeys.ProjectRepository, () => new ProjectRepository(client));
            ApiContainer.registerService(EApiKeys.FileRepository, () => new FileRepository(client));
        } catch (e) {
            console.error('Errore durante l\'inizializzazione dei servizi:', e);
            throw e;
        }
    }

    public getRepository(): IApiRepositories {
        return {
            http: ApiContainer.getService(EApiKeys.ApiClient),
            auth: ApiContainer.getService(EApiKeys.AuthRepository),
            user: ApiContainer.getService(EApiKeys.UserRepository),
            project: ApiContainer.getService(EApiKeys.ProjectRepository),
            files: ApiContainer.getService(EApiKeys.FileRepository),
        } as IApiRepositories;
    }
}
