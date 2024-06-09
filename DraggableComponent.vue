<script setup lang="ts">
import {availableComponents} from "~/components/AvailableComponent";
import type {DroppableComponent} from "~/components/models/DroppableComponent";

// TODO: da implementare
const cmpType = defineModel();
const groupByCategory = (components: DroppableComponent[]) => {
  return components.reduce((acc: any, component: DroppableComponent) => {
    (acc[component.cat] = acc[component.cat] || []).push(component);
    return acc;
  }, {});
};

const groupedComponents = computed(() => groupByCategory(availableComponents));

const onDragStart = (event: any, component: DroppableComponent) => {
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
            :componentId="Date.now()"
            draggable="true"
            @dragstart="onDragStart($event, component)"
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
