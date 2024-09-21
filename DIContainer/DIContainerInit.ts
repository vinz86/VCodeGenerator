import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {StateManager} from "~/store/StateManager";
import {LocalStorageService} from "~/services/LocalStorageService";
import {DIContainer} from "~/DIContainer/DIContainer";
import {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {NotifyManagerFactory} from "~/factory/NotifyManagerFactory/NotifyManagerFactory";
import {ENotifyManagerTypes} from "~/models/enum/ENotifyManagerTypes";
import {ValidationManager} from "~/manager/ValidationManager/ValidationManager";
import type {IValidationManager} from "~/manager/ValidationManager/VValidateModels";
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import {LoggerDecorator} from "~/decorator/LoggerDecorator";
import {NuxtConfigurationManager} from "~/manager/NuxtConfigurationManager";
import DialogManager from "~/manager/DialogManager";
import HistoryManager from "~/manager/HistoryManager";
import ConfirmManager from "~/manager/ConfirmManager";
import {CookieService} from "~/services/CookieService";

export class DIContainerInit {
    private static initialized: boolean = false;
    public static verbose: boolean = false;

    /**
     * Inizializza i servizi del contenitore DI. Questo metodo deve essere chiamato una sola volta all'avvio dell'applicazione
     * Plugin esempio:
     * import { defineNuxtPlugin } from '#app';
     * import {DIContainerInit} from "~/services/DIContainer/DIContainerInit";
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
        const nuxtConfig = NuxtConfigurationManager.getInstance().getConfig();
        const configurationManager = ConfigurationManager.getInstance(nuxtConfig.clientConfig);
        const appConfig = configurationManager.getConfig();

        try {
            DIContainerInit.verbose && console.log('Inizializzazione ConfigurationManager.');
            DIContainer.registerService<IConfigurationManager>(EServiceKeys.ConfigurationManager, ()=> configurationManager);

            DIContainerInit.verbose && console.log('Inizializzazione ComponentFactory.');
            DIContainer.registerService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory, ()=> new ComponentFactoryProvider());

            DIContainerInit.verbose && console.log('Inizializzazione FlyweightFactory.');
            DIContainer.registerService<FlyweightFactory<any>>(EServiceKeys.FlyweightFactory, ()=> new FlyweightFactory());

            DIContainerInit.verbose && console.log('Inizializzazione StateManager.');
            DIContainer.registerService<StateManager>(EServiceKeys.StateManager, ()=> StateManager.getInstance());

            DIContainerInit.verbose && console.log('Inizializzazione LocalStorageService.');
            DIContainer.registerService<LocalStorageService>(EServiceKeys.LocalStorageService, ()=> new LocalStorageService(appConfig.encryptionKey));

            // DIContainerInit.verbose && console.log('Inizializzazione FileService.');
            // DIContainer.registerService<IFileService>(EServiceKeys.FileService, ()=> FileService.getInstance());

            DIContainerInit.verbose && console.log('Inizializzazione NotifyManager.');
            DIContainer.registerService<INotifyManager>(EServiceKeys.NotifyManager, ()=> NotifyManagerFactory.getInstance(ENotifyManagerTypes.PrimeVueToast));

            DIContainerInit.verbose && console.log('Inizializzazione NotifyAndLog');
            const loggingDecoratorConfig = {
                level: appConfig.loggingLevel,
                output: appConfig.loggingEnabled,
                length: appConfig.loggingCount
            }
            const notifyManager = ()=> NotifyManagerFactory.getInstance(ENotifyManagerTypes.PrimeVueToast);
            DIContainer.registerService<INotifyManager>(EServiceKeys.NotifyAndLog, ()=> new LoggerDecorator(notifyManager, loggingDecoratorConfig).logMethodCalls());

            DIContainerInit.verbose && console.log('Inizializzazione ValidationManager.');
            DIContainer.registerService<IValidationManager>(EServiceKeys.ValidationManager, ()=> new ValidationManager({ autoFocus: true }));

            DIContainerInit.verbose && console.log('Inizializzazione DialogManager.');
            DIContainer.registerService<IDialogManager>(EServiceKeys.DialogManager, ()=> new DialogManager());

            DIContainerInit.verbose && console.log('Inizializzazione HistoryManager.');
            DIContainer.registerService<HistoryManager>(EServiceKeys.HistoryManager, ()=> new HistoryManager());

            DIContainerInit.verbose && console.log('Inizializzazione ConfirmManager.');
            DIContainer.registerService<ConfirmManager>(EServiceKeys.ConfirmManager, ()=> new ConfirmManager());

            DIContainerInit.verbose && console.log('Inizializzazione CookieService.');
            DIContainer.registerService<CookieService>(EServiceKeys.CookieService, ()=> new CookieService());
        }

        catch (e){
            throw e;
        }
    }
}