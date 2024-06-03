<template>
  <input :placeholder="placeholder" />
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Input',
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