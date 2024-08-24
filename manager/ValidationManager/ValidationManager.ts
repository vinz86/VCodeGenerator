import { reactive } from 'vue';
import messages from "~/manager/ValidationManager/messages";
import type { TValidationConfig } from "~/models/types/TValidationConfig";
import type { IValidationManager } from "~/manager/ValidationManager/VValidateModels";
import type { TValidationRule } from "~/manager/ValidationManager/VValidateModels";

export class ValidationManager implements IValidationManager {
    private errors = reactive<{ [key: string]: string | null }>({});
    private readonly messages: { [key: string]: any };
    private readonly validators: { [key: string]: any };
    private readonly asyncValidators: { [key: string]: any };
    private validationRules: TValidationRule[] | null = null;
    private asyncValidationRules: TValidationRule[] | null = null;

    private onValidateStart: Function | null = null;
    private onValidateEnd: Function | null = null;
    private onFieldValid: Function | null = null;
    private onFieldInvalid: Function | null = null;

    private firstInvalidField: string | null = null;
    public readonly autoFocus: boolean;

    constructor(config?: TValidationConfig) {
        const { extraMessages = {}, customValidators = {}, customAsyncValidators = {}, autoFocus = true } = config || {};
        this.messages = { ...messages, ...extraMessages };
        this.validators = this.initializeValidators(customValidators);
        this.asyncValidators = this.initializeAsyncValidators(customAsyncValidators);
        this.autoFocus = autoFocus;
    }

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

    private initializeAsyncValidators(customAsyncValidators: any) {
        return {
            ...customAsyncValidators
        };
    }

    public setValidationRules(validationRules?: TValidationRule[], asyncValidationRules?: TValidationRule[]): void {
        this.validationRules = validationRules || this.validationRules;
        this.asyncValidationRules = asyncValidationRules || this.asyncValidationRules;
    }

    public generateAsyncRules(rules: { [key: string]: any }): TValidationRule[] {
        return Object.entries(rules).map(([key, value]) => {
            const asyncValidator = this.asyncValidators[key];
            if (!asyncValidator) {
                throw new Error(`Validatore asincrono per la chiave "${key}" non trovato.`);
            }
            return {
                validator: async (val: any, formData?: any) => await asyncValidator(val, formData),
                message: typeof this.messages[key] === 'function' ? this.messages[key](value) : this.messages[key]
            };
        });
    }

    public generateRules(rules: { [key: string]: any }): TValidationRule[] {
        return Object.entries(rules).map(([key, value]) => {
            const validator = this.validators[key];
            if (!validator) {
                throw new Error(`Validatore per la chiave "${key}" non trovato.`);
            }
            return {
                validator: validator(value),
                message: typeof this.messages[key] === 'function' ? this.messages[key](value) : this.messages[key]
            };
        });
    }

    private async runAsyncValidators(fieldName: string, value: any, asyncRules: TValidationRule[], formData?: any) {
        const promises = asyncRules.map(rule => rule.validator(value, formData));
        try {
            const results = await Promise.all(promises);
            for (let i = 0; i < results.length; i++) {
                if (!results[i]) {
                    this.setError(fieldName, asyncRules[i].message);
                    this.setFirstInvalidField(fieldName);
                    this.triggerCallback(this.onFieldInvalid, fieldName, asyncRules[i].message);
                    return;
                }
            }
        } catch (error) {
            console.error(`Errore nell'esecuzione del validatore asincrono per il campo ${fieldName}:`, error);
            this.setError(fieldName, 'Si è verificato un errore durante la validazione.');
            return;
        }
        this.clearError(fieldName);
        this.triggerCallback(this.onFieldValid, fieldName);
    }

    public async validateFormFieldWithRules(fieldName: string, formData: any, validationRules: TValidationRule[], asyncValidationRules?: TValidationRule[] | null): Promise<void> {
        const value = formData[fieldName];
        const fieldRules = validationRules ? this.generateRules(validationRules[parseInt(fieldName)]) : [];
        const asyncRules = asyncValidationRules ? this.generateAsyncRules(asyncValidationRules[parseInt(fieldName)]) : [];

        if (!fieldRules.length && !asyncRules.length) return;

        this.triggerCallback(this.onValidateStart, fieldName);

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

        if (asyncRules.length) {
            await this.runAsyncValidators(fieldName, value, asyncRules, formData);
        } else {
            this.clearError(fieldName);
        }

        if (this.errors[fieldName] === null) {
            this.triggerCallback(this.onFieldValid, fieldName);
        }

        this.triggerCallback(this.onValidateEnd, fieldName);
    }

    public async validateFormWithRules(formData: any, validationRules: TValidationRule[], asyncValidationRules?: TValidationRule[] | null): Promise<boolean> {
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

    public async validateFormField(fieldName: string, formData: any): Promise<void> {
        if (!this.validationRules) {
            throw new Error('Regole di validazione non impostate. Utilizzare setValidationRules() per impostare le regole di validazione.');
        }
        await this.validateFormFieldWithRules(fieldName, formData, this.validationRules, this.asyncValidationRules);
    }

    public async validateField(fieldName: string, value: any): Promise<void> {
        const formData = { [fieldName]: value };
        await this.validateFormField(fieldName, formData);
    }

    public async validateForm(formData: any): Promise<boolean> {
        if (!this.validationRules) {
            throw new Error('Regole di validazione non impostate. Utilizzare setValidationRules() per impostare le regole di validazione.');
        }
        return await this.validateFormWithRules(formData, this.validationRules, this.asyncValidationRules);
    }

    private setFirstInvalidField(fieldName: string) {
        if (this.autoFocus && this.errors[fieldName] && !this.firstInvalidField) {
            this.firstInvalidField = fieldName;
        }
    }

    public setFocusToFirstInvalidField() {
        if (this.firstInvalidField && this.autoFocus) {
            const element = document.querySelector(`[name="${this.firstInvalidField}"]`);
            if (element) {
                (element as HTMLElement).focus();
            }
        }
    }

    public isFormValid(): boolean {
        return Object.values(this.errors).every(x => x === null);
    }

    public isValid(fieldName: string): boolean {
        return !this.errors[fieldName];
    }

    public getErrors() {
        return this.errors;
    }

    public getError(fieldName: string): string | null {
        return this.errors[fieldName];
    }

    public clearError(fieldName: string): void {
        this.errors[fieldName] = null;
        if (this.firstInvalidField === fieldName) {
            this.firstInvalidField = null;
        }
    }

    public resetErrors(): void {
        for (const fieldName in this.errors) {
            this.errors[fieldName] = null;
        }
        this.firstInvalidField = null;
    }

    private setError(fieldName: string, message: string | null) {
        this.errors[fieldName] = message;
    }

    public setCallbacks(callbacks: { onValidateStart?: Function, onValidateEnd?: Function, onFieldValid?: Function, onFieldInvalid?: Function }) {
        this.onValidateStart = callbacks.onValidateStart || null;
        this.onValidateEnd = callbacks.onValidateEnd || null;
        this.onFieldValid = callbacks.onFieldValid || null;
        this.onFieldInvalid = callbacks.onFieldInvalid || null;
    }

    private triggerCallback(callback: Function | null, ...args: any[]) {
        if (callback) {
            callback(...args);
        }
    }

    public setOnValidateStart(callback: Function): void {
        this.onValidateStart = callback;
    }

    public setOnValidateEnd(callback: Function): void {
        this.onValidateEnd = callback;
    }

    public setOnFieldValid(callback: Function): void {
        this.onFieldValid = callback;
    }

    public setOnFieldInvalid(callback: Function): void {
        this.onFieldInvalid = callback;
    }
}