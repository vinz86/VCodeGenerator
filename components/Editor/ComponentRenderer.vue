<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import DroppableComponent from '~/components/DraggableComponents/Layout/DroppableComponent.vue';
import { ProjectHelper } from '~/helper/ProjectHelper';
import { DragDropHelper } from '~/helper/DragDropHelper';
import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { DroppableProps } from '~/models/DroppableProps';

// Props and Events
/*const props = defineProps({
  components: Array as () => IComponentFactory[],
  selectedComponent: Object as () => IComponentFactory,
  componentFactory: Object,
});*/

const components = defineModel('components');
const selectedComponent = defineModel('selectedComponent');
const componentFactory = defineModel('componentFactory');

const emit = defineEmits(['updateSelectedComponent', 'updateNestedComponents', 'removeComponent']);

const handleComponentClick = (component: IComponentFactory) => {
  //emit('updateSelectedComponent', component);
  selectedComponent.value = component;
};

const handleComponentRightClick = (event: any, component: IComponentFactory) => {
  event.preventDefault();
  handleComponentClick(component);
};

const removeDraggedComponent = (event: any) => {
  emit('removeComponent', event);
};

// Methods for Dragging and Dropping
const onDropComponent = (index: number, draggedComponentIndex: Ref<number>, components: Ref<IComponentFactory[]>, dragOverIndex: Ref<number>) => {
  if (draggedComponentIndex.value !== null) {
    const draggedItem = components.value.splice(draggedComponentIndex.value, 1)[0];
    components.value.splice(index, 0, draggedItem);
    draggedComponentIndex.value = null;
    dragOverIndex.value = null;
  }
};

const onDragStart = (event: any, index: number, components: Ref<IComponentFactory[]>, draggedComponentIndex: Ref<number>) => {
  event.dataTransfer.setData('component', JSON.stringify({ fromEditor: true, ...components.value[index] }));
  draggedComponentIndex.value = index;
};

// State for drag and drop
const draggedComponentIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
</script>

<template>
  <div>
    <div
        v-for="(component, index) in components"
        :key="`${component?.options?.id}-${index}`"
        :class="{
        'selectedComponent': selectedComponent?.options?.id === component?.options?.id,
        [component?.options?.className]: component?.options?.className?.length,
      }"
        class="draggable-component"
        @drop="onDropComponent(index, draggedComponentIndex, components, dragOverIndex)"
        draggable="true"
        @dragstart="!component?.options?.locked ? onDragStart($event, index, components, draggedComponentIndex) : ''"
        @dragenter="dragOverIndex = index"
        @dragleave="dragOverIndex = null"
        @contextmenu.stop="handleComponentClick(component); handleComponentRightClick($event, component);"
    >
      <template v-if="component.options?.name === 'DroppableComponent'">
        <DroppableComponent
            :attributes="component?.options?.attributes"
            :component-id="component?.options?.id as string"
            :parent-components="component.options.slot"
            v-model:selectedComponent="selectedComponent.options"
            v-model:component-factory="componentFactory"
            @updateSelectedComponent="handleComponentClick"
            @updateNestedComponents="emit('updateNestedComponents', $event)"
            @removeComponent="removeDraggedComponent($event)"
            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component) : ''"
            @click.stop="handleComponentClick(component)"
        />
      </template>
      <component
          v-else
          v-model:selectedComponent="selectedComponent"
          :is="component.render()"
          :class="component?.options?.className"
          :style="component?.options?.style"
          :componentId="component?.options?.id"
          :parentComponents="component?.options?.children"
          v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"
          @updateSelectedComponent="handleComponentClick"
          @updateNestedComponents="emit('updateNestedComponents', $event)"
          @removeComponent="removeDraggedComponent($event)"
          @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component) : ''"
          @click.stop="handleComponentClick(component)"
      />

      {{component?.options?.className}}
    </div>
  </div>
</template>

<style scoped>
.draggable-component {
  /* Add any necessary styles here */
}
</style>
