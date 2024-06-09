<template>
  <label v-bind="props.attrs">{{props.text}}</label>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Label text',
  },
  attrs: {
    type: Object,
  },
});
</script>

<style scoped>
</style>