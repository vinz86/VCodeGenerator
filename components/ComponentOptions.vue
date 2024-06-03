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

   <div>
     <h3>{{ options.name }} #ID:{{options.id}}</h3>
     <!-- Props -->
     <div v-for="(value, key) in options.props" :key="key" class="w-full form-group">
       <div v-if="key !== 'attrs' && key !== 'parentComponents'">
         <label :for="key">{{ key }}</label><br>
         <InputText v-model="options.props[key]" :id="key" class="w-full form-control" />
       </div>
     </div>
     <!-- Attrs -->
     <div class="flex align-content-center align-items-center">
       <h4>Attributi</h4>
       <Button text @click="toggleCustomAttrsForm"><i class="fa fa-plus-circle" /></Button>
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
     <!-- Aggiungo Custom Attrs -->
     <div class="form-group">
       <div v-if="showCustomAttrs">
         <h5>Nuovo attributo</h5>
         <div class="flex">
           <div class="flex-grow-1">
             <InputText v-model="newCustomAttrName" placeholder="Nome dell'attributo" class="w-full mb-1" />
             <InputText v-model="newCustomAttrValue" placeholder="Valore dell'attributo" class="w-full" />
           </div>
           <div class="flex-column">
             <Button rounded severity="success" @click="addCustomAttr" class="ml-3 flex-grow-1"><i class="fa fa-add font-bold" /></Button>
           </div>
         </div>
       </div>
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