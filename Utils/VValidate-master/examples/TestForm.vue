<script setup lang="ts">
import {ref} from 'vue';
import VValidate from "../index";

const formData = ref({
  emailField: '',
  phoneField: '',
  username: '',
  customField: '',
  isTestAsyncField: ''
});

// Messaggi dei validatori custom
const extraMessages = {
  is_test_async: 'Questo campo deve avere il valore "async"',
  custom_validator: 'Questo campo deve avere il valore "customValue"'
};
// Validatori custom
const customValidators = {
  custom_validator: () => (value: any) => value === 'customValue'
};
// Validatori async custom
const customAsyncValidators = {
  is_test_async: async (value: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.log('resolve is_test_async', value === 'async')
        resolve(value === 'async');
      }, 1000);
    });
  },
};
// Classe con i validatori aggiuntivi
const VV = new VValidate({
  lang: 'it',
  extraMessages: extraMessages,
  customValidators: customValidators,
  customAsyncValidators: customAsyncValidators,
  autoFocus: true
});

// Regole di validazione
const rules = {
  emailField: VV.generateRules({ email: true }),
  phoneField: VV.generateRules({ phone: true }),
  customField: VV.generateRules({ custom_validator: true }),
  username: VV.generateRules({ required: true }),
  isTestAsyncField: VV.generateRules({ required: true }),
};
// Regole di validazione asincrone
const asyncRules = {
  username: VV.generateAsyncRules({ uniqueUsername: formData.value.username }),
  isTestAsyncField: VV.generateAsyncRules({ is_test_async: formData.value.isTestAsyncField })
};
/** Aggiungo le regole di validazione alla classe
 *
 * In questo modo posso chiamare i metodi:
 * validateField('fieldname', value)
 * validateFormField('fieldname', formDataObject)
 * validateForm(formDataObject)
 *
 * In alternativa è possibile chiamare i metodi:
 * validateFormFieldWithRules('fieldName', formData, rulesObject, asyncRulesObject)
 * validateFormWithRules(formData, rulesObject, asyncRulesObject)
 *
 */
VV.setValidationRules(rules, asyncRules);

// Esempio di utilizzo callback
VV.setCallbacks({
  onValidateStart: (fieldName: string) => console.log(`onValidateStart: Inizio validazione campo: ${fieldName}`),
  onValidateEnd: (fieldName: string) => console.log(`onValidateEnd: Fine validazione campo: ${fieldName}`),
  onFieldValid: (fieldName: string) => console.log(`onFieldValid: Campo valido: ${fieldName}`),
  onFieldInvalid: (fieldName: string, message: string) => console.log(`onFieldInvalid: Campo non valido: ${fieldName}. Messaggio: ${message}`)
});

/** Metodo di supporto per la validazione
 *
 * In alternativa si può validare il singolo campo in questo modo:
 * @keyup="VV.validateField('fieldName', formData.fieldName)"
 *
 * @param fieldName
 */
const validateField = async (fieldName: string) => await VV.validateFormField(fieldName, formData.value);

// Invio del form e validazione
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  // Validazione
  await VV.validateForm(formData.value)
  if(VV.isFormValid()){
    console.log("Form valido")
  } else {
    VV.setFocusToFirstInvalidField(); // Imposta il focus sul primo campo con errore
  }
};

</script>

<template>

<!--  <div class="success" v-if="VV.isFormValid()">Form valido!</div>
  <div class="error" v-else>
    <p>Form non valido!</p>
    <ul>
      <template v-for="(value, name, index) in VV.getErrors()">
        <li class="error" v-if="value"><b>{{ name }}:</b> {{value}}</li>
      </template>
    </ul>
  </div>-->
  <form @submit.prevent="handleSubmit">

    <!-- Email Field -->
    <div class="field-container">
      <label for="emailField">Email Field:</label><br>
      <input type="text" id="emailField" v-model="formData.emailField" @keyup="VV.validateField('emailField', formData.emailField)" placeholder="Email Field"><br>
      <span v-if="VV.hasError('emailField')" class="error">{{ VV.getError('emailField') }}</span>
    </div>

    <!-- Phone Field -->
    <div class="field-container">
      <label for="phoneField">Phone Field:</label><br>
      <input type="text" id="phoneField" v-model="formData.phoneField" @keyup="validateField('phoneField')" placeholder="Phone Field"><br>
      <span v-if="VV.hasError('phoneField')" class="error">{{ VV.getError('phoneField') }}</span>
    </div>

    <!-- username -->
    <div class="field-container">
      <label for="username">Username univoco:</label><br>
      <input type="text" id="username" v-model="formData.username" @keyup="validateField('username')" placeholder="Username univoco"><br>
      <span v-if="VV.hasError('username')" class="error">{{ VV.getError('username') }}</span>
    </div>

    <!-- Custom Field -->
    <div class="field-container">
      <label for="customField">Custom Field:</label><br>
      <input type="text" id="customField" v-model="formData.customField" @keyup="validateField('customField')" placeholder="Custom Field"><br>
      <span v-if="VV.hasError('customField')" class="error">{{ VV.getError('customField') }}</span>
    </div>

    <!-- isTestAsyncField -->
    <div class="field-container">
      <label for="isTestAsyncField">Test Async:</label><br>
      <input type="text" id="isTestAsyncField" v-model="formData.isTestAsyncField" @keyup="validateField('isTestAsyncField')" placeholder="Test Async"><br>
      <span v-if="VV.hasError('isTestAsyncField')" class="error">{{ VV.getError('isTestAsyncField') }}</span>
    </div>

    <button type="submit">Valida form</button>
  </form>


</template>

<style>
.field-container{
  float:left;
  width: 100%;
  margin-bottom: 15px;

}
label{font-weight: bold;}
.error {
  color: red;
  padding: 5px;
}
.success {
  color: #3c9000;
  padding: 5px;
}
</style>
