<script setup lang="ts">
import {defineModel, type Ref} from 'vue';
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import {DIContainer} from "~/DIContainer/DIContainer";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {TComponentAttribute} from "~/models/types/TComponentAttribute";
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";
import DialogManager from "~/manager/DialogManager";
import InputByType from "~/components/form/InputByType.vue";

const emit = defineEmits(['update:selectedComponent']);

const bind_checked = ref();

//TODO: spostare nelle config
const optionsToShow: Readonly<string[]> = ['className', 'inner', 'style', 'id', 'order'];

const factoryProvider: ComponentFactoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
const componentFactory: ComponentFactory = factoryProvider.getFactory(EComponentTypes.PrimeVue);
const selectedComponent: Ref<IComponentFactory | undefined> = defineModel<IComponentFactory>('selectedComponent');
const components: Ref<IComponentFactory[] | undefined> = defineModel<IComponentFactory[]>('components');
const newCustomAttr: Ref<TComponentAttribute<ECustomAttributesType>> = ref({} as TComponentAttribute<ECustomAttributesType>);

const newCustomAttrTypes: Ref<{key:string, value:ECustomAttributesType}[]> = ref([
  { key: 'String', value: ECustomAttributesType.STRING },
  { key: 'Number', value: ECustomAttributesType.NUMBER },
  { key: 'Object', value: ECustomAttributesType.OBJECT },
  { key: 'Boolean', value: ECustomAttributesType.BOOLEAN },
]);

const addCustomAttr = async (event): Promise<void> => {
  event.preventDefault();

  if (selectedComponent.value.options) {

    selectedComponent.value.options['attributes'] = selectedComponent.value.options.attributes || {};
    if(newCustomAttr.value?.name?.trim().length > 0){
      const newAttributes: TComponentAttribute<string | number | boolean | object> = {
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
    let newAttributes: TComponentAttribute<string> = selectedComponent.value.options.attributes;
    delete newAttributes[key];

    selectedComponent.value = componentFactory.updateElement(selectedComponent.value, { attributes: newAttributes})
  }
};

 </script>

 <template>
   <div class="flex flex-column h-full" id="component-options-wrapper">
     <div class="flex-grow-1 overflow-y-auto">
       <Panel  v-if="selectedComponent?.options" class="h-full" toggleable>
         <template #header>
           <div class="text-left"><i class="fa fa-cog" />&nbsp;{{ selectedComponent?.options?.tag }} {{ selectedComponent?.options?.id }}</div>
         </template>

         <div v-for="(value, key) of selectedComponent?.options" :key="key" class="w-full">
           <div v-if="optionsToShow.includes(key)">
             <label cla :for="`props-${key}`">{{ key }}</label><br>
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
           <div v-for="(value, key) of selectedComponent.options?.attributes" :key="key" class="w-full form-group">

             <div class="w-full">
               <div class="field grid">
                 <span  class="col-fixed font-normal text-overflow-ellipsis overflow-hidden" style="width:25%; text-align:right">
                   {{ key }}
<!--                 <ToggleButton onIcon="pi pi-check-circle" offIcon="pi pi-circle" class="w-full p-0" size="small" v-model="bind_checked" :onLabel="key" :offLabel="key" s />-->

                 </span>
                 <div class="flex justify-content-between col">

                   <InputByType
                       v-model="selectedComponent.options.attributes[key]"
                       :type="typeof selectedComponent.options.attributes[key]"
                       :id="`attr-${key}`"
                       :key="key"
                       :size="small"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   />
                   <div>

                     B
                     <Checkbox
                         :disabled="typeof selectedComponent.options.attributes[key] !== ECustomAttributesType.STRING"
                         :binary="true"
                     />
                   </div>

<!--                   <Button
                       text
                       :disabled="selectedComponent.options.attributes[key] === 'type'"
                       severity="danger"
                       outlined
                       icon="fa fa-times"
                       @click="removeAttrs(key?.toString())"
                   />-->
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
               <Button outlined severity="success" @click="addCustomAttr" class="ml-3 flex-grow-1 font-bold" size="small" icon="fa fa-save" label="Aggiungi" />
             </div>
           </div>
           <div class="grid">
             <div class="col-12">
               <div class="field grid">
                 <span  class="col-fixed font-normal text-overflow-ellipsis overflow-hidden" style="width:25%; text-align:right">Type:&nbsp;</span>
                 <div class="flex justify-content-between col">
                   <Select v-model="newCustomAttr.type" :options="newCustomAttrTypes" optionLabel="key" optionValue="value" placeholder="Tipo" class="w-full md:w-56" />
                 </div>
               </div>

               <div class="field grid">
                 <span  class="col-fixed font-normal text-overflow-ellipsis overflow-hidden" style="width:25%; text-align:right">Label:&nbsp;</span>
                 <div class="flex justify-content-between col">
                   <InputText v-model="newCustomAttr.name" placeholder="Nome dell'attributo" class="w-full mb-1" />
                 </div>
               </div>

               <div class="field grid" v-if="newCustomAttr.type">
                 <span  class="col-fixed font-normal text-overflow-ellipsis overflow-hidden" style="width:25%; text-align:right">Value:&nbsp;</span>
                 <div class="flex justify-content-between col">
                   <InputByType
                       v-model="newCustomAttr.value"
                       :type="newCustomAttr.type"
                       @change="emit('update:selectedComponent', selectedComponent)"
                   />
               </div>
             </div>


<!--             TODO: Aggiungere validazione-->
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