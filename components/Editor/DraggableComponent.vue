<script setup lang="ts">
import {availableComponents} from "~/components/DraggableComponents/ListDraggableComponents";
import type {TComponentOptions} from "~/models/types/TComponentOptions";
import {ProjectHelper} from "~/helper/ProjectHelper";

const groupByCategory = (components: TComponentOptions[]) => {
  return components.reduce((acc: any, component: TComponentOptions, currentIndex) => {
    (acc[component.cat||currentIndex] = acc[component.cat||currentIndex] || []).push(component);
    return acc;
  }, {});
};

const groupedComponents = computed(() => groupByCategory(availableComponents));

const onDragStart = (event: any, component: TComponentOptions): void => {
    event.dataTransfer.setData('component', JSON.stringify(component));
};
</script>

<template>
  <div>

    <Accordion :active-index="0">

      <AccordionTab v-for="(components, category) in groupedComponents" :key="category" :header="category.toString()">
        <div
          v-for="component in components"
          :key="component.name">
          <small> {{ component.label || component.name }}</small>
          <div
              :id="ProjectHelper.getUniqueID().toString()+'container'"
              class="draggable-component inline-block"
              draggable="true"
              @dragstart="onDragStart($event, component)"
          >
            <component
                :is="component.tag"
                :id="ProjectHelper.getUniqueID().toString()"
                class="w-full"
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
