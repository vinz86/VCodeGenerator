<script setup lang="ts">

import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import { DragDropHelper } from "~/helper/DragDropHelper";
import type { DroppableComponent } from "~/models/DroppableComponent";
import type { Ref } from "vue";
import type { DroppableProps } from "~/models/DroppableProps";
import {FilesHelper} from "~/helper/FilesHelper";
import {ProjectHelper} from "~/helper/ProjectHelper";
import HistoryManager from "~/manager/HistoryManager";
import ImportExport from "~/components/Editor/ImportExport.vue";
import OutputComponent from "~/components/Editor/OutputComponent.vue";
import {ComponentFactoryProvider} from "~/factories/ComponentFactory";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {Component} from "~/models/interfaces/Component";
import type {ItemContextMenu} from "~/models/types/itemContextMenu";
import DraggableComponent from "~/components/Editor/DraggableComponent.vue";
import {ServiceKeys} from "~/models/enum/ServiceKeys";
import {ComponentTypes} from "~/models/enum/ComponentTypes";
import Project from "~/components/Editor/Project.vue";
import  {type Project as IProject } from '~/models/interfaces/Project';
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {FileModel} from "~/models/interfaces/FileModel";
import {StateManager} from "~/store/StateManager";

const components: Ref<Component[]> = ref([] as Component[]);

const factoryProvider = DIContainer.getService<ComponentFactoryProvider>(ServiceKeys.ComponentFactory);
const localStorageService = DIContainer.getService<LocalStorageService>(ServiceKeys.LocalStorageService);
const htmlElementsFactory = factoryProvider.getFactory(ComponentTypes.HtmlElements);

let componentFactory: Ref<ComponentFactory> = ref({} as ComponentFactory);

const HistoryM = new HistoryManager();

// Refs
const contextMenu = ref();
const contextMenuEditor = ref();

const selectedComponent: Ref<Component> = ref({} as Component);
const selectedProject: Ref<IProject> = ref({} as IProject);
const selectedComponentsType: Ref<ComponentTypes> = ref({} as ComponentTypes);
const selectedFile = ref<FileModel | null>(null);


const componentsType: Ref<Component> = ref({} as Component);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const keyOptions: Ref<number> = ref(0);
const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);
const isPreviewVisible: Ref<boolean> = ref(false);
const isSavingState: Ref<boolean> = ref(false);

const itemsContextComponent: Ref<ItemContextMenu[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as Component)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);
const itemsContextEditor: Ref<ItemContextMenu[]> = ref([
  {label: 'Annulla', icon: 'fa fa-undo', command: () => undo()},
  {label: 'Ripeti', icon: 'fa fa-redo', command: () => redo()},
]);

const showDraggableComponent = computed(()=>{
  return Object.keys(selectedProject.value)?.length && componentFactory.value
})


watch(components, (newVal) => {
  if (!isSavingState.value) {
    HistoryM.saveState(newVal);
  }
  updateGeneratedCode();
  isSavingState.value = false;

  if (selectedFile.value) {
    selectedFile.value.content = newVal;
    saveFileContent();
  }
}, { deep: true });


const onSelectFile = (file: FileModel) => {
  selectedFile.value = file;
  components.value = file.content || [];
  saveFileContent();
  saveProjects();
};

watch(selectedProject, (newProject) => {
  if (newProject && newProject.files.length > 0) {
    selectedFile.value = newProject.files[0];
    components.value = selectedFile.value?.content || [];
    saveFileContent();
  }
});

const saveFileContent = () => {
  if (selectedFile.value) {
    selectedFile.value.content = components.value;
    localStorageService.save('selectedFile', selectedFile.value);
    saveProjects();
  }
};

const saveProjects = () => {
  if (selectedProject.value) {

    // Trova l'indice del progetto corrente nella lista dei progetti salvati
    let projects = localStorageService.load('projects');

    if (typeof projects === 'string') {
      projects = JSON.parse(projects);
    }

    // Trova l'indice del progetto corrente nella lista dei progetti salvati
    const projectIndex = projects?.findIndex((p: IProject) => p.id === selectedProject.value.id);

    if (projectIndex >= 0) {
      // Aggiorna il progetto esistente
      projects[projectIndex] = selectedProject.value;
    } else {
      // Aggiungi un nuovo progetto se non esiste già
      projects.push(selectedProject.value);
    }

    localStorageService.save('projects', JSON.stringify(projects));
  }
};


const onProjectChange = (project: IProject) => {
  selectedProject.value = project;
  if (project.files.length > 0) {
    const file = project.files[0] as FileModel;
    selectedFile.value = file;
    components.value = file.content || [];
    saveFileContent();
  }
};

onMounted(() => {
  selectedComponentsType.value = localStorageService.load('componentsType');
  onChangeComponentsType();


  const file = localStorageService.load('selectedFile');
  if (file) {
    onSelectFile(file);
  }

   HistoryM.saveState(components.value);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
      event.preventDefault();
      redo();
    } else if (event.key === 'Delete') {
      event.preventDefault();
      removeComponent();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});


const onChangeComponentsType = (): void => {
  componentFactory.value = factoryProvider.getFactory(selectedComponentsType.value);
  localStorageService.save('componentsType', selectedComponentsType.value)
}

const handleComponentClick = (component: Component) => {
  selectedComponent.value = component;
  keyOptions.value = keyOptions.value + 1;
};

const onComponentRightClick = (event: any, component: Component) => {
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


const duplicateComponent = async (component: Component) => {
  if (component) {
    let newComponentOptions: DroppableComponent = component?.options && JSON.parse(JSON.stringify(component?.options)) || {};
    newComponentOptions= {...newComponentOptions, id: Date.now().toString()}
    newComponentOptions.class = (component?.options?.class || '').replace('selectedComponent', '');
    const newComponent: Component = componentFactory.value.createElement(newComponentOptions);

    if(Object.keys(newComponent).length>0){
      components.value = [...components.value, newComponent];
      if (newComponent?.options?.slot?.options) {
        await duplicateComponent(newComponent.options.slot);
      }

    }
  }
};

const removeComponent = (index: number = -1): boolean => {
  if (index < 0) {
    index = components.value.findIndex(x => x.options.id === selectedComponent.value?.options?.id);
  }
  if (index >= 0) {
    components.value.splice(index, 1);
    return true;
  }
  return false;
};


const undo = (): void => {
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
  const pathToComponent = DragDropHelper.findObjectById(components.value, cmpId.toString());
  if (pathToComponent !== null) {
    if (event.parentComponentId && index >= 0) {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent, index);
    } else {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent)
    }
  }
};

const onDrop = (event: any) => {
  if(!selectedProject) return;
  event.preventDefault();

  const dropTarget = event.target.closest('[data-drop-target]');
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && componentData?.trim() !== '' && JSON.parse(componentData);

  if (componentData.fromEditor) return;

  let draggedComponent;
  if (componentData.fromDroppableComponent) {
    if (componentData.parentComponentId) {
      const pathToComponent = DragDropHelper.findObjectById(components.value, componentData.parentComponentId);
      if (pathToComponent !== null) {
        if (componentData.component) {
          draggedComponent = componentData.component;
          DragDropHelper.removeObjectByPath(components.value, pathToComponent, componentData.index);
        }
      }
    } else {
      const pathToComponent = DragDropHelper.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DragDropHelper.removeObjectByPath(components.value, pathToComponent)));
      }
    }
  } else {
    draggedComponent = componentData?.slot ? componentData : { ...componentData, id: Date.now().toString(), slot: [] };
  }

  if (draggedComponent) {
    if (dropTarget && dropTarget.dataset.dropTarget === 'editor') {
      addComponent(draggedComponent, components.value);
      saveFileContent();
    }
  }
};

const addComponent = (component: any, targetComponents: any) => {
  if (Array.isArray(targetComponents)) {
    const newComponent = component.slot ? component : { ...component, id: Date.now(), slot: [] };
    targetComponents.push(componentFactory.value.createElement(newComponent));
    saveFileContent();
  } else {
    console.error('targetComponents non è un array', targetComponents);
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

const updateComponent = (updatedProps: DroppableProps) => {
  if (!selectedComponent.value?.options?.id) return;

  const index = components.value.findIndex(c => c?.options.id === selectedComponent.value?.options?.id);
  if (index !== -1) {
    components.value[index].options.attributes = selectedComponent.value.options.attributes = updatedProps;
    keyEditor.value++;
  }
};

const updateGeneratedCode = () => {
  if (!components.value.length) return;

  generatedCode.value = ProjectHelper.generateCodeFromComponents(components.value);
};

const updateNestedComponents = (id: string, nestedComponents: Component[]) => {
  const updateComponents = (componentsArray: Component[]) => {
    for (const component of componentsArray) {
      if (component?.options?.id?.toString() === id) {
        component.options.slot = nestedComponents;
        saveFileContent();
        return componentsArray;
      }
      if (component?.options?.slot?.options) {
        updateComponents(component.options.slot.options);
      }
    }
  };
  updateComponents(components.value);
};

// IMPORT / EXPORT
const exportHTML = () => {
  FilesHelper.exportHtml(generatedCode.value);
};

const exportProject = () => {
  if (selectedProject.value) {
    FilesHelper.exportProject(selectedProject.value.files);
  }
};

const importProject = async (event: any) => {
  const file = event.files[0];
  if (!file) return;

  const importedProject: IProject|boolean = await FilesHelper.importProject(file);
  if (typeof importedProject === 'object') {
    selectedProject.value = importedProject;
    components.value = selectedProject.value.files[0].content || [];
    saveProjects();
  }
};


const getBindAttributes = (attribute: DroppableProps)=>{
  if (!attribute) return;
  delete attribute?.selectedComponent;
  delete attribute?.parentComponents;
  return attribute;

}
</script>
<template>
  <div id="wrapper" @contextmenu.stop="onComponentRightClickEditor($event)">

    <ContextMenu ref="contextMenuEditor" :model="itemsContextEditor" />
    <ContextMenu ref="contextMenu" :model="itemsContextComponent" />

    <div class="container">
      <!-- PREVIEW -->
      <Sidebar v-model:visible="isPreviewVisible" style="width:90%" header="Preview">
        <div v-html="generatedCode" />
      </Sidebar>

      <Splitter class="w-full m-0" layout="horizontal">
        <!-- LEFT -->
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <Project v-model="selectedProject" v-model:components-type="selectedComponentsType" @change-components-type="onChangeComponentsType" @select-file="onSelectFile" />
            </div>
            <div class="flex-none w-full">
              <ImportExport @preview="isPreviewVisible = true" @exportHtml="exportHTML" @exportProject="exportProject" @importProject="importProject($event)" />
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <DraggableComponent v-model="componentsType" />
            </div>
          </div>
        </SplitterPanel>
        <!-- CENTER -->
        <SplitterPanel :size="45" class="flex flex-column h-full">
          <Panel class="overflow-y-auto flex-grow-1 h-full" header="Editor" id="panel-editor">
            <div class="editor" :key="keyEditor" @click="selectedComponent = {} as Component">
              <div
                  class="drop-area"
                  @drop="onDrop"
                  @dragover="onDragOver"
                  data-drop-target="editor"
                  data-component-id="editor"
              >
                <div
                    v-for="(component, index) in components"
                    :key="`${component.options?.id}-${component.options?.name}`"
                    :class="{'selectedComponent': selectedComponent?.options?.id === component?.options?.id, [component.options.class]: component?.options?.class?.length}"
                    class="draggable-component"
                    @drop="onDropComponent(index)"
                    draggable="true"
                    @dragstart="!component?.options?.locked ? onDragStart($event, index) : ''"
                    @dragenter="onDragEnter(index)"
                    @dragleave="onDragLeave()"
                >

                  <component
                      v-model:selectedComponent="selectedComponent"
                      :is="component.options?.tag || 'div'"
                      :class="component?.options?.class"
                      :style="component?.options?.style"
                      :componentId="component?.options?.id"
                      v-bind="getBindAttributes(component.options?.attributes as DroppableProps)"
                      :parentComponents="component?.options?.slot"
                      @updateSelectedComponent="handleComponentClick"
                      @updateNestedComponents="updateNestedComponents"
                      @click.stop="handleComponentClick(component)"
                      @removeComponent="removeDraggedComponent($event)"
                      @contextmenu.stop="!component?.options?.locked ? onComponentRightClick($event, component): ''"
                  >{{ component?.options?.inner }}</component>

                </div>
              </div>
            </div>
          </Panel>
          <!-- OUTPUT -->
          <OutputComponent v-model="generatedCode" />
        </SplitterPanel>

        <!-- RIGHT -->
        <SplitterPanel :size="20">
          <ComponentOptions v-if="selectedComponent" v-model:components="components" v-model:selectedComponent="selectedComponent" @update:model-value="updateComponent" />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
