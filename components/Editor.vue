<script setup lang="ts">
import type {Ref} from "vue";
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import {DragDropHelper} from "~/helper/DragDropHelper";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import type {DroppableProps} from "~/models/DroppableProps";
import {ExportHelper} from "~/helper/ExportHelper";
import {ProjectHelper} from "~/helper/ProjectHelper";
import HistoryManager from "~/manager/HistoryManager";
import ImportExport from "~/components/Editor/ImportExport.vue";
import OutputComponent from "~/components/Editor/OutputComponent.vue";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactory";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {IComponent} from "~/models/interfaces/IComponent";
import type {TItemContextMenu} from "~/models/types/TItemContextMenu";
import DraggableComponent from "~/components/Editor/DraggableComponent.vue";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import Project from "~/components/Editor/Project.vue";
import {type Project as IProject} from '~/models/interfaces/Project';
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {TFile} from "~/models/types/TFile";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {LoggerDecorator} from "~/decorator/LoggerDecorator";
import {ELoggerLevel} from "~/models/enum/ELoggerLevel";
import {ELoggerOutput} from "~/models/enum/ELoggerOutput";
import {SaveManager} from "~/manager/SaveManager";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";

const components: Ref<IComponent[]> = ref([] as IComponent[]);
const selectedComponent: Ref<IComponent> = ref({} as IComponent);
const selectedProject: Ref<IProject> = ref({} as IProject);
const selectedComponentsType: Ref<EComponentTypes> = ref({} as EComponentTypes);
const selectedFile = ref<TFile | null>(null);
const componentsType: Ref<IComponent> = ref({} as IComponent);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const keyOptions: Ref<number> = ref(0);
const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);
const isSavingState: Ref<boolean> = ref(false);

const isEditorEnabled: Ref<boolean> = computed(()=>!!selectedFile.value && selectedFile.value.type==='file');

const contextMenu = ref();
const contextMenuEditor = ref();

const factoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
let componentFactory: Ref<ComponentFactory> = ref({} as ComponentFactory); // verrà assegnata in modo dinamico
//const htmlElementsFactory = factoryProvider.getFactory(EComponentTypes.HtmlElements);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const notifyManagerAndLogger = new LoggerDecorator(notifyManager, {level:ELoggerLevel.Debug, output: ELoggerOutput.LocalStorage, length: 50});
const logNotify: INotifyManager = notifyManagerAndLogger.logMethodCalls();
const saveManager = new SaveManager<IComponent>( () => saveFileContent(), 1000);

const HistoryM = new HistoryManager();

const itemsContextComponent: Ref<TItemContextMenu[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as IComponent)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);
const itemsContextEditor: Ref<TItemContextMenu[]> = ref([
  {label: 'Annulla', icon: 'fa fa-undo', command: () => undo()},
  {label: 'Ripeti', icon: 'fa fa-redo', command: () => redo()},
]);

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

watch(selectedProject, (newProject) => {
  if (newProject && newProject.files.length > 0) {
    selectedFile.value = newProject.files[0];
    components.value = selectedFile.value?.content || [];
    saveFileContent();
  }
});


const onSelectFile = (file: TFile) => {
  selectedFile.value = file;
  components.value = file.content || [];
  saveFileContent();
  saveProjects();
};


const saveFileContent = () => {
  if (selectedFile.value && selectedProject) {
    selectedFile.value.content = components.value;
    localStorageService.save('selectedFile', selectedFile.value);
    saveProjects();
  }
};

const saveProjects = () => {
  if (selectedProject.value) {

    // Trova l'indice del progetto corrente nella lista dei progetti salvati
    let projects = localStorageService.load('projects') || [];

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
    const file = project.files[0] as TFile;
    selectedFile.value = file;
    components.value = file.content || [];
    saveFileContent();
  }
};

onMounted(async () => {

  selectedComponentsType.value = localStorageService.load('componentsType') || EComponentTypes.PrimeVue;
  await nextTick(()=>{
    onChangeComponentsType();
  })


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

  saveManager.startAutoSave(components, 5000);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    saveManager.stopAutoSave();
  });
});


const onChangeComponentsType = (): void => {
  componentFactory.value = factoryProvider.getFactory(selectedComponentsType.value);
  localStorageService.save('componentsType', selectedComponentsType.value)
}

const handleComponentClick = (component: IComponent) => {
  selectedComponent.value = component;
  keyOptions.value = keyOptions.value + 1;
};

const onComponentRightClick = (event: any, component: IComponent) => {
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


const duplicateComponent = async (component: IComponent) => {
  if (component) {
    let newComponentOptions: IDroppableComponent = component?.options && JSON.parse(JSON.stringify(component?.options)) || {};
    newComponentOptions= {...newComponentOptions, id: Date.now().toString()}
    newComponentOptions.class = (component?.options?.class || '').replace('selectedComponent', '');
    const newComponent: IComponent = componentFactory.value.createElement(newComponentOptions);

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

  const cmpId = event?.options?.parentComponentId ? event?.options?.parentComponentId : event?.options?.id;
  const index = event.draggedIndex;
  const pathToComponent = DragDropHelper.findObjectById(components.value, cmpId?.toString() || Date.now());
  if (pathToComponent !== null) {
    if (event?.options?.parentComponentId && index >= 0) {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent, index);
    } else {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent)
    }
  }
};

const onDrop = (event: any) => {
  debugger
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
    draggedComponent = componentData?.slot ? componentData : { id: Date.now().toString(), slot: [], ...componentData };
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
    const newComponent = component.slot ? component : { id: Date.now(), slot: [], ...component };

    targetComponents.push(componentFactory.value.createElement(newComponent));
    saveFileContent();
  } else {
    console.error('targetComponents non è un array', targetComponents);
  }
};


const onDragStart = (event: any, index: number) => {
  debugger
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && JSON.parse(componentData);
  if (!componentData.fromDroppableComponent) {
    draggedComponentIndex.value = index;
    draggedFrom.value = 'index';
    event.dataTransfer.setData('component', JSON.stringify({ fromEditor: true, ...components.value[index] }));
  }
};

const onDragEnter = (index: number) => dragOverIndex.value = index;

const onDragLeave = () => dragOverIndex.value = null;

const onDragOver = (event: any) => event.preventDefault();

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



  componentFactory.updateElement(selectedComponent.value, options);

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

const updateNestedComponents = (id: string, nestedComponents: IComponent[]) => {
  const updateComponents = (componentsArray: IComponent[]) => {
    for (const component of componentsArray) {
      if (component?.options?.id?.toString() === id) {
        component.options.slot = nestedComponents;
        saveFileContent();
        return componentsArray;
      }
      if (component?.options?.slot !== undefined) {
        updateComponents(component.options.slot);
      }
    }
  };
  updateComponents(components.value);
};

const getComponent = (component: IComponent)=> component?.render || 'div';

// IMPORT / EXPORT
const exportProject = () => selectedProject.value && ExportHelper.exportProject(selectedProject.value.files);

const importProject = async (event: any) => {
  const file = event.files[0];
  if (!file) return;

  const importedProject: IProject|boolean = await ExportHelper.importProject(file);
  if (typeof importedProject === 'object') {
    selectedProject.value = importedProject;
    components.value = selectedProject.value.files[0].content || [];
    saveProjects();
  }
};




</script>
<template>
  <div id="wrapper" @contextmenu.stop="onComponentRightClickEditor($event)">

    <ContextMenu ref="contextMenuEditor" :model="itemsContextEditor" />
    <ContextMenu ref="contextMenu" :model="itemsContextComponent" />

    <div class="container">

      <Splitter class="w-full m-0" layout="horizontal">
        <!-- LEFT -->
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <Project
                  v-model="selectedProject"
                  v-model:components-type="selectedComponentsType"
                  @change-selected-project="onProjectChange"
                  @change-components-type="onChangeComponentsType"
                  @select-file="onSelectFile" />
            </div>
            <div class="flex-none w-full">
              <ImportExport
                  @exportProject="exportProject"
                  @importProject="importProject($event)" />
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <p class="ml-2" v-if="!isEditorEnabled">Seleziona file</p>
              <DraggableComponent v-else v-model="componentsType" :factory="componentFactory" />
            </div>
          </div>
        </SplitterPanel>
        <!-- CENTER -->
        <SplitterPanel :size="45" class="flex flex-column h-full">
            <div class="editor" v-if="!isEditorEnabled">Seleziona prima un file per spostare gli elementi nell'editor</div>
            <TabView v-if="isEditorEnabled">
              <TabPanel header="Visual Editor" class="overflow-y-auto flex-grow-1 h-full" id="panel-editor" style="height: calc(100vh - 100px);">

                <div class="editor" :key="keyEditor" @click="selectedComponent = {} as IComponent">
                  <div
                      class="drop-area"
                      @drop="onDrop"
                      @dragover="onDragOver"
                      data-drop-target="editor"
                      data-component-id="editor"
                  >
                    <div
                        v-for="(component, index) in components"
                        :key="`${component?.options?.id}-${component?.options?.name}`"
                        :class="{'selectedComponent': selectedComponent?.options?.id === component?.options?.id, [component?.options?.class]: component?.options?.class?.length}"
                        class="draggable-component"
                        @drop="onDropComponent(index)"
                        draggable="true"
                        @dragstart="!component?.options?.locked ? onDragStart($event, index) : ''"
                        @dragenter="onDragEnter(index)"
                        @dragleave="onDragLeave()"
                    >

                      <template v-if="component.options?.name==='DroppableComponent'">
                        <DroppableComponent
                            :attributes="component?.options?.attributes"
                            :component-id="component?.options?.id as string"
                            :parent-components="component.options.slot"
                            v-model:selectedComponent="selectedComponent.options"
                            v-model:component-factory="componentFactory"
                            @updateSelectedComponent="handleComponentClick"
                            @updateNestedComponents="updateNestedComponents"
                            @click.stop="handleComponentClick(component)"
                            @removeComponent="removeDraggedComponent($event)"
                            @contextmenu.stop="!component?.options?.locked ? onComponentRightClick($event, component): ''"
                        />
                      </template>
                      <component
                          v-else
                          v-model:selectedComponent="selectedComponent"
                          :is="getComponent(component)"
                          :class="component?.options?.class"
                          :style="component?.options?.style"
                          :componentId="component?.options?.id"
                          v-bind="ProjectHelper.getBindAttributes(component.options?.attributes as DroppableProps)"
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
              </TabPanel>
              <TabPanel header="Code Editor">

                <Textarea :value="generatedCode" class="w-full min-h-full" />
              </TabPanel>
            </TabView>
          <!-- OUTPUT -->
<!--          <OutputComponent v-model="generatedCode" />-->
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
