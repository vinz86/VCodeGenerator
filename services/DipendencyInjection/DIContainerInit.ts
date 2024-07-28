import {ServiceKeys} from "~/models/enum/ServiceKeys";
import {ComponentFactoryProvider} from "~/factories/ComponentFactory";
import {StateManager} from "~/store/StateManager";
import {LocalStorageService} from "~/services/LocalStorageService";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {FlyweightFactory} from "~/factories/flyweight/FlyweightFactory";
import type {FileServiceInterface} from "~/models/interfaces/FileServiceInterface";
import {FileService} from "~/services/FileService";
import {MockBackendService} from "~/services/BackendAdapter";

export class DIContainerInit {
    private static initialized: boolean = false;
    public static verbose: boolean = false;

    constructor(verbose: boolean = false) {
        DIContainerInit.verbose = verbose;
    }

    /**
     * Inizializza i servizi del contenitore DI. Questo metodo deve essere chiamato una sola volta all'avvio dell'applicazione
     * Plugin esempio:
     * import { defineNuxtPlugin } from '#app';
     * import {DIContainerInit} from "~/services/DipendencyInjection/DIContainerInit";
     *
     * export default defineNuxtPlugin(() => {
     *     DIContainerInit.init();
     * });
     */
    public static init(): void {
        if (DIContainerInit.initialized) {
            DIContainerInit.verbose && console.warn('I servizi sono già stati inizializzati.');
            return;
        }

        DIContainerInit.initialize();

        DIContainerInit.initialized = true;
        DIContainerInit.verbose && console.log('Servizi DI inizializzati con successo.');
    }

    // ComponentFactoryProvider
    private static initialize(): void {
        try {
            DIContainer.registerService<ComponentFactoryProvider>(ServiceKeys.ComponentFactory, new ComponentFactoryProvider());
            DIContainer.registerService<FlyweightFactory<any>>(ServiceKeys.FlyweightFactory, new FlyweightFactory());
            DIContainer.registerService<StateManager>(ServiceKeys.StateManager, StateManager.getInstance());
            DIContainer.registerService<LocalStorageService>(ServiceKeys.LocalStorageService, new LocalStorageService());
            DIContainer.registerService(ServiceKeys.BackendAdapter, new MockBackendService());
            DIContainer.registerService<FileServiceInterface>(ServiceKeys.FileService, FileService.getInstance());
        }
        catch (e){
            throw e;
        }
    }
}