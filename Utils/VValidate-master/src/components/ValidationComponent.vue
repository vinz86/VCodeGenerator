<script setup lang="ts">
import { ref } from 'vue';
import VValidate from "~/Utils/VValidate/src/VValidate";
import type {Ref} from "vue";

const model = ref('');
const attributes = defineModel();

const props = defineProps({
  fieldName: { type: String, required: true },
  fieldType: { type: String, required: true },
  placeholder: { type: String, default: '' },
  validationRules: { type: Object, required: false },
  validator: { type: Object, default: {}, required: false },
});

const VV: VValidate = props.validator

function handleInput(event) {
  const value = event.target.value;
  model.value = value;
  VV.validateFormFieldWithRules(props.fieldName, value, props.validationRules);
}

function formatErrorMessage(message) {
  return typeof message === 'object' ? Object.values(message)[0] : message;
}
</script>

<template>
  <div>
    <component
        v-bind="attributes"
        :is="fieldType"
        v-model="model"
        :class="{ 'p-invalid': VV.hasError(fieldName) }"
        @input="handleInput"
    />
    <br>
    <InlineMessage severity="error" v-if="VV.hasError(fieldName)">
      <span>{{ formatErrorMessage(VV.getErrors(fieldName)) }}</span>
    </InlineMessage>
  </div>
</template>