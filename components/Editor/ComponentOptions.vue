<script setup lang="ts">
import {defineModel, type Ref} from 'vue';
import type { DroppableComponent } from '~/models/DroppableComponent';
import VValidate from "~/Utils/VValidate-master";

 const selectedComponent: Ref<DroppableComponent | undefined> = defineModel<DroppableComponent>('selectedComponent');
 
 let newCustomAttrName = ref('');
 let newCustomAttrValue = ref('');

 onMounted(()=>{
   if (selectedComponent.value) {
     if(!selectedComponent.value.props) return;

     selectedComponent.value.props.attrs = !selectedComponent.value.props.attrs ? {} : selectedComponent.value.props.attrs;
   }
 })

// validazione
const VV = new VValidate({ lang: 'it', autoFocus: true });
const rules = {
  newCustomAttrName: VV.generateRules({ string: true, required:true }),
  newCustomAttrValue: VV.generateRules({ string: true }),
};
VV.setValidationRules(rules, {});

 const addCustomAttr = async (event): void => {
   event.preventDefault();

   // Validazione
   await VV.validateForm({newCustomAttrName:newCustomAttrName.value, newCustomAttrValue:newCustomAttrValue.value});
   if(!VV.isFormValid()){
     VV.setFocusToFirstInvalidField(); // Imposta il focus sul primo campo con errore
     return;
   }

   if (selectedComponent.value) {
     if(newCustomAttrName.value?.trim().length > 0){
       selectedComponent.value.props.attrs[newCustomAttrName.value] = newCustomAttrValue.value;
     }
     newCustomAttrName.value = '';
     newCustomAttrValue.value = '';
   }
 };


const removeAttrs = (key: string) => {
  if(selectedComponent.value)
    delete selectedComponent.value.props.attrs[key];
};
 </script>

 <template>
   <div class="flex flex-column h-full">
     <div class="flex-grow-1 overflow-y-auto">
       <Panel  v-if="selectedComponent?.id" class="h-full" toggleable>
         <template #header>
           <i class="fa fa-cog" />&nbsp;<small>{{ selectedComponent.label || selectedComponent.name }} #ID:{{ selectedComponent.id }}</small>
         </template>
         <!-- Props -->
         <div v-for="(value, key) in selectedComponent.props" :key="key" class="w-full form-group">
           <div v-if="key !== 'attrs' && key !== 'parentComponents'">
             <label :for="`props-${key}`">{{ key }}</label><br>
             <InputText v-if="key !== 'style'" v-model="selectedComponent.props[key]" :id="`props-${key}`" class="w-full form-control" />
             <Textarea v-else v-model="selectedComponent.props[key]" :id="key" class="w-full form-control" />
           </div>
         </div>
         <!-- Attrs -->
         <div  v-if="selectedComponent.props && selectedComponent.props?.attrs && Object.keys(selectedComponent.props?.attrs)?.length>0" class="flex align-content-center align-items-center">
           <h4>Attributi</h4>
         </div>

         <div v-if="selectedComponent.props && selectedComponent.props?.attrs">
           <div v-for="(value, key) in selectedComponent.props.attrs" :key="key" class="w-full form-group">
             <label :for="`attrs-${key}`">{{ key }}</label><br>
             <div class="flex">
               <div class="flex-grow-1">
                 <InputText v-model="selectedComponent.props.attrs[key]" :id="`attrs-${key}`" class="w-full form-control" />
               </div>
               <div class="flex-none">
                 <Button severity="danger" outlined icon="fa fa-times" @click="removeAttrs(key)" class="ml-2" />
               </div>
             </div>
           </div>
         </div>
       </Panel>
     </div>
     <div class="flex-none" v-if="selectedComponent?.id">
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
               <InputText v-model="newCustomAttrName" @keyup="VV.validateField('newCustomAttrName', newCustomAttrName)" placeholder="Nome dell'attributo" class="w-full mb-1" />
               <InlineMessage v-if="VV.hasError('newCustomAttrName')" class="error">{{ VV.getError('newCustomAttrName') }}</InlineMessage>
             </div>
             <div class="col-12">
               <Textarea v-model="newCustomAttrValue" @keyup="VV.validateField('newCustomAttrValue', newCustomAttrValue)" placeholder="Valore dell'attributo" class="w-full" />
               <InlineMessage severity="danger" v-if="VV.hasError('newCustomAttrValue')" class="error">{{ VV.getError('newCustomAttrValue') }}</InlineMessage>
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