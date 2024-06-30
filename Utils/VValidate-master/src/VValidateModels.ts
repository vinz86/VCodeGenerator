/**
 * Regola di validazione sincrona.
 */
export interface ValidationRule {
    /**
     * Funzione di validazione sincrona.
     * @param {any} value - Valore da validare.
     * @param {any} [formData] - Dati del modulo.
     * @returns {boolean} - True se la validazione è superata, altrimenti false.
     */
    validator: (value: any, formData?: any) => boolean;

    /** Messaggio di errore associato alla regola di validazione. */
    message: string;
}

/**
 * Regole di validazione per i vari campi del form.
 */
export interface ValidationRules {
    /** Mappa dei nomi dei campi ai loro array di regole di validazione sincrone corrispondenti. */
    [fieldName: string]: ValidationRule[];
}

/**
 * Regola di validazione asincrona.
 */
export interface AsyncValidationRule {
    /**
     * Funzione di validazione asincrona.
     * @param {any} value - Valore da validare.
     * @param {any} [formData] - Dati del modulo.
     * @returns {Promise<boolean>} - Promise che risolve in true se la validazione è superata, altrimenti false.
     */
    validator: (value: any, formData?: any) => Promise<boolean>;

    /** Messaggio di errore associato alla regola di validazione asincrona. */
    message: string;
}

/**
 * Regole di validazione asincrone per i vari campi del form.
 */
export interface AsyncValidationRules {
    /** Mappa dei nomi dei campi ai loro array di regole di validazione asincrone corrispondenti. */
    [fieldName: string]: AsyncValidationRule[];
}

/**
 * Configurazione per la classe VValidate.
 */
export interface VValidateConfig {
    /** Messaggi aggiuntivi per la validazione. */
    extraMessages?: { [key: string]: any };

    /** Validatori personalizzati per la validazione sincrona. */
    customValidators?: { [key: string]: any };

    /** Validatori personalizzati per la validazione asincrona. */
    customAsyncValidators?: { [key: string]: any };

    /** Lingua o oggetto di traduzione per i messaggi di validazione. */
    lang?: string | { [key: string]: any };

    /** Abilita il focus automatico sul campo con errore. */
    autoFocus?: boolean;
}
