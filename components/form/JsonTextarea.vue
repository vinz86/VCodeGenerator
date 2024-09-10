<script setup lang="ts">
import { ref, watch } from 'vue';
import {ProjectHelper} from "~/helper/ProjectHelper";

const props = defineProps({
    modelValue: Object
});

const emit = defineEmits(['update:modelValue']);

const formattedValue = ref(JSON.stringify(props.modelValue, null, 2));

watch(
    () => props.modelValue,
    (newValue) => {
        formattedValue.value = JSON.stringify(newValue, null, 2);
    },
    { deep: true }
);

const updateValue = (value) => {
    try {
        emit('update:modelValue', ProjectHelper.stringToObject(value));
    } catch (error) {
        console.error('JSON non valido:', error);
    }
};
</script>
<template>
  <Textarea :fluid="true" rows="1" autoResize style="max-height: 300px;" :value="formattedValue" @change="updateValue($event.target.value)" />
</template>
<style scoped></style>