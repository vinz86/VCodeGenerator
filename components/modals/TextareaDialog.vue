<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
});
const emit = defineEmits(['update:value']);

const textareaData = ref(props.value);

watch(
    () => props.value,
    (newValue) => {
      textareaData.value = newValue;
    }
);

const saveChanges = () => {
  emit('update:value', textareaData.value);
};
</script>

<template>
  <Textarea placeholder="...inserisci il testo in formato JSON" v-model="textareaData" style="width: 80vw; height: 70vh" @keyup="saveChanges" >sss</Textarea>
</template>

<style scoped>

</style>
