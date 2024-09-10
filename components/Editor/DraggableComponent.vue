<script setup lang="ts">
import {availableComponents} from "~/components/DraggableComponents/ListDraggableComponents";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import {ProjectHelper} from "~/helper/ProjectHelper";

const groupByCategory = (components: IDroppableComponent[]) => {
  return components.reduce((acc: any, component: IDroppableComponent, currentIndex) => {
    (acc[component.cat||currentIndex] = acc[component.cat||currentIndex] || []).push(component);
    return acc;
  }, {});
};

const groupedComponents = computed(() => groupByCategory(availableComponents));

const onDragStart = (event: any, component: IDroppableComponent): void => {
    event.dataTransfer.setData('component', JSON.stringify(component));
};
</script>

<template>
  <div>

    <Accordion :activeIndex="0">

      <AccordionTab v-for="(components, category) in groupedComponents" :key="category" :header="category.toString()">
        <div
          v-for="component in components"
          :key="component.name">
          <small> {{ component.label || component.name }}</small>
          <div
              class="draggable-component inline-block"
              :id="ProjectHelper.getUniqueID().toString()+'container'"
              draggable="true"
              @dragstart="onDragStart($event, component)"
          >
            <component
                :is="component.tag"
                class="w-full"
                :id="ProjectHelper.getUniqueID().toString()"
                v-bind="component.options"
            >
              {{component?.inner || ''}}
            </component>
          </div>
          <i v-if="component.icon" :class="component.icon" />
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
</style>
