<script setup>
import {availableComponents} from "~/components/AvailableComponent.ts";

const groupByCategory = (components) => {
  return components.reduce((acc, component) => {
    (acc[component.cat] = acc[component.cat] || []).push(component);
    return acc;
  }, {});
};

const groupedComponents = computed(() => groupByCategory(availableComponents));

const onDragStart = (component) => {
  event.dataTransfer.setData('component', JSON.stringify(component));
};
</script>

<template>
  <div>
    <Accordion :activeIndex="0">
      <AccordionTab v-for="(components, category) in groupedComponents" :key="category" :header="category">
        <div
            v-for="component in components"
            :key="component.name"
            class="draggable-component"
            draggable="true"
            @dragstart="onDragStart(component)"
        >
          <i v-if="component.icon" :class="component.icon" /> {{ component.label || component.name }}
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<style scoped>
.draggable-component {
  width: 100%;
  padding: 2px 5px;
  border: 1px solid #ddd;
  margin: 5px;
  cursor: grab;
  font-size: .8rem;
  border-radius: 2px;
  background-color: #eee;
}

.draggable-component:before {
  content:"⇒ ";
}
</style>
