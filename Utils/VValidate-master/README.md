VValidate
=========

La classe `VValidate` offre funzionalità per la validazione dei campi di un modulo.

Costruttore
-----------

    constructor(config?: VValidateConfig)

Costruisce un'istanza di `VValidate` con opzioni di configurazione opzionali.

### Parametri:

*   `config?: VValidateConfig`: Configurazione opzionale per la validazione.

Metodi Pubblici
---------------

### setValidationRules

    setValidationRules(validationRules?: ValidationRules, asyncValidationRules?: AsyncValidationRules): void

Imposta le regole di validazione sincrone e asincrone.

**Esempio:**

    const validator = new VValidate();
    validator.setValidationRules({
      username: [
        { validator: validator.validators.required(), message: 'Il nome utente è obbligatorio.' },
        { validator: validator.validators.min(3), message: 'Il nome utente deve contenere almeno 3 caratteri.' }
      ]
    });

### generateAsyncRules

    generateAsyncRules(rules: { [key: string]: any }): AsyncValidationRule[]

Genera le regole di validazione asincrone.

**Esempio:**

    const validator = new VValidate();
    const asyncRules = validator.generateAsyncRules({
      uniqueUsername: 'Il nome utente è già in uso.'
    });

### generateRules

    generateRules(rules: { [key: string]: any }): ValidationRule[]

Genera le regole di validazione sincrone.

**Esempio:**

    const validator = new VValidate();
    const rules = validator.generateRules({
      username: [
        { validator: validator.validators.required(), message: 'Il nome utente è obbligatorio.' },
        { validator: validator.validators.min(3), message: 'Il nome utente deve contenere almeno 3 caratteri.' }
      ]
    });

### validateFormFieldWithRules

    validateFormFieldWithRules(fieldName: string, formData: any, validationRules: ValidationRules, asyncValidationRules?: AsyncValidationRules | null): Promise

Valida un singolo campo del modulo con le regole specificate.

**Esempio:**

    const validator = new VValidate();
    await validator.validateFormFieldWithRules('username', formData, validationRules, asyncValidationRules);

### validateFormWithRules

    validateFormWithRules(formData: any, validationRules: ValidationRules, asyncValidationRules?: AsyncValidationRules | null): Promise

Valida tutti i campi del modulo con le regole specificate.

**Esempio:**

    const validator = new VValidate();
    const isValid = await validator.validateFormWithRules(formData, validationRules, asyncValidationRules);

### validateFormField

    validateFormField(fieldName: string, formData: any): Promise

Valida un singolo campo del modulo.

**Esempio:**

    const validator = new VValidate();
    await validator.validateFormField('username', formData);

### validateField

    validateField(fieldName: string, value: any): Promise

Valida un campo.

**Esempio:**

    const validator = new VValidate();
    await validator.validateField('username', value);

### validateForm

    validateForm(formData: any): Promise

Valida tutti i campi del modulo.

**Esempio:**

    const validator = new VValidate();
    const isValid = await validator.validateForm(formData);

### setCallbacks

    setCallbacks(callbacks: { [key: string]: Function }): void

Imposta i callback per gli eventi di validazione.

**Esempio:**

    const validator = new VValidate();
    validator.setCallbacks({
      onFieldValid: (fieldName: string) => console.log(`Il campo ${fieldName} è valido.`),
      onFieldInvalid: (fieldName: string, message: string) => console.error(`Errore nel campo ${fieldName}: ${message}`)
    });

### isInvalid

    isInvalid(fieldName: string): boolean

Verifica se un campo è non valido.

**Esempio:**

    const validator = new VValidate();
    const isInvalid = validator.isInvalid('username');

### hasError

    hasError(fieldName: string): boolean

Verifica se un campo ha un errore specifico.

**Esempio:**

    const validator = new VValidate();
    const hasError = validator.hasError('username');

### getErrors

    getErrors(): { [key: string]: string | null }

Restituisce tutti gli errori di validazione.

**Esempio:**

    const validator = new VValidate();
    const errors = validator.getErrors();

### getError

    getError(fieldName: string): string | null

Restituisce l'errore di un singolo campo.

**Esempio:**

    const validator = new VValidate();
    const error = validator.getError('username');

### clearError

    clearError(fieldName: string): void

Cancella l'errore di un campo specifico.

**Esempio:**

    const validator = new VValidate();
    validator.clearError('username');

### resetErrors

    resetErrors(): void

Resetta tutti gli errori.

**Esempio:**

    const validator = new VValidate();
    validator.resetErrors();

### setOnValidateStart

    setOnValidateStart(callback: Function): void

Imposta la funzione di callback per l'inizio della validazione del campo.

**Esempio:**

    const validator = new VValidate();
    validator.setOnValidateStart((fieldName: string) => console.log(`Inizio validazione campo: ${fieldName}`));

### setOnValidateEnd

    setOnValidateEnd(callback: Function): void

Imposta la funzione di callback per la fine della validazione del campo.

**Esempio:**

    const validator = new VValidate();
    validator.setOnValidateEnd((fieldName: string) => console.log(`Fine validazione campo: ${fieldName}`));

### setOnFieldValid

    setOnFieldValid(callback: Function): void

Imposta la funzione di callback per il campo valido.

**Esempio:**

    const validator = new VValidate();
    validator.setOnFieldValid((fieldName: string) => console.log(`Campo valido: ${fieldName}`));

### setOnFieldInvalid

    setOnFieldInvalid(callback: Function): void

Imposta la funzione di callback per il campo non valido.

**Esempio:**

    const validator = new VValidate();
    validator.setOnFieldInvalid((fieldName: string, message: string) => console.log(`Campo non valido: ${fieldName}. Messaggio: ${message}`));

### getValidators

    getValidators(): { [key: string]: any }

Restituisce tutti i validatori disponibili.

**Esempio:**

    const validator = new VValidate();
    const validators = validator.getValidators();

### getMessages

    getMessages(): { [key: string]: any }

Restituisce tutti i messaggi di validazione disponibili.

**Esempio:**

    const validator = new VValidate();
    const messages = validator.getMessages();

Proprietà
---------

*   `errors: { [key: string]: string | null }`: Oggetto contenente gli errori di validazione per ciascun campo.
*   `messages: { [key: string]: any }`: Oggetto contenente i messaggi di errore personalizzati.
*   `validators: { [key: string]: any }`: Oggetto contenente i validatori di campo.
*   `asyncValidators: { [key: string]: any }`: Oggetto contenente i validatori asincroni di campo.
*   `validationRules: ValidationRules | null`: Regole di validazione sincrone.
*   `asyncValidationRules: AsyncValidationRules | null`: Regole di validazione asincrone.
*   `autoFocus: boolean`: Indica se abilitare il focus automatico sul primo campo non valido.
*   `onValidateStart: Function | null`: Callback per l'inizio della validazione.
*   `onValidateEnd: Function | null`: Callback per la fine della validazione.
*   `onFieldValid: Function | null`: Callback per il campo valido.
*   `onFieldInvalid: Function | null`: Callback per il campo non valido.
*   `firstInvalidField: string | null`: Nome del primo campo non valido.

Utilizzo
--------

    import VValidate from 'VValidate';
    const validator = new VValidate();

Questa documentazione fornisce una panoramica delle funzionalità offerte dalla classe `VValidate`.