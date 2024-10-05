<script setup lang="ts">
import { defineProps } from 'vue';
import EditorPanel from "~/components/Editor/EditorPanel.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
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
        :is="component?.options?.tag || 'div'"
        v-if="component && component.options"
        v-model:selected-component="selectedComponent"
        :data-drop-target="'droppable'"
        class="droppable-component p-2"
        :component-id="component?.options?.id"
        :style="component?.options?.style"
    >

      <template v-if="component?.options?.inner">
        {{component?.options?.inner}}
      </template>
<!--      //v-bind="ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {}"-->

<!--      <EditorPanel style="min-height: 40px" :components="children" :component-factory="props.componentFactory" />-->
<!--      <EditorPanel
          v-model:selectedComponent="selectedComponent"
          v-model:components="props.children"
          :component-factory="componentFactory"
          :parentId="component?.options?.id"
          :file="props.file"
          class="child-components"
          v-bind="ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {}"
          @update-components="onUpdateComponents"
      ></EditorPanel>-->
      <EditorPanel
          :id="component?.options?.id"
          v-model:components="component.options.slot"
          v-model:selected-component="selectedComponent"
          v-model:project="selectedProject"
          v-model:file="selectedFile"
          :class="component?.options?.class"
          :style="component?.options?.style"
          :component-factory="componentFactory"
          v-bind="ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {}"
          @update-components="getComponents()"
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
