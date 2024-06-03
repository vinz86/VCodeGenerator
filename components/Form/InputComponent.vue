<template>
  <input v-bind="attrs" :placeholder="placeholder" />
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Input',
  },
  attrs: {
    type: Object,
  },
});
</script>

<style scoped>
input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}
</style>