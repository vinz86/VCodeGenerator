<script setup lang="ts">
import {defineModel, type Ref} from 'vue';
import type { DroppableComponent } from '~/models/DroppableComponent';

 const selectedComponent: Ref<DroppableComponent | undefined> = defineModel<DroppableComponent>('selectedComponent');
 
 let newCustomAttrName = ref('');
 let newCustomAttrValue = ref('');

 onMounted(()=>{
   if (selectedComponent.value) {
     if(!selectedComponent.value.props)
       return;

     selectedComponent.value.props.attrs = !selectedComponent.value.props.attrs ? {} : selectedComponent.value.props.attrs;

   }
 })

 const addCustomAttr = (): void => {
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
         <div class="flex align-content-center align-items-center">
           <h4>Attributi</h4>
         </div>

         <div v-if="selectedComponent.props && selectedComponent.props?.attrs">
           <div v-for="(value, key) in selectedComponent.props.attrs" :key="key" class="w-full form-group">
             <label :for="`attrs-${key}`">{{ key }}</label><br>
             <InputGroup>

               <InputText v-model="selectedComponent.props.attrs[key]" :id="`attrs-${key}`" class="w-full form-control" />
               <InputGroupAddon>
                 <Button severity="danger" icon="fa fa-times" @click="removeAttrs(key)" />
               </InputGroupAddon>
             </InputGroup>
           </div>
         </div>
       </Panel>
     </div>
     <div class="flex-none">
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
           <InputText v-model="newCustomAttrName" placeholder="Nome dell'attributo" class="w-full mb-1" />
           <Textarea v-model="newCustomAttrValue" placeholder="Valore dell'attributo" class="w-full" />
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