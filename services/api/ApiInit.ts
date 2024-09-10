import { EApiHttpClientType } from "~/models/enum/EApiHttpClientType";
import { ApiClient } from "~/services/api/ApiClient";
import { FileService } from "~/services/api/services/FileService";
import { ApiContainer } from "~/services/api/ApiContainer";
import { UserService } from "~/services/api/services/UserService";
import { AuthService } from "~/services/api/services/AuthService";
import { ProjectService } from "~/services/api/services/ProjectService";
import {EApiKeys} from "~/models/enum/EApiKeys";
import {ComponentService} from "~/services/api/services/ComponentService";

export class ApiInit {
    private static instance: ApiInit | null = null;

    private constructor() {
        this.registerServices();
    }

    // singleton peer essere sicuri che i servizi vengano registrati una sola volta
    // da chiamare in un plugin all'avvio di un'applicazine
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

            ApiContainer.registerService(EApiKeys.HttpClient, ApiClient.getInstance(client));
            ApiContainer.registerService(EApiKeys.AuthService, () => new AuthService(client));
            ApiContainer.registerService(EApiKeys.UserService, () => new UserService(client));
            ApiContainer.registerService(EApiKeys.ProjectService, () => new ProjectService(client));
            ApiContainer.registerService(EApiKeys.FileService, () => new FileService(client));
            ApiContainer.registerService(EApiKeys.ComponentService, () => new ComponentService(client));
        } catch (e) {
            console.error(`Errore durante l'inizializzazione dei servizi:`, e);
            throw e;
        }
    }
}
