<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import JsonTextarea from "~/components/form/JsonTextarea.vue";
import {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";

const props = defineProps({
  type: String,
  size: 'small' | 'large'
});
const value = defineModel();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <InputText
      v-if="props.type === ECustomAttributesType.STRING"
      v-model="value"
      class="w-full form-control"
      :size="props.size"
  />
  <InputNumber
      v-if="props.type === ECustomAttributesType.NUMBER"
      v-model="value"
      class="w-full form-control"
      :size="props.size"
  />
  <Checkbox
      v-if="props.type === ECustomAttributesType.BOOLEAN"
      v-model="value"
      :binary="true"
  />
  <JsonTextarea
      v-if="props.type === ECustomAttributesType.OBJECT"
      variant="j"
      v-model="value"
      @update:model-value="args => {value = args}"
      :size="props.size"
  ></JsonTextarea>
</template>
