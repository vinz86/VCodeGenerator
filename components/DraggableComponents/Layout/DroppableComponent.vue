<script setup lang="ts">
//TODO: Da aggiornare/rivedere
import {defineEmits, defineProps, nextTick, onMounted, type PropType, type Ref, ref, watch} from 'vue';
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import {DragDropHelper} from "~/helper/DragDropHelper";
import type {IComponent} from "~/models/interfaces/IComponent";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type { EComponentTypes } from '~/models/enum/EComponentTypes';

const componentFactory = defineModel<ComponentFactory>('componentFactory')

const props = defineProps({
  parentComponents: {
    type: Array as PropType<IComponent[]>,
    default: () => []
  },
  attributes: {
    type: Object,
    default: () => ({})
  },
  componentId: {
    type: String,
    required: true,
  }
});
const emit = defineEmits(['updateNestedComponents', 'updateSelectedComponent', 'removeComponent']);

const contextMenu = ref();

const itemsContextComponent: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as IDroppableComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

const components: Ref<IComponent[]> = ref([] as IComponent[]);

const selectedComponent: Ref<IDroppableComponent | undefined>  = defineModel<IDroppableComponent>('selectedComponent');
const draggedComponentIndex: Ref<number> = ref(-1);
const dragOverIndex: Ref<number> = ref(-1);

const onComponentRightClick = (event: any, component: IDroppableComponent) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    contextMenu.value.show(event);
  });
};

const duplicateComponent = (component: IComponent) => {
  if (component) {
    const newComponent = JSON.parse(JSON.stringify(component));
    newComponent.id = Date.now().toString();
    newComponent.options['class'] = (component.options?.class || '').replace('selectedComponent', '');

    // Usa la factory per creare un nuovo elemento
    const newElement = componentFactory.value && componentFactory.value.createElement(newComponent);
    newElement &&components.value.push(newElement);

    if (component.options.slot && component.options.slot.length > 0) {
      component.options.slot.forEach(duplicateComponent);
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

const handleComponentClick = (component: IDroppableComponent) => {
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

const onDragStart = (event: any, index: number, parentComponentId:string|null = null, component: IDroppableComponent) => {
  event.stopPropagation();

  event.dataTransfer.setData('component', JSON.stringify({fromDroppableComponent: true, index, parentComponentId, component}));
  draggedComponentIndex.value = index;
};

const onDrop = (event: any) => {
  debugger
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
      const pathToComponent = DragDropHelper.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DragDropHelper.removeObjectByPath(components.value, pathToComponent)));
      }
    }
  }
  else if (fromEditor) {
    draggedComponent = componentData.slot ? componentData : {...componentData, id: Date.now().toString(), slot: []};
  } else {
    draggedComponent = {...componentData, id: Date.now().toString(), slot: []};
  }


  if (!draggedComponent) {
    draggedComponent = componentData.component ? componentData.component : DragDropHelper.findObjectById(components.value, componentData.parentComponentId);
  }
  if (draggedComponent) {
    const targetComponent = DragDropHelper.findParentComponent(dropTargetId, components.value);
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
  const updateComponents = (componentsArray: IDroppableComponent[]) => {
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
      @click="selectedComponent = {} as IDroppableComponent"
  >
    <ContextMenu ref="contextMenu" :model="itemsContextComponent"/>
    <div
        data-vin="draggable"
        v-bind="attributes"
        v-for="(component, index) in components"
        :key="`draggable-component-${index}`"
        class="draggable-component"
        :class="{
        [component?.options?.class as string]: component?.options?.class,
        'drag-over': index === dragOverIndex,
        'selectedComponent': selectedComponent?.id && selectedComponent.id === component.options.id
      }"
        draggable="true"
        @dragstart="onDragStart($event, index, props.componentId?.toString(), component.options)"
        @dragenter="onDragEnter(index)"
        @dragleave="onDragLeave()"
        @drop="onDropComponent($event)"
        :data-component-id="component.options?.id || Date.now()"
    >
      <component
          :is="component.options?.tag"
          :componentId="component.options?.id?.toString()"
          v-bind="component.options?.name==='DroppableComponent' ? '' : component.options?.attributes"
          :style="{'width:100%': component.options?.name==='DroppableComponent'}"
          :parentComponents="component.options?.slot"
          v-model:selectedComponent="selectedComponent"
          @click.stop="handleComponentClick(component?.options);"
          @updateNestedComponents="updateNestedComponents"
          @updateSelectedComponent="handleComponentClick"
          @contextmenu.stop="onComponentRightClick($event, component.options)"
          @removeComponent="onRemoveComponent"
      >{{ component?.options?.inner }}</component>
    </div>
  </div>
</template>

<style scoped>
</style>
