<script setup lang="ts">
import {type Ref, ref} from "vue";
import type {DroppableComponent} from "~/models/DroppableComponent";

const contextMenu = ref();
const itemsContextComponent: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as DroppableComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

const contextMenuEditor = ref();
const itemsContextEditor: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Annulla', icon: 'fa fa-undo', command: () => undo()},
  {label: 'Ripeti', icon: 'fa fa-redo', command: () => redo()},
]);
</script>

<template>

</template>

<style scoped>

</style>