<script setup lang="ts">
/** TODO: new:
 * Gestire diverse tipologie di componenti (tramite menu a tendina)
 * Componente personalizzato
 * Aggiungere un ulteriore layer per gestire un albero di files
 * Aggiungere History UNDO/REDO
 */

import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import DraggableComponent from '~/components/DraggableComponent.vue';
import ComponentOptions from "~/components/ComponentOptions.vue";
import { DragDropHelper } from "~/Utils/helpers/DragDropHelper";
import type { DroppableComponent } from "~/models/DroppableComponent";
import type { Ref } from "vue";
import type { DroppableProps } from "~/models/DroppableProps";
import {redoState, saveState, undoState} from '~/store/History';

const components: Ref<DroppableComponent[]> = ref([] as DroppableComponent[]);
/*components.value = [{
  "name":"DroppableComponent",
  "locked": true,
  "cat":"Layout",
  "tag":"div",
  "props":{"class":"","id":"","style":"","attrs":{}},
  "id": "1717452042378",
  "slot":[]
}];*/
const selectedComponent: Ref<DroppableComponent> = ref({} as DroppableComponent);
const keyEditor: Ref<number> = ref(0);
const keyOptions: Ref<number> = ref(0);
const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);
const isPreviewVisible: Ref<boolean> = ref(false);

const DD = new DragDropHelper();

const isSavingState: Ref<boolean> = ref(false);

watch(components, (newVal) => {
  if (!isSavingState.value) {
    saveState(newVal);
  }
  updateGeneratedCode();
  isSavingState.value = false;
}, { deep: true });

onMounted(() => {
  // Salva lo stato iniziale
  saveState(components.value);

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(`Key pressed: ${event.key} with ctrlKey: ${event.ctrlKey} and shiftKey: ${event.shiftKey}`);
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo()
    } else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
      event.preventDefault();
      redo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  })
});




const contextMenu = ref();
const itemsContextComponent: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as DroppableComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);
const onComponentRightClick = (event: any, component: DroppableComponent) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    contextMenu.value.show(event);
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



const contextMenuEditor = ref();
const itemsContextEditor: Ref<{label: string, icon: string, command: () => void}[]> = ref([
  {label: 'Annulla', icon: 'fa fa-undo', command: () => undo()},
  {label: 'Ripeti', icon: 'fa fa-redo', command: () => redo()},
]);

const onComponentRightClickEditor = (event: any) => {
  contextMenuEditor.value.hide();
  nextTick(() => {
    contextMenuEditor.value.show(event);
  });
};
/*
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
*/

/*
const handleComponentClick = (component: DroppableComponent) => {
  selectedComponent.value = component;
  contextMenu.value.hide();
  emit('updateSelectedComponent', component);
};
*/










const undo = ()=>{
  const previousState = undoState();
  if (previousState) {
    isSavingState.value = true;
    components.value = previousState;
    console.log('Undo: components.value', components.value);
  }
}

const redo = ()=>{
  const nextState = redoState();
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
  const pathToComponent = DD.findObjectById(components.value, cmpId.toString());
  if (pathToComponent !== null) {
    if (event.parentComponentId && index >= 0) {
      DD.removeObjectByPath(components.value, pathToComponent, index);
    } else {
      DD.removeObjectByPath(components.value, pathToComponent)
    }
  }
};

const onDrop = (event: any) => {
  event.preventDefault();

  const dropTarget = event.target.closest('[data-drop-target]');
  const componentData = JSON.parse(event.dataTransfer.getData('component'));

  if (componentData.fromEditor) return;

  let draggedComponent;
  if (componentData.fromDroppableComponent) {
    if (componentData.parentComponentId) {
      const pathToComponent = DD.findObjectById(components.value, componentData.parentComponentId);
      if (pathToComponent !== null) {
        if(componentData.component){
          draggedComponent = componentData.component;
          DD.removeObjectByPath(components.value, pathToComponent, componentData.index)
        }
        //draggedComponent = JSON.parse(JSON.stringify(DD.removeObjectByPath(components.value, pathToComponent, componentData.index)));
      }
    } else {
      const pathToComponent = DD.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DD.removeObjectByPath(components.value, pathToComponent)));
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

const handleComponentClick = (component: DroppableComponent) => {
  selectedComponent.value = component;
  keyOptions.value = keyOptions.value + 1;
};

const generatedCode = ref('');

const generateCodeRecursive = (component: DroppableComponent) => {
  let code = '';

  if (!component || !component.tag) {
    return code;
  }

  code += `<${component.tag} `;

  if (component.props) {
    if (component.props.id && component.props.id.trim() !== '') {
      code += `id="${component.props.id}" `;
    }

    if (component.props.class && component.props.class.trim() !== '') {
      code += `class="${component.props.class}" `;
    }

    if (component.props.style && component.props.style.trim() !== '') {
      code += `style="${component.props.style}" `;
    }

    if (component.props.attrs) {
      for (const key in component.props.attrs) {
        code += `${key}="${component.props.attrs[key]}" `;
      }
    }
  }

  if (component.props?.text || (component.slot && component.slot.length > 0)) {
    code += '>\n';

    if (component.props.text) {
      code += component.props.text;
    }

    if (component.slot && component.slot.length > 0) {
      code += processSlotContent(component.slot);
    }

    code += `\n</${component.tag}>\n`;
  } else {
    code += '/>\n';
  }

  return code;
};

const processSlotContent = (slotContent: DroppableComponent[]) => {
  let slotCode = '';

  if (Array.isArray(slotContent)) {
    for (const nestedComponent of slotContent) {
      slotCode += generateCodeRecursive(nestedComponent);
    }
  } else {
    slotCode += slotContent;
  }

  return slotCode;
};

const updateGeneratedCode = () => {
  if (!components.value.length) return;

  let generatedCodeValue = '';

  for (const component of components.value) {
    generatedCodeValue += generateCodeRecursive(component);
  }

  generatedCode.value = generatedCodeValue;
};

const removeComponent = (index = -1) => {
  if (index < 0) {
    index = components.value.findIndex(x => x.id === selectedComponent.value.id);
  }
  if (index >= 0) {
    components.value.splice(index, 1);
  }
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

const exportHTML = () => {
  if (!generatedCode.value || generatedCode.value?.length === 0) return;

  let _ncode = `<template>\n${generatedCode.value}\n</template>`;
  const blob = new Blob([_ncode], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.html';
  a.click();
  window.URL.revokeObjectURL(url);
};

const exportProject = () => {
  if (!Array.isArray(components.value) || components.value?.length === 0) return;

  const jsonData = JSON.stringify(components.value);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.json';
  a.click();
  window.URL.revokeObjectURL(url);
};

const importProject = (event: any) => {
  const file = event.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      if (e.target && event.target.result !== null) {
        const importedComponents = JSON.parse(e.target.result as string);
        components.value = importedComponents;
        console.log('Progetto importato:', importedComponents);
      }
    } catch (error) {
      console.error('Errore durante il parsing del JSON:', error);
    }
  };
  reader.readAsText(file);
};

function copyToClipboard(): void {
  const textarea = document.getElementById('textarea-generated-code') as HTMLTextAreaElement;
  if (textarea) {
    textarea.disabled = false;
    textarea.select();
    document.execCommand("copy");
    textarea.disabled = true;
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
  <div id="wrapper">

    <Toolbar>
      <template #start>
        <div class="logo">VCodeGenerator <i class="text-sm">0.0.1-rc</i></div>
      </template>

      <template #center>
      </template>

      <template #end>
        <Button icon="fa fa-undo" @click="undo()" class="mr-2" severity="secondary" />
        <Button icon="fa fa-redo" @click="redo()" class="mr-2" severity="secondary" />
        <Button icon="fa fa-times" @click="components=[]" class="mr-2" severity="danger" />
      </template>
    </Toolbar>

    <div class="container">
      <Sidebar v-model:visible="isPreviewVisible" style="width:90%" header="Preview">
        <div v-html="generatedCode" />
      </Sidebar>
      <Splitter class="w-full m-0" layout="horizontal">
        <SplitterPanel :size="20">
          <div class="flex flex-column h-full">
            <div class="flex-none">
              <Dropdown v-model="cmpType" :options="componentsTypeValues" optionLabel="name" option-value="code" placeholder="Seleziona il tipo dei componenti" class="w-full" />
            </div>
            <div class="flex-grow-1">
              <DraggableComponent v-model="cmpType" />
            </div>
            <div class="flex-none">
              <Panel toggleable>
                <template #header>
                  <i class="fa fa-file-export" />&nbsp;<small>Esportazione</small>
                </template>
                <Button outlined class="w-full mb-1" @click="isPreviewVisible = true" severity="success"><i class="fa fa-search" />&nbsp;Preview</Button>
                <Button @click="exportHTML" severity="dark" class="w-full"><i class="fa fa-download" />&nbsp;Download HTML</Button>
              </Panel>
            </div>
            <div class="flex-none">
              <Panel toggleable collapsed>
                <template #header>
                  <i class="fa fa-save" />&nbsp;<small>Salva Progetto</small>
                </template>
                <Button text @click="exportProject" severity="secondary"><i class="fa fa-file-export" />&nbsp;Esporta progetto</Button>
                <FileUpload class="p-button-text" mode="basic" accept="application/json" :maxFileSize="1000000" @select="importProject($event)" :auto="true" chooseLabel="Importa progetto">
                  <template #uploadicon> <i class="fa fa-file-import" />&nbsp; </template>
                </FileUpload>
              </Panel>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="60" class="flex flex-column h-full">
          <Panel class="overflow-y-auto flex-grow-1 h-full" header="Editor" id="panel-editor">
            <div class="editor" :key="keyEditor" @click="selectedComponent = {} as DroppableComponent"
                 @contextmenu.stop="onComponentRightClickEditor($event)">
              <ContextMenu ref="contextMenu" :model="itemsContextComponent"/>
              <ContextMenu ref="contextMenuEditor" :model="itemsContextEditor"/>
              <div
                  class="drop-area"
                  @drop="onDrop"
                  @dragover="onDragOver"
                  data-drop-target="editor"
                  data-component-id="editor"
              >
                <div
                    v-for="(component, index) in components"
                    :key="`${component.id}-${component.name}`"
                    :class="{'selectedComponent': selectedComponent?.id === component?.id, [component?.props?.class]: component?.props?.class?.length>0}"
                    class="draggable-component"
                    @drop="onDropComponent(index)"
                    draggable="true"
                    @dragstart="!component.locked && onDragStart($event, index)"
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
                      @contextmenu.stop="onComponentRightClick($event, component)"
                  />

                </div>
              </div>
            </div>
          </Panel>
          <Panel class="overflow-y-auto" header="Codice generato" toggleable>
            <template #icons></template>
            <div class="text-right text-green-400 mb-1">
              <Button size="small" outlined icon="fa fa-copy" @click="copyToClipboard" />
            </div>
            <textarea id="textarea-generated-code" v-html="generatedCode" class="w-full h-10rem" disabled></textarea>
          </Panel>
        </SplitterPanel>
        <SplitterPanel :size="20">
          <ComponentOptions
              v-if="selectedComponent"
              v-model:selectedComponent="selectedComponent"
              @update:model-value="updateComponent"
          />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
