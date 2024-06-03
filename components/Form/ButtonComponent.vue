<template>
  <button v-bind="attrs">{{ text }}</button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Button',
  },
  attrs: {
    type: Object,
  },
});

</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
