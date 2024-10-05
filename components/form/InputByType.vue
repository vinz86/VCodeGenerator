<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import JsonTextarea from "~/components/form/JsonTextarea.vue";
import {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";

const props = defineProps({
  type: String,
  size: 'small' | 'large'
});
const value = defineModel();
const bind = ref();

const emit = defineEmits(['update:modelValue', 'change']);
</script>

<template>
  <div>
    <IconField v-if="props.type === ECustomAttributesType.STRING">
      <InputText
          v-model="value"
          class="w-full form-control"
          :size="props.size"
      />
      <InputIcon class="pi pi-times" />
    </IconField>

    <IconField v-if="props.type === ECustomAttributesType.NUMBER">
      <InputNumber
          v-model="value"
          class="w-full form-control"
          :size="props.size"
      />
      <InputIcon class="pi pi-times" />
    </IconField>

    <Checkbox
        v-if="props.type === ECustomAttributesType.BOOLEAN"
        v-model="value"
        :binary="true"
    />

    <IconField v-if="props.type === ECustomAttributesType.OBJECT">
      <JsonTextarea
          v-model="value"
          variant="j"
          :size="props.size"
          @update:model-value="args => {value = args}"
      />
      <InputIcon class="pi pi-times" />
    </IconField>
  </div>
</template>
