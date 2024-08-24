import type {
    TAsyncValidationRule,
    TAsyncValidationRules, TValidationRule,
    TValidationRules
} from "~/manager/ValidationManager/VValidateModels";

export interface IValidationManager {
    // Metodi pubblici
    setValidationRules(validationRules?: TValidationRules, asyncValidationRules?: TAsyncValidationRules): void;
    generateAsyncRules(rules: { [key: string]: any }): TAsyncValidationRule[];
    generateRules(rules: { [key: string]: any }): TValidationRule[];
    validateFormFieldWithRules(fieldName: string, formData: any, validationRules: TValidationRules, asyncValidationRules?: TAsyncValidationRules | null): Promise<void>;
    validateFormWithRules(formData: any, validationRules: TValidationRules, asyncValidationRules?: TAsyncValidationRules | null): Promise<boolean>;
    validateFormField(fieldName: string, formData: any): Promise<void>;
    validateField(fieldName: string, value: any): Promise<void>;
    validateForm(formData: any): Promise<boolean>;
    setFocusToFirstInvalidField(): void;
    isFormValid(): boolean;
    isInvalid(fieldName: string): boolean;
    getErrors(): { [key: string]: string | null };
    getError(fieldName: string): string | null;
    clearError(fieldName: string): void;
    resetErrors(): void;
    getValidators(): { [key: string]: any };
    getMessages(): { [key: string]: any };
    setCallbacks(callbacks: { [key: string]: Function }): void;

    // Funzioni di callback pubbliche
    setOnValidateStart(callback: Function): void;
    setOnValidateEnd(callback: Function): void;
    setOnFieldValid(callback: Function): void;
    setOnFieldInvalid(callback: Function): void;
}