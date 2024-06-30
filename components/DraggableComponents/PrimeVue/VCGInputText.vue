<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input-text :id="id" v-bind="attrs" />
  </div>
</template>

<script setup>
const props = defineProps({
  id: String,
  label: String,
  attrs: Object
});
</script>
