<script setup lang="ts">
import { defineProps } from 'vue';
import EditorPanel from "~/components/Editor/EditorPanel.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type {DroppableProps} from "~/models/DroppableProps";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

const emit = defineEmits(['updateComponents']);

const selectedComponent = defineModel<IComponentFactory>('selectedComponent');
const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  children: {
    type: Array,
    required: true,
  },
  componentFactory: {
    required: true,
  },
  file:{
    type: Object as PropType<File>,
    default: null
  }
});

const onUpdateComponents = ()=> {
  emit('updateComponents')
}
</script>

<template>
    <!-- Renderizza il componente padre -->
    <component
        v-if="component && component.options"
        v-model:selectedComponent="selectedComponent"
        :data-drop-target="'droppable'"
        class="droppable-component"
        :is="component?.options?.tag || 'div'"
        :component-id="component?.options?.id"
        :style="component?.options?.style"
    >
      <div v-if="component?.options?.inner">
        {{component?.options?.inner}}
      </div>
<!--      //v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"-->

<!--      <EditorPanel style="min-height: 40px" :components="children" :component-factory="props.componentFactory" />-->
      <EditorPanel
          v-model:selectedComponent="selectedComponent"
          v-model:components="props.children"
          :component-factory="componentFactory"
          :parentId="component?.options?.id"
          :file="props.file"
          class="child-components"
          v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"
          @update-components="onUpdateComponents"
      ></EditorPanel>
    </component>
</template>

<style scoped>
.droppable-component {
  border: 1px solid #ddd;
}

.child-components {
  min-height:25px;
  min-width:25px;
}
</style>
