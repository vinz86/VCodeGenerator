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

//const emit = defineEmits(['update:modelValue']);
</script>

<template>
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
        variant="j"
        v-model="value"
        @update:model-value="args => {value = args}"
        :size="props.size"
    ></JsonTextarea>
    <InputIcon class="pi pi-times" />
  </IconField>
</template>
