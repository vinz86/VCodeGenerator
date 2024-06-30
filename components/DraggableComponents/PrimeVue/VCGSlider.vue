<template>
   <Slider :id="id" v-bind="attrs" />
</template>

<script setup>
const props = defineProps({
  id: String,
  label: String,
  attrs: Object
});
</script>
