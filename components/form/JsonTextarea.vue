<template>
    <Textarea :value="formattedValue" @input="updateValue($event.target.value)" />
    </template>

    <script setup>
import { ref, watch } from 'vue';

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
        emit('update:modelValue', JSON.parse(value));
    } catch (error) {
        console.error('Invalid JSON:', error);
    }
};
</script>
