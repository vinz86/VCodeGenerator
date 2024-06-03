<template>
  <span>{{text}}</span>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'text',
  },
});
</script>

<style scoped>
</style>