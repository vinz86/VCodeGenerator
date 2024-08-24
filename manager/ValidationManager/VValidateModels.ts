export interface IValidationManager {
    // Proprietà per gestire il focus automatico sui campi non validi
    readonly autoFocus: boolean;

    // Metodo per impostare le regole di validazione
    setValidationRules(validationRules?: TValidationRule[], asyncValidationRules?: TValidationRule[]): void;

    // Metodo per generare le regole di validazione sincrone
    generateRules(rules: { [key: string]: any }): TValidationRule[];

    // Metodo per generare le regole di validazione asincrone
    generateAsyncRules(rules: { [key: string]: any }): TValidationRule[];

    // Metodo per validare un campo del modulo con le regole specificate
    validateFormFieldWithRules(fieldName: string, formData: any, validationRules: TValidationRule[], asyncValidationRules?: TValidationRule[] | null): Promise<void>;

    // Metodo per validare un campo del modulo
    validateFormField(fieldName: string, formData: any): Promise<void>;

    // Metodo per validare un campo specifico
    validateField(fieldName: string, value: any): Promise<void>;

    // Metodo per validare l'intero modulo
    validateForm(formData: any): Promise<boolean>;

    // Metodo per verificare se il modulo è valido
    isFormValid(): boolean;

    // Metodo per verificare se un campo specifico è valido
    isValid(fieldName: string): boolean;

    // Metodo per ottenere tutti gli errori di validazione
    getErrors(): { [key: string]: string | null };

    // Metodo per ottenere l'errore di un campo specifico
    getError(fieldName: string): string | null;

    // Metodo per cancellare l'errore di un campo specifico
    clearError(fieldName: string): void;

    // Metodo per resettare tutti gli errori
    resetErrors(): void;

    // Metodo per impostare i callback per eventi di validazione
    setCallbacks(callbacks: { onValidateStart?: Function, onValidateEnd?: Function, onFieldValid?: Function, onFieldInvalid?: Function }): void;

    // Metodo per impostare il callback per l'inizio della validazione
    setOnValidateStart?(callback: Function): void;

    // Metodo per impostare il callback per la fine della validazione
    setOnValidateEnd?(callback: Function): void;

    // Metodo per impostare il callback quando un campo diventa valido
    setOnFieldValid?(callback: Function): void;

    // Metodo per impostare il callback quando un campo diventa non valido
    setOnFieldInvalid?(callback: Function): void;

    // Metodo per spostare il focus sul primo campo non valido
    setFocusToFirstInvalidField(): void;
}


export type ValidationResult = boolean | Promise<boolean>;

export interface TValidationRule {
    validator: (value: any, formData?: any) => ValidationResult;
    message: string;
}
