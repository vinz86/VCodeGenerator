<script setup lang="ts">
import {defineEmits, defineProps, nextTick, onMounted, type PropType, type Ref, ref, watch} from 'vue';
import type {DroppableComponent} from "~/models/DroppableComponent";
import {DragDropHelper} from "~/Utils/helper/DragDropHelper";

const props = defineProps({
  parentComponents: {
    type: Array as PropType<DroppableComponent[]>,
    default: () => []
  },
  attrs: {
    type: Object,
    default: () => ({})
  },
  componentId: {
    type: String,
    required: true,
  }
});
const emit = defineEmits(['updateNestedComponents', 'updateSelectedComponent', 'removeComponent']);

const DD = new DragDropHelper();

const contextMenu = ref();

const itemsContextComponent: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as DroppableComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

const components: Ref<DroppableComponent[]> = ref([] as DroppableComponent[]);

const selectedComponent: Ref<DroppableComponent | undefined>  = defineModel<DroppableComponent>('selectedComponent');
const draggedComponentIndex: Ref<number> = ref(-1);
const dragOverIndex: Ref<number> = ref(-1);

const onComponentRightClick = (event: any, component: DroppableComponent) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    contextMenu.value.show(event);
  });
};

const duplicateComponent = (component: any) => {
  if (component) {
    const newComponent: DroppableComponent = JSON.parse(JSON.stringify(component));
    newComponent.id = Date.now().toString();
    newComponent.props.class = (component.props.class || '').replace('selectedComponent', '');
    components.value.push(newComponent);
    if (component.slot && component.slot.length > 0) {
      duplicateComponent(component.slot);
    }
  }
};

const removeComponent = (index = -1) => {
  if (index < 0) {
    if(selectedComponent.value){
      index = components.value.findIndex(x => x.id === selectedComponent.value?.id);
    }
  }
  if (index >= 0) {
    components.value.splice(index, 1);
  }
};

const handleComponentClick = (component: DroppableComponent) => {
  selectedComponent.value = component;
  contextMenu.value.hide();
  emit('updateSelectedComponent', component);
};

const onDragOver = (event: any) => {
  event.preventDefault();
};

const onDragEnter = (index: any) => {
  console.log('dragOverIndex.value', dragOverIndex.value)
  dragOverIndex.value = index;
};

const onDragLeave = () => {
  dragOverIndex.value = -1;
};

const onDragStart = (event: any, index: number, parentComponentId:string|null = null, component: DroppableComponent) => {
  event.stopPropagation();

  event.dataTransfer.setData('component', JSON.stringify({fromDroppableComponent: true, index, parentComponentId, component}));
  draggedComponentIndex.value = index;
};

const onDrop = (event: any) => {
  event.preventDefault();
  event.stopPropagation();

  const dropTarget = event.target.closest('[data-drop-target]');
  if (!dropTarget) {
    console.warn('Drop target not found.');
    return;
  }

  const dropTargetId = dropTarget.dataset.componentId;
  if (!dropTargetId) {
    console.warn('Drop target ID not found.');
    return;
  }

  let componentData;
  try {
    componentData = JSON.parse(event.dataTransfer.getData('component'));
  } catch (error) {
    console.error('Errore nel parsing del componente:', error);
    return;
  }

  if (!componentData) {
    console.warn('componentData undefined');
    return;
  }

  const {index: draggedIndex, parentComponentId, fromDroppableComponent, fromEditor} = componentData;
  if (fromEditor) {
    emit('removeComponent', componentData);
    delete componentData.fromEditor;
  }

  let draggedComponent;
  if (fromDroppableComponent) {
    if (componentData.parentComponentId) {
      emit('removeComponent', {parentComponentId, draggedIndex});
    } else {
      // Trova e rimuove il componente dall'array principale
      const pathToComponent = DD.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DD.removeObjectByPath(components.value, pathToComponent)));
      }
    }
  }
  else if (fromEditor) {
    draggedComponent = componentData.slot ? componentData : {...componentData, id: Date.now().toString(), slot: []};
  } else {
    draggedComponent = {...componentData, id: Date.now().toString(), slot: []};
  }


  if (!draggedComponent) {
    draggedComponent = componentData.component ? componentData.component : DD.findObjectById(components.value, componentData.parentComponentId);
  }
  if (draggedComponent) {
    const targetComponent = DD.findParentComponent(dropTargetId, components.value);
    if (targetComponent && targetComponent.slot) {
      targetComponent.slot.push(draggedComponent);
    } else {
      components.value.push(draggedComponent);
    }
    emit('updateNestedComponents', props.componentId, components.value);
  }

};

const onDropComponent = (event: any) => {
  event.preventDefault();
  event.stopPropagation();

  let componentData;
  try {
    componentData = JSON.parse(event.dataTransfer.getData('component'));
  } catch (error) {
    console.error('Errore nel parsing del componente', error);
    return;
  }

  const {index: draggedIndex, fromDroppableComponent, parentComponentId, component} = componentData;

  if (fromDroppableComponent) {
    if (parentComponentId) {
      if (draggedIndex>=0) {
        const removedComponent = components.value.splice(draggedIndex, 1)[0];
        components.value.splice(dragOverIndex.value, 0, removedComponent);

      } else {
        const insertIndex = Math.min(draggedIndex, draggedComponentIndex.value);
        components.value.splice(insertIndex, 0, component);
      }
    }
  }
  emit('updateNestedComponents', props.componentId, components.value);
};

const updateNestedComponents = (id:string, nestedComponents: any) => {
  const updateComponents = (componentsArray: DroppableComponent[]) => {
    for (const component of componentsArray) {
      if (component.id === id) {
        component.slot = nestedComponents;
        return;
      }
      if (component.slot && component.slot.length > 0) {
        updateComponents(component.slot);
      }
    }
  };
  updateComponents(components.value);
};

const setDroppableAreaHeight = (): void => {
  const draggableComponents: NodeListOf<HTMLElement> = document.querySelectorAll('.draggable-component');

  draggableComponents.forEach((draggableComponent: HTMLElement) => {
    const childComponent: HTMLElement | null = draggableComponent.querySelector(':scope > *:not(.component-icons)');
    if (childComponent) {
      draggableComponent.style.width = childComponent.style.width; // No need to interpolate, as childWidth is already a string or null
    }
  });
};

const onRemoveComponent = (val:any) => {
  emit('removeComponent', val);
};

onMounted(() => {
  components.value = props.parentComponents;
  setDroppableAreaHeight();
});

watch(selectedComponent, (val: Record<string, any>) => {
  if (Object.keys(val).length > 0) {
    contextMenu.value.hide();
  }
}, { deep: true });


watch(() => props.parentComponents, (newValue) => {
    components.value = newValue;
}, { deep: true });

const filterProps = (props: Record<string, any>) => {
  const { class: _class, ...rest } = props;
  return rest;
};
</script>

<template>
  <div
      class="droppable-area"
      @drop="onDrop"
      @dragover="onDragOver"
      ref="draggableComponents"
      data-drop-target="droppable"
      :data-component-id="`droppable-${Date.now()}`"
      data-vin="droppable"
      @click="selectedComponent = {} as DroppableComponent"
  >
    <ContextMenu ref="contextMenu" :model="itemsContextComponent"/>
<!-- [component?.props?.class]: component?.props?.class,-->
    <div
        data-vin="draggable"
        v-bind="attrs"
        v-for="(component, index) in components"
        :key="`draggable-component-${index}`"
        class="draggable-component"
        :class="{
          [component?.props?.class]: component?.props?.class,
          'drag-over': index === dragOverIndex,
          'selectedComponent': selectedComponent?.id === component.id
        }"
        draggable="true"
        @dragstart="onDragStart($event, index, props.componentId?.toString(), component)"
        @dragenter="onDragEnter(index)"
        @dragleave="onDragLeave()"
        @drop="onDropComponent($event)"
        :data-component-id="component.id"
    >
      <component
          :is="component.name"
          :componentId="component.id?.toString()"
          v-bind="component.name==='DroppableComponent' ? '' : component.props"
          :style="{'width:100%': component.name==='DroppableComponent'}"
          :parentComponents="component.slot"
          v-model:selectedComponent="selectedComponent"
          @click.stop="handleComponentClick(component);"
          @updateNestedComponents="updateNestedComponents"
          @updateSelectedComponent="handleComponentClick"
          @contextmenu.stop="onComponentRightClick($event, component)"
          @removeComponent="onRemoveComponent"
      />
      {{component.prop}}
    </div>
  </div>
</template>

<style scoped>
</style>
