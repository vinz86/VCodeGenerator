<template>
  <input v-bind="props.attrs" :placeholder="props.placeholder" />
</template>

<script setup lang="ts">
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