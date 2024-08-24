<script setup lang="ts">
import {defineModel, type Ref} from 'vue';
import type {IComponent} from "~/models/interfaces/IComponent";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {ComponentAttribute} from "~/models/types/ComponentAttribute";
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {IValidationManager} from "~/models/interfaces/IValidationManager";
import {ValidationManager} from "~/manager/ValidationManager/ValidationManager";

//TODO: spostare nelle config
const optionsToShow: Readonly<string[]> = ['class', 'inner', 'style', 'id'];

const validationService = new ValidationManager({}) //DIContainer.getService<IValidationManager>(EServiceKeys.ValidationManager);
const factoryProvider: ComponentFactoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
const componentFactory: ComponentFactory = factoryProvider.getFactory(EComponentTypes.PrimeVue);

const selectedComponent: Ref<IComponent | undefined> = defineModel<IComponent>('selectedComponent');
const components: Ref<IComponent[] | undefined> = defineModel<IComponent[]>('components');
let newCustomAttr: Ref<ComponentAttribute<string>> = ref({} as ComponentAttribute<string>);

// validazione
const rules = {
  newCustomAttrName: validationService.generateRules({ string: true, required:true }),
  newCustomAttrValue: validationService.generateRules({ string: true }),
};
validationService.setValidationRules(rules, {});

const validateNewCustomAttr = async () => {
  await validationService.validateForm({newCustomAttrName:newCustomAttr.value?.name, newCustomAttrValue:newCustomAttr.value?.value});
  if(!validationService.isFormValid()){
    validationService.setFocusToFirstInvalidField(); // Imposto il focus sul primo campo con errore
    return false;
  }
  return true;
}

const addCustomAttr = async (event): Promise<void> => {
  event.preventDefault();
  
  // Validazione
  if (!validateNewCustomAttr()) return;
  
  if (selectedComponent.value) {
    if(newCustomAttr.value?.name?.trim().length > 0){
      selectedComponent.value = componentFactory.updateElement(selectedComponent.value, {
        attributes: {
          ...selectedComponent.value.options.attributes,
          [newCustomAttr.value?.name]: newCustomAttr.value?.value
        }
      })
      newCustomAttr.value = {};
    }
  }
};

const removeAttrs = (key: string) => {
  if(selectedComponent.value){
    let newAttributes: ComponentAttribute<string> = selectedComponent.value.options.attributes;
    delete newAttributes[key];

    selectedComponent.value = componentFactory.updateElement(selectedComponent.value, { attributes: newAttributes})
  }
};
 </script>

 <template>
   <div class="flex flex-column h-full">
     <div class="flex-grow-1 overflow-y-auto">
       <Panel  v-if="selectedComponent?.options?.id" class="h-full" toggleable>
         <template #header>
           <i class="fa fa-cog" />&nbsp;<small>{{ selectedComponent?.options?.label || selectedComponent?.options?.name }} #ID:{{ selectedComponent?.options?.id }}</small>
         </template>
         <!-- Options -->
         <div v-for="(value, key) in selectedComponent?.options" :key="key" class="w-full">
           <div v-if="optionsToShow.includes(key)">
             <label :for="`props-${key}`">{{ key }}</label><br>
             <InputText
                 v-if="key !== 'style'"
                 v-model="selectedComponent.options[key]"
                 :id="`props-${key}`"
                 class="w-full form-control"
             />
             <Textarea
                 v-else
                 v-model="selectedComponent.options[key]"
                 :id="`props-${key}`"
                 class="w-full form-control"
             />
           </div>
         </div>

        <!-- Attrs -->
         <div  v-if="selectedComponent?.options?.attributes && Object.keys(selectedComponent?.options?.attributes)?.length>0" class="flex align-content-center align-items-center">
           <h4>Attributi</h4>
         </div>
         <div v-if="selectedComponent?.options?.attributes">
           <div v-for="(value, key) in selectedComponent?.options?.attributes" :key="key" class="w-full form-group">
             <label :for="`attrs-${key}`">{{ key }}</label><br>
             <div class="flex">
               <div class="flex-grow-1">
                 <InputText
                     :disabled="selectedComponent.options.attributes[key]=='type'"
                     v-model="selectedComponent.options.attributes[key]"
                     :id="`attr-${key}`"
                     class="w-full form-control"
                 />
               </div>
               <div class="flex-none">
                 <Button :disabled="selectedComponent.options.attributes[key]=='type'"
                         severity="danger" outlined icon="fa fa-times" @click="removeAttrs(key?.toString())" class="ml-2" />
               </div>
             </div>
           </div>
         </div>
       </Panel>
     </div>
     <div class="flex-none" v-if="selectedComponent?.options?.id">
       <Panel toggleable collapsed>
         <template #header>
           <i class="fa fa-plus-circle" />&nbsp<small>Attributi personalizzati</small>
         </template>
         <div class="form-group">
           <div class="flex align-content-center align-items-center">
             <div class="flex-grow-1">
               <h5>Nuovo attributo</h5>
             </div>
             <div class="flex-column">
               <Button outlined severity="success" @click="addCustomAttr" class="ml-3 flex-grow-1 font-bold" size="small" icon="fa fa-save" />
             </div>
           </div>
           <div class="grid">
             <div class="col-12">
               <InputText v-model="newCustomAttr.name" @keyup="validationService.validateField('newCustomAttrName', newCustomAttr.name)" placeholder="Nome dell'attributo" class="w-full mb-1" />
               <InlineMessage v-if="validationService.isValid('newCustomAttrName')" class="error">{{ validationService.getError('newCustomAttrName') }}</InlineMessage>
             </div>
             <div class="col-12">
               <Textarea v-model="newCustomAttr.value" @keyup="validationService.validateField('newCustomAttr.value', newCustomAttr.value)" placeholder="Valore dell'attributo" class="w-full" />
               <InlineMessage severity="danger" v-if="validationService.isValid('newCustomAttrValue')" class="error">{{ validationService.getError('newCustomAttrValue') }}</InlineMessage>
             </div>
           </div>

         </div>
       </Panel>
     </div>

   </div>
 </template>

 <style scoped>
 .form-group {
   margin-bottom: 10px;
 }

 label {
   font-weight: bold;
 }
 </style>