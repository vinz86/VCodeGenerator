import { EApiHttpClientType } from "~/models/enum/EApiHttpClientType";
import { ApiClient } from "~/services/api/ApiClient";
import { FileRepository } from "~/services/api/repositories/FileRepository";
import { ApiContainer } from "~/services/api/ApiContainer";
import { UserRepository } from "~/services/api/repositories/UserRepository";
import { AuthRepository } from "~/services/api/repositories/AuthRepository";
import { ProjectRepository } from "~/services/api/repositories/ProjectRepository";
import {EApiKeys} from "~/models/enum/EApiKeys";

export class ApiInit {
    private static instance: ApiInit | null = null;

    private constructor() {
        this.registerServices();
    }

    // singleton peer essere sicuri che i servizi vengano registrati una sola volta
    // da chiamare in un plugin
    public static getInstance(): ApiInit {
        if (!ApiInit.instance) {
            ApiInit.instance = new ApiInit();
        } else {
            console.warn('Servizi già registrati');
        }

        return ApiInit.instance;
    }

    private registerServices(): void {
        try {
            const client: EApiHttpClientType = EApiHttpClientType.AsyncData;

            ApiContainer.registerService(EApiKeys.ApiClient, ApiClient.getInstance(client));
            ApiContainer.registerService(EApiKeys.AuthRepository, () => new AuthRepository(client));
            ApiContainer.registerService(EApiKeys.UserRepository, () => new UserRepository(client));
            ApiContainer.registerService(EApiKeys.ProjectRepository, () => new ProjectRepository(client));
            ApiContainer.registerService(EApiKeys.FileRepository, () => new FileRepository(client));
        } catch (e) {
            console.error(`Errore durante l'inizializzazione dei servizi:`, e);
            throw e;
        }
    }
}
