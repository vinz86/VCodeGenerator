<template>
    <input-number :id="id" v-bind="attrs" />
</template>

<script setup>
const props = defineProps({
  id: String,
  attrs: Object
});
</script>
