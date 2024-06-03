<template>
  <div class="droppable-area" @drop="onDrop" @dragover="onDragOver">
    <div
        v-for="(component, index) in components"
        :key="`${component.id}-${component.name}`"
        class="draggable-component"
        draggable="true"
        @dragstart="onDragStart(index)"
    >
      <component :is="component.name" v-bind="component.props" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const components = ref([]);
const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (event) => {
  event.preventDefault();
  const componentData = JSON.parse(event.dataTransfer.getData('component'));
  addComponent(componentData);
};

const addComponent = (component) => {
  const newComponent = { ...component, id: Date.now() };
  components.value.push(newComponent);
};

const onDragStart = (index) => {
  event.dataTransfer.setData('dragIndex', index);
};
</script>

<style scoped>
.droppable-area {
  border: 2px dashed #ccc;
  padding: 10px;
  min-height: 100px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.draggable-component {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: white;
}
</style>
