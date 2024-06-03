<script setup>
debugger
import { ref } from 'vue';
import ComponentList from '~/components/ComponentList.vue';
import DropZone from '~/components/DropZone.vue';
import AttributePanel from '~/components/AttributePanel.vue';

const selectedComponent = ref(null);
</script>

<template>
  <div class="generator">
    <ComponentList />
    <DropZone v-model:selectedComponent="selectedComponent" />
    <AttributePanel :selectedComponent="selectedComponent" />
  </div>
</template>

<style scoped>
.generator {
  display: flex;
}
</style>
