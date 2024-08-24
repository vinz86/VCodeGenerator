import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactory";
import {StateManager} from "~/store/StateManager";
import {LocalStorageService} from "~/services/LocalStorageService";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {Flyweight} from "~/factory/FlyweightFactory/Flyweight";
import type {IFileService} from "~/models/interfaces/IFileService";
import {FileService} from "~/services/FileService";
import {MockBackendService} from "~/services/BackendAdapter";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {NotifyManagerFactory} from "~/factory/NotifyManagerFactory/NotifyManagerFactory";
import {ENotifyManagerTypes} from "~/models/enum/ENotifyManagerTypes";
import {ValidationManager} from "~/manager/ValidationManager/ValidationManager";
import type {IValidationManager} from "~/manager/ValidationManager/VValidateModels";
import type {ISaveManager} from "~/models/interfaces/ISaveManager";
import type {IComponent} from "~/models/interfaces/IComponent";
import {SaveManager} from "~/manager/SaveManager";

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
            DIContainer.registerService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory, new ComponentFactoryProvider());
            DIContainer.registerService<Flyweight<any>>(EServiceKeys.FlyweightFactory, new Flyweight());
            DIContainer.registerService<StateManager>(EServiceKeys.StateManager, StateManager.getInstance());
            DIContainer.registerService<LocalStorageService>(EServiceKeys.LocalStorageService, new LocalStorageService());
            DIContainer.registerService(EServiceKeys.BackendAdapter, new MockBackendService());
            DIContainer.registerService<IFileService>(EServiceKeys.FileService, FileService.getInstance());
            DIContainer.registerService<INotifyManager>(EServiceKeys.NotifyManager, NotifyManagerFactory.getInstance(ENotifyManagerTypes.PrimeVueToast));
            DIContainer.registerService<IValidationManager>(EServiceKeys.ValidationManager, new ValidationManager({ autoFocus: true }));
        }
        catch (e){
            throw e;
        }
    }
}