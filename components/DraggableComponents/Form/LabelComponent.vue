<template>
  <p v-bind="props.attrs">{{text}}</p>
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