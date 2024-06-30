import { reactive } from 'vue';
import it from '../lang/it';
import en from '../lang/en';
import type {
    AsyncValidationRule,
    AsyncValidationRules,
    ValidationRule,
    ValidationRules,
    VValidateConfig
} from "./VValidateModels";

class VValidate {
    private errors = reactive<{ [key: string]: string | null }>({});
    private readonly messages: { [key: string]: any };
    private readonly validators: { [key: string]: any };
    private readonly asyncValidators: { [key: string]: any };
    private readonly autoFocus: boolean = true;
    private validationRules: ValidationRules | null = null;
    private asyncValidationRules: AsyncValidationRules | null = null;

    private onValidateStart: Function | null = null;
    private onValidateEnd: Function | null = null;
    private onFieldValid: Function | null = null;
    private onFieldInvalid: Function | null = null;

    private firstInvalidField: string | null = null;


    /**
     * Costruttore della classe VValidate.
     * @param {VValidateConfig} [config] - Configurazione opzionale per la validazione.
     */
    constructor(config?: VValidateConfig) {
        let { lang, extraMessages, customValidators, customAsyncValidators, autoFocus } = config || {};

        this.messages = this.initializeMessages(lang, extraMessages);
        this.validators = this.initializeValidators(customValidators);
        this.asyncValidators = this.initializeAsyncValidators(customAsyncValidators);
        this.autoFocus = autoFocus !== undefined ? autoFocus : true;  // Correzione qui
    }

    /**
     * Inizializza i messaggi di errore in base alla lingua e ai messaggi aggiuntivi forniti.
     * @param {string | object | undefined} lang - Lingua o oggetto dei messaggi di errore.
     * @param {any} extraMessages - Messaggi di errore aggiuntivi.
     * @returns {object} - Oggetto dei messaggi di errore.
     */
    private initializeMessages(lang: string | object | undefined, extraMessages: any = {}) {
        if (typeof lang === 'string') {
            switch (lang) {
                case 'it': return { ...it, ...extraMessages };
                case 'en': return { ...en, ...extraMessages };
                default: return { ...it, ...extraMessages };
            }
        } else if (typeof lang === 'object') {
            return { ...lang, ...extraMessages };
        } else {
            return { ...it, ...extraMessages };
        }
    }

    /**
     * Inizializza i validatori di campo.
     * @param {any} customValidators - Validatori personalizzati.
     * @returns {object} - Oggetto dei validatori.
     */
    private initializeValidators(customValidators: any) {
        const isEmpty = (value: any) => value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

        return {
            string: () => (value: any) => isEmpty(value) || typeof value === 'string',
            min: (length: number) => (value: any) => isEmpty(value) || (typeof value === 'string' && value.length >= length),
            max: (length: number) => (value: any) => isEmpty(value) || (typeof value === 'string' && value.length <= length),
            between: (values: number[]) => (value: any) => isEmpty(value) || (typeof value === 'string' && value.length >= values[0] && value.length <= values[1]),
            number: () => (value: any) => isEmpty(value) || !isNaN(value),
            email: () => (value: any) => isEmpty(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            url: () => (value: any) => isEmpty(value) || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
            phone: () => (value: any) => isEmpty(value) || /^\+?(\d.*){3,}$/.test(value),
            required: () => (value: any) => !isEmpty(value),
            image: () => (value: any) => isEmpty(value) || (value instanceof File && value.type.startsWith('image/')),
            regex: (pattern: RegExp) => (value: any) => isEmpty(value) || pattern.test(value),
            size: (maxSize: number) => (value: any) => isEmpty(value) || (value instanceof File && value.size <= maxSize * 1024),
            confirmed: (fieldToConfirm: string) => (value: any, formData: any) => isEmpty(value) || value === formData[fieldToConfirm],
            one_of: (list: any[]) => (value: any) => isEmpty(value) || list.includes(value),
            not_one_of: (list: any[]) => (value: any) => isEmpty(value) || !list.includes(value),
            ext: (extensions: string[]) => (value: any) => isEmpty(value) || (value instanceof File && extensions.some(ext => value.name.endsWith(ext))),
            integer: () => (value: any) => isEmpty(value) || Number.isInteger(parseInt(value)),
            is: (comparison: any) => (value: any) => isEmpty(value) || value === comparison,
            is_not: (comparison: any) => (value: any) => isEmpty(value) || value !== comparison,
            length: (len: number) => (value: any) => isEmpty(value) || (value && len) ? value.length === len : false,
            max_value: (max: number) => (value: any) => isEmpty(value) || value <= max,
            min_value: (min: number) => (value: any) => isEmpty(value) || value >= min,
            between_values: (values: number[]) => (value: any) => isEmpty(value) || (value.length >= values[0] && value.length <= values[1]),
            mimes: (types: string[]) => (value: any) => isEmpty(value) || (value instanceof File && types.includes(value.type)),
            ...customValidators
        };
    }

    /**
     * Inizializza i validatori asincroni TODO
     * @param {any} customAsyncValidators - Validatori asincroni personalizzati.
     * @returns {object} - Oggetto dei validatori asincroni.
     */
    private initializeAsyncValidators(customAsyncValidators: any) {
        return {
            uniqueUsername: async (username: string) => {
                return new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        const usernamesInUse = ['user1', 'user2', 'user3'];
                        resolve(!usernamesInUse.includes(username));
                    }, 1000);
                });
            },
            ...customAsyncValidators
        };
    }

    /**
     * Imposta le regole di validazione sincrone e asincrone.
     * @param {object} validationRules - Oggetto delle regole di validazione sincrone.
     * @param {object} asyncValidationRules - Oggetto delle regole di validazione asincrone.
     * @returns {AsyncValidationRule[]} - Array di regole di validazione asincrone.
     */
    public setValidationRules(validationRules?: ValidationRules, asyncValidationRules?: AsyncValidationRules):void {
        if(validationRules) {
            this.validationRules = validationRules;
        }
        if(asyncValidationRules) {
            this.asyncValidationRules = asyncValidationRules;
        }
    }

    /**
     * Genera le regole di validazione asincrone.
     * @param {object} rules - Oggetto delle regole di validazione asincrone.
     * @returns {AsyncValidationRule[]} - Array di regole di validazione asincrone.
     */
    public generateAsyncRules(rules: { [key: string]: any }): AsyncValidationRule[] {
        return Object.entries(rules).map(([key, value]) => {
            if (!this.asyncValidators[key]) {
                throw new Error(`Validatore asincrono per la chiave "${key}" non trovato.`);
            }
            return {
                validator: async (val: any, formData?: any) => await this.asyncValidators[key](val, formData),
                message: typeof this.messages[key] === 'function' ? this.messages[key](value) : this.messages[key]
            };
        });
    }

    /**
     * Genera le regole di validazione.
     * @param {object} rules - Oggetto delle regole di validazione.
     * @returns {ValidationRule[]} - Array di regole di validazione.
     */
    public generateRules(rules: { [key: string]: any }): ValidationRule[] {
        return Object.entries(rules).map(([key, value]) => {
            if (!this.validators[key]) {
                throw new Error(`Validatore per la chiave "${key}" non trovato.`);
            }
            return {
                validator: this.validators[key](value),
                message: typeof this.messages[key] === 'function' ? this.messages[key](value) : this.messages[key]
            };
        });
    }

    /**
     * Esegue i validatori asincroni per un campo specifico.
     * @param {string} fieldName - Nome del campo.
     * @param {any} value - Valore del campo.
     * @param {AsyncValidationRule[]} asyncRules - Regole di validazione asincrone.
     * @param {any} [formData] - Dati del form.
     */
    private async runAsyncValidators(fieldName: string, value: any, asyncRules: AsyncValidationRule[], formData?: any) {
        const promises = asyncRules.map(rule => rule.validator(value, formData));
        try {
            const results = await Promise.all(promises);
            for (let i = 0; i < results.length; i++) {
                if (!results[i]) {
                    //this.errors[fieldName] = asyncRules[i].message;
                    this.setError(fieldName, asyncRules[i].message);
                    this.setFirstInvalidField(fieldName);
                    this.triggerCallback(this.onFieldInvalid, fieldName, asyncRules[i].message);
                    return;
                }
            }
        } catch (error) {
            console.error(`Errore nell'esecuzione del validatore asincrono per il campo ${fieldName}:`, error);
            this.errors[fieldName] = 'Si è verificato un errore durante la validazione.';
            return;
        }
        this.clearError(fieldName);
        this.triggerCallback(this.onFieldValid, fieldName);
    }

    /**
     * Valida un singolo campo del form.
     * @param {string} fieldName - Nome del campo.
     * @param {any} formData - Dati del form.
     * @param {ValidationRules} validationRules - Regole di validazione.
     * @param {AsyncValidationRules} [asyncValidationRules] - Regole di validazione asincrone.
     */
    public async validateFormFieldWithRules(fieldName: string, formData: any, validationRules: ValidationRules, asyncValidationRules?: AsyncValidationRules | null): Promise<void> {
        const value = formData[fieldName];
        const fieldRules = validationRules && validationRules[fieldName];
        const asyncRules = asyncValidationRules && asyncValidationRules[fieldName];
        if (!fieldRules && !asyncRules) return;

        this.triggerCallback(this.onValidateStart, fieldName);

        if (fieldRules) {
            for (const rule of fieldRules) {
                if (typeof rule.validator === 'function') {
                    const result = rule.validator(value, formData);
                    if (!result) {
                        this.setError(fieldName, rule.message);
                        this.setFirstInvalidField(fieldName);
                        this.triggerCallback(this.onFieldInvalid, fieldName, rule.message);
                        return;
                    }
                } else {
                    console.error(`Il validatore per il campo ${fieldName} non è una funzione`);
                }
            }
        } else {
            this.clearError(fieldName);
        }

        if (asyncRules) {
            await this.runAsyncValidators(fieldName, value, asyncRules, formData);
        } else {
            this.clearError(fieldName);
            //this.errors[fieldName] = null;
        }

        if (this.errors[fieldName] === null) {
            this.triggerCallback(this.onFieldValid, fieldName);
            this.clearError(fieldName)
        }

        this.triggerCallback(this.onValidateEnd, fieldName);
    }


    /**
     * Valida tutti i campi del form.
     * @param {object} formData - Dati del form.
     * @param {ValidationRules} validationRules - Regole di validazione.
     * @param {AsyncValidationRules} [asyncValidationRules] - Regole di validazione asincrone.
     * @returns {Promise<boolean>} - True se tutti i campi sono validi, altrimenti false.
     */
    public async validateFormWithRules(formData: any, validationRules: ValidationRules, asyncValidationRules?: AsyncValidationRules | null): Promise<boolean> {
        let isValid = true;
        this.triggerCallback(this.onValidateStart, 'form');

        for (const fieldName in validationRules) {
            if (Object.prototype.hasOwnProperty.call(validationRules, fieldName)) {
                await this.validateFormFieldWithRules(fieldName, formData, validationRules, asyncValidationRules);
                if (this.errors[fieldName]) {
                    isValid = false;
                }
            }
        }

        this.triggerCallback(this.onValidateEnd, 'form');
        return isValid;
    }

    /**
     * Valida un singolo campo del form.
     * Es. let formData = {username: 'value'} -> validateFormField('username', formData)
     * @param {string} fieldName - Nome del campo.
     * @param {any} formData - Dati del form.
     */
    public async validateFormField(fieldName: string, formData: any): Promise<void> {
        if (!this.validationRules) {
            throw new Error('Regole di validazione non impostate. Utilizzare setValidationRules() per impostare le regole di validazione.');
        }
        await this.validateFormFieldWithRules(fieldName, formData, this.validationRules, this.asyncValidationRules);
    }

    /**
     * Valida un campo.
     * Es. let username = 'value' -> validateField('username', username)
     * @param {string} fieldName - Nome del campo.
     * @param {any} value - Valore campo.
     */
    public async validateField(fieldName: string, value: any): Promise<void> {
        const formData = { [fieldName]: value };
        await this.validateFormField(fieldName, formData);
    }

    /**
     * Valida tutti i campi del form.
     * @param {any} formData - Dati del form.
     * @returns {Promise<boolean>} - True se tutti i campi sono validi, altrimenti false.
     */
    public async validateForm(formData: any): Promise<boolean> {
        if (!this.validationRules) {
            throw new Error('Regole di validazione non impostate. Utilizzare setValidationRules() per impostare le regole di validazione.');
        }
        return await this.validateFormWithRules(formData, this.validationRules, this.asyncValidationRules);
    }

    /**
     * Esegue una callback se definita.
     * @param {Function | null} callback - Callback da eseguire.
     * @param {...any} args - Argomenti da passare alla callback.
     */
    private triggerCallback(callback: Function | null, ...args: any[]) {
        if (callback) {
            callback(...args);
        }
    }

    /**
     * Imposta i callback per gli eventi di validazione.
     * @param {object} callbacks - Oggetto contenente i callback per gli eventi di validazione.
     */
    public setCallbacks(callbacks: { [key: string]: Function }) {
        // Imposta il callback per l'inizio della validazione del form.
        this.onValidateStart = callbacks.onValidateStart || null;

        // Imposta il callback per la fine della validazione del form.
        this.onValidateEnd = callbacks.onValidateEnd || null;

        // Imposta il callback per quando un campo è valido.
        this.onFieldValid = callbacks.onFieldValid || null;

        // Imposta il callback per quando un campo è invalido.
        this.onFieldInvalid = callbacks.onFieldInvalid || null;
    }

    /**
     * Imposta il primo campo non valido per il focus automatico.
     * @param {string} fieldName - Nome del campo.
     */
    private setFirstInvalidField(fieldName: string) {
        if(this.autoFocus) {
            if (this.errors[fieldName] && !this.firstInvalidField) {
                this.firstInvalidField = fieldName;
            }
        }
    }

    /**
     * Imposta il focus sul primo campo non valido.
     */
    public setFocusToFirstInvalidField() {
        if (this.firstInvalidField && this.autoFocus) {
            const element = document.getElementById(this.firstInvalidField);
            if (element) {
                element.focus();
            }
        }
    }

    // TODO: importazione dinamica
    // public setLanguage(lang: string) {
    //     this.messages = this.initializeMessages(lang, {});
    // }

    /**
     * Verifica se il form è valido.
     * @returns {boolean} - True se il form è valido, altrimenti false.
     */
    public isFormValid(): boolean {
        return Object.values(this.getErrors()).every(x => x === null)
    }

    /**
     * Verifica se un campo è invalido.
     * @param {string} fieldName - Nome del campo.
     * @returns {boolean} - True se il campo è invalido, altrimenti false.
     */
    public isInvalid(fieldName: string): boolean {
        return !!this.errors[fieldName];
    }

    /**
     * Verifica se un campo ha un errore specifico.
     * @param {string} fieldName - Nome del campo.
     * @returns {boolean} - True se il campo ha un errore specifico, altrimenti false.
     */
    public hasError(fieldName: string): boolean {
        return this.isInvalid(fieldName) && this.errors[fieldName] !== null;
    }

    /**
     * Restituisce tutti gli errori di validazione.
     * @returns {object} - Oggetto degli errori di validazione.
     */
    public getErrors() {
        return this.errors;
    }

    /**
     * Restituisce l'errore di un singolo campo.
     * @returns {string} - Errore di validazione.
     */
    public getError(fieldName: string): string | null {
        return this.errors[fieldName];
    }

    /**
     * Cancella l'errore di un campo specifico.
     * @param {string} fieldName - Nome del campo.
     */
    public clearError(fieldName: string): void {
        this.errors[fieldName] = null;
        this.firstInvalidField = this.firstInvalidField === fieldName ? null : this.firstInvalidField;
    }

    /**
     * Cancella tutti gli errori
     */
    public resetErrors(): void {
        for (const fieldName in this.errors) {
            if (Object.prototype.hasOwnProperty.call(this.errors, fieldName)) {
                this.errors[fieldName] = null;
            }
        }
        this.firstInvalidField = null;
    }

    /**
     * Imposta l' errore per un campo specifico.
     * @param {string} fieldName - Nome del campo.
     * @param {string} message - Messaggio di errore.
     */
    private setError(fieldName: string, message: string | null) {
        this.errors[fieldName] = message;
    }
    /**
     * Imposta la funzione di callback per l'inizio della validazione del campo.
     * @param {Function} callback - Funzione di callback.
     */
    public setOnValidateStart(callback: Function): void {
        this.onValidateStart = callback;
    }

    /**
     * Imposta la funzione di callback per la fine della validazione del campo.
     * @param {Function} callback - Funzione di callback.
     */
    public setOnValidateEnd(callback: Function): void {
        this.onValidateEnd = callback;
    }

    /**
     * Imposta la funzione di callback per il campo valido.
     * @param {Function} callback - Funzione di callback.
     */
    public setOnFieldValid(callback: Function): void {
        this.onFieldValid = callback;
    }

    /**
     * Imposta la funzione di callback per il campo non valido.
     * @param {Function} callback - Funzione di callback.
     */
    public setOnFieldInvalid(callback: Function): void {
        this.onFieldInvalid = callback;
    }

    /**
     * Restituisce tutti i validatori disponibili.
     * @returns {object} - Oggetto dei validatori.
     */
    public getValidators() {
        return this.validators;
    }

    /**
     * Restituisce tutti i messaggi di validazione disponibili.
     * @returns {object} - Oggetto dei messaggi di validazione.
     */
    public getMessages() {
        return this.messages;
    }
}

/*
const validationInstance = new VValidate({ lang: 'it' });

// Esempio di utilizzo callback
// validationInstance.setCallbacks({
//     onValidateStart: (fieldName: string) => console.log(`onValidateStart: Inizio validazione campo: ${fieldName}`),
//     onValidateEnd: (fieldName: string) => console.log(`onValidateEnd: Fine validazione campo: ${fieldName}`),
//     onFieldValid: (fieldName: string) => console.log(`onFieldValid: Campo valido: ${fieldName}`),
//     onFieldInvalid: (fieldName: string, message: string) => console.log(`onFieldInvalid: Campo non valido: ${fieldName}. Messaggio: ${message}`)
// });


export const generateRules = validationInstance.generateRules.bind(validationInstance);
export const validateFormFieldWithRules = validationInstance.validateFormFieldWithRules.bind(validationInstance);
export const validateFormWithRules = validationInstance.validateFormWithRules.bind(validationInstance);
export const isInvalid = validationInstance.isInvalid.bind(validationInstance);
export const hasError = validationInstance.hasError.bind(validationInstance);
export const getErrors = validationInstance.getErrors.bind(validationInstance);
export const getValidators = validationInstance.getValidators.bind(validationInstance);
export const getMessages = validationInstance.getMessages.bind(validationInstance);
export const generateAsyncRules = validationInstance.generateAsyncRules.bind(validationInstance);
export const validateFormField = validationInstance.validateFormField.bind(validationInstance);
export const validateField = validationInstance.validateField.bind(validationInstance);
export const validateForm = validationInstance.validateForm.bind(validationInstance);
export const setValidationRules = validationInstance.setValidationRules.bind(validationInstance);
export const clearError = validationInstance.clearError.bind(validationInstance);
export const resetErrors = validationInstance.resetErrors.bind(validationInstance);
export const setOnValidateStart = validationInstance.setOnValidateStart.bind(validationInstance);
export const setOnValidateEnd = validationInstance.setOnValidateEnd.bind(validationInstance);
export const setOnFieldValid = validationInstance.setOnFieldValid.bind(validationInstance);
export const setOnFieldInvalid = validationInstance.setOnFieldInvalid.bind(validationInstance);

*/

export default VValidate;
