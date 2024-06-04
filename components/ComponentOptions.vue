 <script setup>
 import { defineModel } from 'vue';

 const options = defineModel({
   modelValue: Object,
   emits: ['update:modelValue']
 });

 let showCustomAttrs = ref(false);
 let newCustomAttrName = ref('');
 let newCustomAttrValue = ref('');

 onMounted(()=>{
   if (!options.value.props.attrs) {
     options.value.props.attrs = {};
   }
 })

 const toggleCustomAttrsForm = () => {
   showCustomAttrs.value = !showCustomAttrs.value;
 };

 const addCustomAttr = () => {
   options.value.props.attrs[newCustomAttrName.value] = newCustomAttrValue.value;
   newCustomAttrName.value = '';
   newCustomAttrValue.value = '';
   //showCustomAttrs.value = false;
 };
 const removeAttrs = (key) => {
   delete options.value.props.attrs[key];
 };
 </script>

 <template>
   <div class="flex flex-column h-full">
     <div class="flex-grow-1 overflow-y-auto">
       <Panel class="h-full" toggleable>
         <template #header>
           <i class="fa fa-cog" />&nbsp;<small>{{ options.label || options.name }} #ID:{{ options.id }}</small>
         </template>
         <!-- Props -->
         <div v-for="(value, key) in options.props" :key="key" class="w-full form-group">
           <div v-if="key !== 'attrs' && key !== 'parentComponents'">
             <label :for="key">{{ key }}</label><br>
             <InputText v-if="key !== 'style'" v-model="options.props[key]" :id="key" class="w-full form-control" />
             <Textarea v-else v-model="options.props[key]" :id="key" class="w-full form-control" />
           </div>
         </div>
         <!-- Attrs -->
         <div class="flex align-content-center align-items-center">
           <h4>Attributi</h4>
         </div>

         <div v-if="options.props && options.props.attrs">
           <div v-for="(value, key) in options.props.attrs" :key="key" class="w-full form-group">
             <label :for="key">{{ key }}</label><br>
             <InputGroup>

               <InputText v-model="options.props.attrs[key]" :id="'input'+key" class="w-full form-control" />
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