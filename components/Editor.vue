<script setup lang="ts">
/** TODO: new:
 * Gestire diverse tipologie di componenti (tramite menu a tendina)
 * Componente personalizzato
 * Aggiungere un ulteriore layer per gestire un albero di files
 */

import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import DraggableComponent from '~/components/Editor/DraggableComponent.vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import { DragDropHelper } from "~/Utils/helper/DragDropHelper";
import type { DroppableComponent } from "~/models/DroppableComponent";
import type { Ref } from "vue";
import type { DroppableProps } from "~/models/DroppableProps";
import {FilesHelper} from "~/Utils/helper/FilesHelper";
import {ProjectHelper} from "~/Utils/helper/ProjectHelper";
import HistoryManager from "~/Utils/manager/HistoryManager";
import ImportExport from "~/components/Editor/ImportExport.vue";
import OutputComponent from "~/components/Editor/OutputComponent.vue";

const components: Ref<DroppableComponent[]> = ref([] as DroppableComponent[]);
// components.value = [{
//   "name":"DroppableComponent",
//   "locked": true,
//   "cat":"Layout",
//   "tag":"div",
//   "props":{"class":"","id":"","style":"","attrs":{}},
//   "id": "main-droppable-component",
//   "slot":[]
// }];
const selectedComponent: Ref<DroppableComponent> = ref({} as DroppableComponent);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const keyOptions: Ref<number> = ref(0);
const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);
const isPreviewVisible: Ref<boolean> = ref(false);

const DragDropH = new DragDropHelper();
const FilesH = new FilesHelper();
const ProjectH = new ProjectHelper();
const HistoryM = new HistoryManager();

const isSavingState: Ref<boolean> = ref(false);

const contextMenu = ref();
const itemsContextComponent: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as DroppableComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

const contextMenuEditor = ref();
const itemsContextEditor: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Annulla', icon: 'fa fa-undo', command: () => undo()},
  {label: 'Ripeti', icon: 'fa fa-redo', command: () => redo()},
]);

watch(components, (newVal) => {
  if (!isSavingState.value) {
    HistoryM.saveState(newVal);
  }
  updateGeneratedCode();
  isSavingState.value = false;
}, { deep: true });

onMounted(() => {
  // Salva lo stato iniziale
  HistoryM.saveState(components.value);

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(`Tasto premuto: ${event.key} con ctrlKey: ${event.ctrlKey} e shiftKey: ${event.shiftKey}`);
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo()
    } else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
      event.preventDefault();
      redo();
    } else if (event.key === 'Delete' ) {
      event.preventDefault();
      removeComponent()
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  })
});


const handleComponentClick = (component: DroppableComponent) => {
  selectedComponent.value = component;
  keyOptions.value = keyOptions.value + 1;
};

const onComponentRightClick = (event: any, component: DroppableComponent) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    contextMenu.value.show(event);
  });
};

const onComponentRightClickEditor = (event: any) => {
  contextMenuEditor.value.hide();
  nextTick(() => {
    contextMenuEditor.value.show(event);
  });
};

const duplicateComponent = async (component: any) => {
  if (component) {
    const newComponent: DroppableComponent = JSON.parse(JSON.stringify(component));
    newComponent.id = Date.now().toString();
    newComponent.props.class = (component.props.class || '').replace('selectedComponent', '');
    components.value.push(newComponent);
    if (component.slot && component.slot.length > 0) {
      await duplicateComponent(component.slot);
    }
  }
};

const removeComponent = (index = -1) => {
  if (index < 0) {
    index = components.value.findIndex(x => x.id === selectedComponent.value.id);
  }
  if (index >= 0) {
    components.value.splice(index, 1);
  }
};
const undo = ()=>{
  const previousState = HistoryM.undoState();
  if (previousState) {
    isSavingState.value = true;
    components.value = previousState;
    console.log('Undo: components.value', components.value);
  }
}

const redo = ()=>{
  const nextState = HistoryM.redoState();
  if (nextState) {
    isSavingState.value = true;
    components.value = nextState;
    console.log('Redo: components.value', components.value);
  }
}


const removeDraggedComponent = (event: any) => {
  if (!event) return;

  const cmpId = event.parentComponentId ? event.parentComponentId : event.id;
  const index = event.draggedIndex;
  const pathToComponent = DragDropH.findObjectById(components.value, cmpId.toString());
  if (pathToComponent !== null) {
    if (event.parentComponentId && index >= 0) {
      DragDropH.removeObjectByPath(components.value, pathToComponent, index);
    } else {
      DragDropH.removeObjectByPath(components.value, pathToComponent)
    }
  }
};

const onDrop = (event: any) => {
  event.preventDefault();

  const dropTarget = event.target.closest('[data-drop-target]');
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && componentData?.trim()!=='' && JSON.parse(componentData);

  if (componentData.fromEditor) return;

  let draggedComponent;
  if (componentData.fromDroppableComponent) {
    if (componentData.parentComponentId) {
      const pathToComponent = DragDropH.findObjectById(components.value, componentData.parentComponentId);
      if (pathToComponent !== null) {
        if(componentData.component){
          draggedComponent = componentData.component;
          DragDropH.removeObjectByPath(components.value, pathToComponent, componentData.index)
        }
        //draggedComponent = JSON.parse(JSON.stringify(DragDropH.removeObjectByPath(components.value, pathToComponent, componentData.index)));
      }
    } else {
      const pathToComponent = DragDropH.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DragDropH.removeObjectByPath(components.value, pathToComponent)));
      }
    }
  } else {
    draggedComponent = componentData?.slot ? componentData : { ...componentData, id: Date.now().toString(), slot: [] };
  }

  if (draggedComponent) {
    if (dropTarget && dropTarget.dataset.dropTarget === 'editor') {
      addComponent(draggedComponent, components.value);
    }
  }
};

const onDragOver = (event: any) => {
  event.preventDefault();
};

const onDragStart = (event: any, index: number) => {
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && JSON.parse(componentData);
  if (!componentData.fromDroppableComponent) {
    draggedComponentIndex.value = index;
    draggedFrom.value = 'index';
    event.dataTransfer.setData('component', JSON.stringify({ fromEditor: true, ...components.value[index] }));
  }
};

const onDragEnter = (index: number) => {
  dragOverIndex.value = index;
};

const onDragLeave = () => {
  dragOverIndex.value = null;
};

const onDropComponent = (index: number) => {
  if (draggedComponentIndex.value !== null) {
    const draggedItem = components.value.splice(draggedComponentIndex.value, 1)[0];
    if (index) {
      components.value.splice(index, 0, draggedItem);
    } else {
      const insertIndex = Math.min(index, draggedComponentIndex.value);
      components.value.splice(insertIndex, 0, draggedItem);
    }
    draggedComponentIndex.value = null;
    dragOverIndex.value = null;
  }
};

const addComponent = (component: any, targetComponents: any) => {
  if (Array.isArray(targetComponents)) {
    const newComponent = component.slot ? component : { ...component, id: Date.now(), slot: [] };
    targetComponents.push(newComponent);
  } else {
    console.error('targetComponents non è un array', targetComponents);
  }
};

const updateComponent = (updatedProps: DroppableProps) => {
  if (!selectedComponent.value.id) return;

  const index = components.value.findIndex(c => c.id === selectedComponent.value.id);
  if (index !== -1) {
    components.value[index].props = updatedProps;
    selectedComponent.value.props = updatedProps;
    keyEditor.value++;
  }
};

const updateGeneratedCode = () => {
  if (!components.value.length) return;

  let generatedCodeValue = '';

  for (const component of components.value) {
    generatedCodeValue += ProjectH.generateCodeRecursive(component);
  }

  generatedCode.value = generatedCodeValue;
};

const updateNestedComponents = (id: string, nestedComponents: any) => {
  const updateComponents = (componentsArray: DroppableComponent[]) => {
    for (const component of componentsArray) {
      if (component.id?.toString() === id) {
        component.slot = nestedComponents;
        return componentsArray;
      }
      if (component.slot && component.slot.length > 0) {
        updateComponents(component.slot);
      }
    }
  };
  updateComponents(components.value)
};

// IMPORT / EXPORT
const exportHTML = () => {
  FilesH.exportHtml(generatedCode.value)
};

const exportProject = () => {
  components.value && FilesH.exportProject(components.value)
};

const importProject = async (event: any) => {
  const file = event.files[0];
  if (!file) return;

  FilesH.importProject(file).then((file) =>{ components.value = file as DroppableComponent[]; });
};

const getDropAreaClass = (component)=>{
    if (component?.props?.class?.length>0){
      return component?.props?.class;
    }
}

const cmpType = ref('');
const componentsTypeValues = ref([
  { name: 'Basic HTML', code: 'HTML' },
  { name: 'PrimeVue / PrimeFlex', code: 'PRIMEVUE' },
  { name: 'Bootstrap', code: 'BOOTSTRAP' },
]);

</script>

<template>
  <div id="wrapper" @contextmenu.stop="onComponentRightClickEditor($event)">

    <ContextMenu ref="contextMenuEditor" :model="itemsContextEditor"/>
    <ContextMenu ref="contextMenu" :model="itemsContextComponent"/>

    <div class="container">
      <!-- PREVIEW -->
      <Sidebar v-model:visible="isPreviewVisible" style="width:90%" header="Preview">
        <div v-html="generatedCode" />
      </Sidebar>

      <Splitter class="w-full m-0" layout="horizontal">
        <!-- LEFT -->
        <SplitterPanel :size="20">
          <div class="flex flex-column h-full">
            <div class="flex-none">
              <Dropdown v-model="cmpType" :options="componentsTypeValues" optionLabel="name" option-value="code" placeholder="Seleziona il tipo dei componenti" class="w-full" />
            </div>
            <div class="flex-grow-1">
              <DraggableComponent v-model="cmpType" />
            </div>
            <div class="flex-none">
              <ImportExport @preview="isPreviewVisible = true" @exportHtml="exportHTML" @exportProject="exportProject" @importProject="importProject($event)" />
            </div>
          </div>
        </SplitterPanel>
        <!-- CENTER -->
        <SplitterPanel :size="60" class="flex flex-column h-full">
          <Panel class="overflow-y-auto flex-grow-1 h-full" header="Editor" id="panel-editor">
            <div class="editor" :key="keyEditor" @click="selectedComponent = {} as DroppableComponent">
              <div
                  class="drop-area"
                  @drop="onDrop"
                  @dragover="onDragOver"
                  data-drop-target="editor"
                  data-component-id="editor"
              >
<!--
                    :class="{'selectedComponent': selectedComponent?.id === component?.id, [getDropAreaClass(component)]: getDropAreaClass(component) }"-->
                <div
                    v-for="(component, index) in components"
                    :key="`${component.id}-${component.name}`"
                    :class="{'selectedComponent': selectedComponent?.id === component?.id, [component?.props?.class]: component?.props?.class?.length>0}"
                    class="draggable-component"
                    @drop="onDropComponent(index)"
                    draggable="true"
                    @dragstart="!component.locked ? onDragStart($event, index) : ''"
                    @dragenter="onDragEnter(index)"
                    @dragleave="onDragLeave()"
                >
                  <component
                      v-model:selectedComponent="selectedComponent"
                      :is="component.name"
                      :componentId="component.id"
                      v-bind="component.props"
                      :parentComponents="component.slot"
                      @updateSelectedComponent="handleComponentClick"
                      @updateNestedComponents="updateNestedComponents"
                      @click.stop="handleComponentClick(component)"
                      @removeComponent="removeDraggedComponent($event)"
                      @contextmenu.stop="!component.locked ? onComponentRightClick($event, component): ''"
                  />

                </div>
              </div>
            </div>
          </Panel>
          <!-- OUTPUT -->
          <OutputComponent v-model="generatedCode" />
        </SplitterPanel>

        <!-- RIGHT -->
        <SplitterPanel :size="20">
          <ComponentOptions v-if="selectedComponent" v-model:selectedComponent="selectedComponent" @update:model-value="updateComponent" />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
