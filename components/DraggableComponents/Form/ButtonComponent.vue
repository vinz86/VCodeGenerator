<template>
  <button v-bind="props.attrs">{{ props.text }}</button>
</template>

<script setup lang="ts">
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
