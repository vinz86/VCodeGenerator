<script setup lang="ts">
import {defineModel, type Ref} from 'vue';
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import {DIContainer} from "~/DIContainer/DIContainer";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {ComponentAttribute} from "~/models/types/ComponentAttribute";
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {IValidationManager} from "~/models/interfaces/IValidationManager";
import {ValidationManager} from "~/manager/ValidationManager/ValidationManager";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";
import JsonTextarea from "~/components/form/JsonTextarea.vue";

const emit = defineEmits(['update:selectedComponent'])
//TODO: spostare nelle config
const optionsToShow: Readonly<string[]> = ['className', 'inner', 'style', 'id', 'order'];

const validationService = DIContainer.getService<IValidationManager>(EServiceKeys.ValidationManager);
const factoryProvider: ComponentFactoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
const componentFactory: ComponentFactory = factoryProvider.getFactory(EComponentTypes.PrimeVue);

const selectedComponent: Ref<IComponentFactory | undefined> = defineModel<IComponentFactory>('selectedComponent');
const components: Ref<IComponentFactory[] | undefined> = defineModel<IComponentFactory[]>('components');
const newCustomAttr: Ref<ComponentAttribute<ECustomAttributesType>> = ref({} as ComponentAttribute<ECustomAttributesType>);

const newCustomAttrTypes: Ref<{key:string, value:ECustomAttributesType}[]> = ref([
  { key: 'String', value: ECustomAttributesType.STRING },
  { key: 'Number', value: ECustomAttributesType.NUMBER },
  { key: 'Object', value: ECustomAttributesType.OBJECT },
  { key: 'Boolean', value: ECustomAttributesType.BOOLEAN },
]);

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
  //if (!await validateNewCustomAttr()) return;
  if (selectedComponent.value.options) {

    selectedComponent.value.options['attributes'] = selectedComponent.value.options.attributes || {};
    if(newCustomAttr.value?.name?.trim().length > 0){
      debugger

      if (newCustomAttr.value?.type === ECustomAttributesType.OBJECT){
        try{
          let valueStr = newCustomAttr.value.value;

          if (typeof valueStr === 'string') {
            valueStr = valueStr.replaceAll(/(\w+):/g, '"$1":').replaceAll(/'/g, '"');
            newCustomAttr.value['value'] = JSON.parse(valueStr);// eval('(' + valueStr + ')');
          } else {
            newCustomAttr.value['value'] = newCustomAttr.value.value || {};
          }
        } catch (e) {  }
      } else if (newCustomAttr.value?.type === ECustomAttributesType.NUMBER){
        try{
          newCustomAttr.value['value'] = newCustomAttr.value?.value ? parseInt(newCustomAttr.value.value) : null;
        } catch (e) {  }
      } else if (newCustomAttr.value?.type === ECustomAttributesType.BOOLEAN){
        try{
          newCustomAttr.value['value'] = (newCustomAttr.value['value'] && (newCustomAttr.value?.value.toLowerCase() === 'true' || parseInt(newCustomAttr.value?.value) === 1));
        } catch (e) {  }
      }
      const newAttributes: ComponentAttribute<string | number | boolean | object> = {
        ...selectedComponent.value.options?.attributes,
        [newCustomAttr.value?.name]: newCustomAttr.value?.value
      };
      selectedComponent.value = componentFactory.updateElement(selectedComponent.value, { attributes: newAttributes })
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
       <Panel  v-if="selectedComponent?.options" class="h-full" toggleable>
         <template #header>
           <i class="fa fa-cog" />&nbsp;<small>{{ selectedComponent?.options?.tag }} {{ selectedComponent?.options?.id }}</small>
         </template>
         <!-- Options -->
<!--         <div class="w-full">
           <div>
             <label for="option-id">id</label><br>
             <InputText
                 :disabled="true"
                 v-model="selectedComponent.options.id"
                 id="option-id"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
           </div>
           <div>
             <label for="option-class">class: {{selectedComponent.options.className}}</label><br>
             <InputText
                 v-model="selectedComponent.options.className"
                 id="option-class"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
           </div>
           <div>
             <label for="option-style">style</label><br>
             <Textarea
                 v-model="selectedComponent.options.style"
                 id="option-style"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
           </div>
           <div>
             <label for="option-inner">inner</label><br>
             <InputText
                 v-model="selectedComponent.options.inner"
                 id="option-inner"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
           </div>
         </div>-->

         <div v-for="(value, key) of selectedComponent?.options" :key="key" class="w-full">
           <div v-if="optionsToShow.includes(key)">
             <label :for="`props-${key}`">{{ key }}</label><br>
             <InputText
                 :disabled="key==='id'"
                 v-if="key !== 'style' && key !== 'style'"
                 v-model="selectedComponent.options[key]"
                 :id="`props-${key}`"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
             <Textarea
                 v-else
                 v-model="selectedComponent.options[key]"
                 :id="`props-${key}`"
                 class="w-full form-control"
                 @change="emit('update:selectedComponent', selectedComponent)"
             />
           </div>
         </div>

        <!-- Attrs -->
         <div v-if="selectedComponent.options?.attributes" class="flex align-content-center align-items-center">
           <h4>Attributi</h4>
         </div>
         <div>

         <div>
           <div v-for="(value, key) of selectedComponent.options?.attributes" :key="key" class="w-full form-group">
           <label :for="`attrs-${key}`">{{ key }}</label><br>
             <div class="flex">
                 <div class="flex-grow-1">
                   <InputText
                       v-if="typeof selectedComponent.options.attributes[key] === 'string'"
                       :disabled="selectedComponent.options.attributes[key] === 'type'"
                       v-model="selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       class="w-full form-control"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   />
                   <InputNumber
                       v-else-if="typeof selectedComponent.options.attributes[key] === 'number'"
                       :disabled="selectedComponent.options.attributes[key] === 'type'"
                       v-model="selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       class="w-full form-control"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   />
                   <Checkbox
                       v-else-if="typeof selectedComponent.options.attributes[key] === 'boolean'"
                       v-model="selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       :binary="true"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   />
<!--                   <Textarea
                       v-else-if="typeof selectedComponent.options.attributes[key] === 'object'"
                       variant="j"
                       v-model="selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       @focus="JSON.stringify(selectedComponent.options.attributes[key])"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   ></Textarea>-->
                   <JsonTextarea
                       v-else-if="typeof selectedComponent.options.attributes[key] === 'object'"
                       variant="j"
                       v-model="selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       @focus="JSON.stringify(selectedComponent.options.attributes[key])"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   ></JsonTextarea>

                 </div>
                 <div class="flex-none">
                   <Button
                       :disabled="selectedComponent.options.attributes[key] === 'type'"
                       severity="danger"
                       outlined
                       icon="fa fa-times"
                       @click="removeAttrs(key?.toString())"
                       class="ml-2"
                   />
                 </div>
               </div>
             </div>
           </div>
         </div>
       </Panel>
     </div>


     <div class="flex-none" v-if="selectedComponent?.options">
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
               <Select v-model="newCustomAttr.type" :options="newCustomAttrTypes" optionLabel="key" optionValue="value" placeholder="Tipo" class="w-full md:w-56" />
                <InputText v-model="newCustomAttr.name" @keyup="validationService.validateField('newCustomAttrName', newCustomAttr.name)" placeholder="Nome dell'attributo" class="w-full mb-1" />

                 <Textarea v-model="newCustomAttr.value" @keyup="validationService.validateField('newCustomAttr.value', newCustomAttr.value)" placeholder="Valore dell'attributo" class="w-full" />
<!--               <InlineMessage class="error">{{ validationService.getError('newCustomAttrName') }}</InlineMessage>-->
             </div>
<!--             <div class="col-12">
               <InputText v-model="newCustomAttr.name" @keyup="validationService.validateField('newCustomAttrName', newCustomAttr.name)" placeholder="Nome dell'attributo" class="w-full mb-1" />
               <InlineMessage class="error">{{ validationService.getError('newCustomAttrName') }}</InlineMessage>
             </div>
             <div class="col-12">
               <Textarea v-model="newCustomAttr.value" @keyup="validationService.validateField('newCustomAttr.value', newCustomAttr.value)" placeholder="Valore dell'attributo" class="w-full" />
               <InlineMessage severity="danger" class="error">{{ validationService.getError('newCustomAttrValue') }}</InlineMessage>
             </div>-->
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