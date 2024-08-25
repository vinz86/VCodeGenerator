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
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";

export class DIContainerInit {
    private static initialized: boolean = false;
    public static verbose: boolean = false;

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
    public static init(verbose: boolean = false): void {
        DIContainerInit.verbose = verbose;

        if (DIContainerInit.initialized) {
            DIContainerInit.verbose && console.warn('I servizi sono già stati inizializzati.');
            return;
        }

        DIContainerInit.initialize();

        DIContainerInit.initialized = true;
        DIContainerInit.verbose && console.log('Servizi DI inizializzati con successo.');
    }

    private static initialize(): void {
        try {
            DIContainerInit.verbose && console.log('Inizializzazione ComponentFactory.');
            DIContainer.registerService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory, new ComponentFactoryProvider());

            DIContainerInit.verbose && console.log('Inizializzazione FlyweightFactory.');
            DIContainer.registerService<Flyweight<any>>(EServiceKeys.FlyweightFactory, new Flyweight());

            DIContainerInit.verbose && console.log('Inizializzazione StateManager.');
            DIContainer.registerService<StateManager>(EServiceKeys.StateManager, StateManager.getInstance());

            DIContainerInit.verbose && console.log('Inizializzazione LocalStorageService.');
            DIContainer.registerService<LocalStorageService>(EServiceKeys.LocalStorageService, new LocalStorageService());

            DIContainerInit.verbose && console.log('Inizializzazione MockBackendService.');
            DIContainer.registerService(EServiceKeys.BackendAdapter, new MockBackendService());

            DIContainerInit.verbose && console.log('Inizializzazione FileService.');
            DIContainer.registerService<IFileService>(EServiceKeys.FileService, FileService.getInstance());

            DIContainerInit.verbose && console.log('Inizializzazione NotifyManager.');
            DIContainer.registerService<INotifyManager>(EServiceKeys.NotifyManager, NotifyManagerFactory.getInstance(ENotifyManagerTypes.PrimeVueToast));

            DIContainerInit.verbose && console.log('Inizializzazione ValidationManager.');
            DIContainer.registerService<IValidationManager>(EServiceKeys.ValidationManager, new ValidationManager({ autoFocus: true }));

            DIContainerInit.verbose && console.log('Inizializzazione ConfigurationManager.');
            DIContainer.registerService<IConfigurationManager>(EServiceKeys.ConfigurationManager, ConfigurationManager.getInstance());
        }
        catch (e){
            throw e;
        }
    }
}