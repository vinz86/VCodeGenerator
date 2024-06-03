<template>
  <button>{{ options.text }}</button>
</template>

<script setup>
import { defineProps } from 'vue';

const options = defineProps({
  text: {
    type: String,
    default: 'Button',
  },
});
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>