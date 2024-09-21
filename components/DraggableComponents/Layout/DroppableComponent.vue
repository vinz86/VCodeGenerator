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

const fileId = props.component.options.file.id;
const projectId = props.component.options.file.projectId;

const onUpdateComponents = ()=> {
  debugger
  emit('updateComponents')
}
</script>

<template>
    <!-- Renderizza il componente padre -->
    <component
        v-model:selectedComponent="selectedComponent"
        :data-drop-target="'droppable'"
        @drop="onDrop"
        class="droppable-component"
        :is="component?.options?.tag || 'div'"
        :component-id="component?.options?.id"
        :style="component?.options?.style"
    >
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
      />
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
