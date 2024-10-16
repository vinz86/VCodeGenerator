import type { EApiHttpClientType } from "~/services/api/core/models/enum/EApiHttpClientType";
import type { EApiAuthType } from "~/services/api/core/ApiClient";
import { ApiClient } from "~/services/api/core/ApiClient";
import { FileService } from "~/services/api/services/FileService";
import { Api } from "~/services/api/Api";
import { UserService } from "~/services/api/services/UserService";
import { AuthService } from "~/services/api/services/AuthService";
import { ProjectService } from "~/services/api/services/ProjectService";
import { ApiKeys } from "~/services/api/ApiKeys";
import { ComponentService } from "~/services/api/services/ComponentService";
import { ApiHttpService } from "~/services/api/core/ApiHttpService";
import { CodeGeneratorService } from "~/services/api/services/CodeGeneratorService";
import type {EServiceEntry} from "~/services/api/core/models/type/EServiceEntry";
import {FileExtensionService} from "~/services/api/services/FileExtensionService";
import {ComponentPresetService} from "~/services/api/services/ComponentPresetService";
import {ProjectTypeService} from "~/services/api/services/ProjectTypeService";
import {FileTypeService} from "~/services/api/services/FileTypeService";
import {ComponentFactoryService} from "~/services/api/services/ComponentFactoryService";
import {ProjectStateService} from "~/services/api/services/ProjectStateService";

//da chiamare (una sola volta) in un plugin o all'avvio dell'applicazione
export class ApiInit {
    private static instance: ApiInit | null = null;

    private serviceKeys: EServiceEntry[] = [
        { key: ApiKeys.AuthService, service: AuthService },
        { key: ApiKeys.UserService, service: UserService },
        { key: ApiKeys.ProjectService, service: ProjectService },
        { key: ApiKeys.FileService, service: FileService },
        { key: ApiKeys.ComponentService, service: ComponentService },
        { key: ApiKeys.CodeGeneratorService, service: CodeGeneratorService },
        { key: ApiKeys.FileExtensionsService, service: FileExtensionService },
        { key: ApiKeys.ComponentPreset, service: ComponentPresetService },
        { key: ApiKeys.ProjectType, service: ProjectTypeService },
        { key: ApiKeys.FileType, service: FileTypeService },
        { key: ApiKeys.ComponentFactory, service: ComponentFactoryService },
        { key: ApiKeys.ProjectState, service: ProjectStateService },
    ];

    private constructor(
        private client: EApiHttpClientType,
        private cacheTimeout: number,
        private authType: EApiAuthType
    ) {
        this.registerServices();
    }

    public static getInstance(client: EApiHttpClientType, timeout: number, authType: EApiAuthType): ApiInit {
        if (!ApiInit.instance) {
            ApiInit.instance = new ApiInit(client, timeout, authType);
        } else {
            console.warn('Servizi già registrati');
        }

        return ApiInit.instance;
    }

    private registerServices(): void {
        try {
            ApiClient.getInstance(this.client, this.cacheTimeout, this.authType);
            Api.registerService(ApiKeys.HttpClient, () => new ApiHttpService(this.client));

            for (const { key, service, params } of this.serviceKeys) {
                Api.registerService(key, () => new service(this.client, ...(params || [])));
            }
        } catch (e) {
            console.error(`Errore durante l'inizializzazione dei servizi:`, e);
            throw e;
        }
    }
}
