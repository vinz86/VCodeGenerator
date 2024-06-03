<template>
  <label v-bind="attrs">{{text}}</label>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'text',
  },
  attrs: {
    type: Object,
  },
});
</script>

<style scoped>
</style>