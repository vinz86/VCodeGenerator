<script setup lang="ts">
import type {Ref} from "vue";
import {nextTick, onMounted, onUnmounted, ref} from 'vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import {DragDropHelper} from "~/helper/DragDropHelper";
import type {DroppableProps} from "~/models/DroppableProps";
import {ProjectHelper} from "~/helper/ProjectHelper";
import ImportExport from "~/components/Editor/ImportExport.vue";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {TItemContextMenu} from "~/models/types/TItemContextMenu";
import DraggableComponent from "~/components/Editor/DraggableComponent.vue";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import Project from "~/components/Editor/Project.vue";
import {type Project as IProject} from '~/models/interfaces/Project';
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {TFile} from "~/models/types/TFile";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {SaveManager} from "~/manager/SaveManager";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {LoadingManager} from "~/manager/LoadingManager";
import type {IFileService} from "~/services/api/interfaces/IFileService";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IComponentService} from "~/services/api/interfaces/IComponentService";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import {ComponentHelper} from "~/helper/ComponentHelper";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ComponentRenderer from "~/components/Editor/ComponentRenderer.vue";

const components = ref<IComponentFactory[]>([] as IComponentFactory[]);
const selectedProject = ref<IProject>({} as IProject);
const selectedComponent = ref<IComponentFactory>({} as IComponentFactory);
const selectedFile = ref<TFile | null>(null);
const componentsType: Ref<IComponentFactory> = ref({} as IComponentFactory);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);
const isSavingState: Ref<boolean> = ref(false);

const isEditorEnabled: Ref<boolean> = computed(()=>!!selectedFile.value && selectedFile.value.type===EFileTypes.File);

const contextMenu = ref();
const projectRef = ref();

const fileService: IFileService = ApiContainer.getService<IFileService>(EApiKeys.FileService);
const componentService: IComponentService = ApiContainer.getService<IComponentService>(EApiKeys.ComponentService);
const factoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
let componentFactory: Ref<ComponentFactory> = ref({} as ComponentFactory); // verrà assegnata in modo dinamico
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
// const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
// const notifyManagerAndLogger = new LoggerDecorator(notifyManager, {level:ELoggerLevel.Debug, output: ELoggerOutput.LocalStorage, length: 50});
// const logNotify: INotifyManager = notifyManagerAndLogger.logMethodCalls();
const logNotify = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyAndLog);
const saveManager = new SaveManager<IComponentFactory>( () => console.error('TODO: Aggiungere callback SaveManager'), 1000);
// TODO: aggiungere HistoryManager in DI
//const HistoryM = new HistoryManager();

const itemsContextComponent: Ref<TItemContextMenu[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as IComponentFactory)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

const handleComponentClick = async (component: IComponentFactory) => {
  selectedComponent.value = null;
  await nextTick(()=>{
    selectedComponent.value = component;
  })
};

const handleComponentRightClick = (event: any, component: IComponentFactory) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    contextMenu.value.show(event);
  });
};

const duplicateComponent = async (component: IComponentFactory) => {
  if (component) {

  await addComponent(component, components.value);
  //TODO devo duplicare tutti i componenti contenuti al suo interno
      let newComponentOptions: IDroppableComponent = component?.options && JSON.parse(JSON.stringify(component?.options)) || {};
    newComponentOptions.className = (component?.options?.className || '').replace('selectedComponent', '');
    const newComponent: IComponentFactory = componentFactory.value.createElement(newComponentOptions);

    if(Object.keys(newComponent).length>0){
      components.value = [...components.value, newComponent];
      if (newComponent?.options?.slot?.options) {
        await duplicateComponent(newComponent.options.slot);
      }

    }
  }
};


const removeComponent = async (index?: string): boolean => {
  try{
    LoadingManager.getInstance().start();

    if (!index) {
      index = components.value.findIndex(x => x.options.id === selectedComponent.value?.options?.id);
    }

    if(index>=0){
      await componentService.deleteComponent(components.value[index]?.options?.id);

      if(selectedFile.value.id){
        await getComponents(selectedFile.value.id)
      }
      return true
    }
  } catch (e) {
    logNotify.error(e);
    return false;
  } finally {
    LoadingManager.getInstance().stop();
  }
};

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
  event.preventDefault();

  if(!selectedProject) return;

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
    draggedComponent = componentData?.slot ? componentData : componentData;
  }

  if (draggedComponent) {
    if (dropTarget && dropTarget.dataset.dropTarget === 'editor') {
      //components.value['tag'] = null;
      addComponent(draggedComponent, components.value);
    }
  }
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

const updateNestedComponents = (id: string, nestedComponents: IComponentFactory[]) => {
  const updateComponents = (componentsArray: IComponentFactory[]) => {
    for (const component of componentsArray) {
      if (component?.options?.id?.toString() === id) {
        component.options.slot = nestedComponents;
        return componentsArray;
      }
      if (component?.options?.slot !== undefined) {
        updateComponents(component.options.slot);
      }
    }
  };
  updateComponents(components.value);
};

//#
const getComponents = async (fileId?:number) => {
  components.value = null;
  const resultComponents = await componentService.getComponents({'fileId.equals': fileId});
  if (resultComponents) {
    components.value = ComponentHelper.createFactoryComponents(resultComponents || [], factoryProvider);
    debugger
  }
};

//#
const addComponent = async (component: IComponentFactory, targetComponents: IComponentFactory[]) => {
  try {
    LoadingManager.getInstance().start();
debugger
    if (Array.isArray(targetComponents)) {
      let newFactoryComponent = componentFactory.value.createElement(component);

      const parentId = ProjectHelper.findParentId(component, targetComponents);
      newFactoryComponent.configure({
        ...component,
        type: newFactoryComponent?.constructor?.name || '',
        fileId: selectedFile.value.id,
        order: ProjectHelper.getComponentOrder(parentId, targetComponents),
        parentId: parentId,
/*        inner: selectedComponent.value.inner,
        className: selectedComponent.value.class,*/
      });

      const resultCreateComponent = await componentService.createComponent(newFactoryComponent?.options);
      if(resultCreateComponent?.id){
        newFactoryComponent.configure({id: resultCreateComponent.id, style: resultCreateComponent?.style || ''});
      }
      targetComponents.push(newFactoryComponent);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

//#
const updateComponent = async (component: IDroppableComponent) => {
  if (!component?.options?.id && !selectedComponent.value?.options?.id) return;

  const componentOptions = component ? component.options: selectedComponent.value.options

  try{
    LoadingManager.getInstance().start();

    const index = components.value.findIndex(c => c?.options.id === componentOptions?.id);
    if (index !== -1) {
      //const className = componentOptions?.class || '';
      const updatedComponent: IDroppableComponent = await componentService.updateComponent(componentOptions?.id, {
        ...componentOptions,
        //className: className,
      });
      components.value[index] = componentFactory.value.updateElement(components.value[index], updatedComponent);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

//#
const onFileChange = async (fileId: number) => {
  try{
    LoadingManager.getInstance().start();
    const file = await fileService.getFileById(fileId);
    if (file){
      selectedFile.value = file;
      await getComponents(fileId)
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

//#
const onProjectChange = async (project: IProject) => {
  selectedProject.value = project;
  componentFactory.value = factoryProvider.getFactory(project.componentsTypes);

  if (project.files.length > 0) {
    const file = project.files[0] as TFile;
    await onFileChange(file)
  } else {
    selectedFile.value = {};
    components.value = []
  }
};


onMounted(async () => {
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
  //saveManager.startAutoSave(components, 5000);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    //saveManager.stopAutoSave();
  });
});


</script>
<template>
  <div id="wrapper">
    <ContextMenu ref="contextMenu" :model="itemsContextComponent" />

    <div class="container flex flex-column">
<!--      <EditorMenubar />-->

      <Splitter class="w-full m-0 flex-grow-1" layout="horizontal" >
        <!-- LEFT -->
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <Project
                  ref="projectRef"
                  v-model="selectedProject"
                  @select-project="onProjectChange"
                  @select-file="onFileChange" />
            </div>
            <div class="flex-none w-full">
              <ImportExport />
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="15">
          <div class="flex flex-column h-full">
            <div class="flex-grow-1">
              <BlockUI v-if="!isEditorEnabled">Seleziona file</BlockUI>
              <DraggableComponent v-else v-model="componentsType" :factory="componentFactory" />
            </div>
          </div>
        </SplitterPanel>
        <!-- CENTER -->
        <SplitterPanel :size="45" class="flex flex-column h-full">
            <div class="editor" v-if="!isEditorEnabled">Seleziona prima un file per spostare gli elementi nell'editor</div>
            <TabView v-if="isEditorEnabled">
              <TabPanel header="Visual Editor" class="overflow-y-auto flex-grow-1 h-full" id="panel-editor" style="height: calc(100vh - 100px);">

                <div class="editor" :key="keyEditor" @click="selectedComponent = null">
                  <div
                      class="drop-area"
                      @drop="onDrop"
                      @dragover="onDragOver"
                      data-drop-target="editor"
                      data-component-id="editor"
                  >
<!--                    <ComponentRenderer
                        v-model:components="components"
                        v-model:selectedComponent="selectedComponent"
                        v-model:componentFactory="componentFactory"
                        @updateNestedComponents="updateNestedComponents"
                        @removeComponent="removeDraggedComponent"
                    />-->



<!--                :class="{
                      'selectedComponent': selectedComponent?.options?.id === component?.options?.id,
                      [component?.options?.class]: component?.options?.class?.length
                    }"-->
                      <div
                        v-for="(component, index) in components"
                        :key="`${component?.options?.id}-${index}`"
                        :class="{
                          'selectedComponent': selectedComponent?.options?.id === component?.options?.id,                         }"
                        class="draggable-component"
                        @drop="onDropComponent(index)"
                        draggable="true"
                        @dragstart="!component?.options?.locked ? onDragStart($event, index) : ''"
                        @dragenter="onDragEnter(index)"
                        @dragleave="onDragLeave()"
                        @contextmenu.stop="handleComponentClick(component); handleComponentRightClick($event);"
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
                            @removeComponent="removeDraggedComponent($event)"
                            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
                            @click.stop="handleComponentClick(component)"
                        />
                      </template>
                      <template v-else>
                        <component
                            v-if="component.options?.inner?.trim()!==''"
                            v-model:selectedComponent="selectedComponent"
                            :is="component.render()"
                            :class="{[component?.options?.class]: component?.options?.class?.length}"
                            :style="component?.options?.style"
                            :componentId="component?.options?.id"
                            :parentComponents="component?.options?.children"
                            v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"
                            @updateSelectedComponent="handleComponentClick"
                            @updateNestedComponents="updateNestedComponents"
                            @removeComponent="removeDraggedComponent($event)"
                            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
                            @click.stop="handleComponentClick(component)"
                        >{{ component.options?.inner }}</component>

                        <component
                            v-else
                            v-model:selectedComponent="selectedComponent"
                            :is="component.render()"
                            :class="{[component?.options?.class]: component?.options?.class?.length}"
                            :style="component?.options?.style"
                            :componentId="component?.options?.id"
                            :parentComponents="component?.options?.children"
                            v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"
                            @updateSelectedComponent="handleComponentClick"
                            @updateNestedComponents="updateNestedComponents"
                            @removeComponent="removeDraggedComponent($event)"
                            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
                            @click.stop="handleComponentClick(component)"
                        />
                      </template>
<!--                      <component
                          v-else
                          v-model:selectedComponent="selectedComponent"
                          :is="component.render()"
                          :class="{[component?.options?.class]: component?.options?.class?.length}"
                          :style="component?.options?.style"
                          :componentId="component?.options?.id"
                          :parentComponents="component?.options?.children"
                          v-bind="ProjectHelper.getBindAttributes(component.options as DroppableProps) || {}"
                          @updateSelectedComponent="handleComponentClick"
                          @updateNestedComponents="updateNestedComponents"
                          @removeComponent="removeDraggedComponent($event)"
                          @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
                          @click.stop="handleComponentClick(component)"
                       >{{ component.options?.inner }}</component>-->

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
          <ComponentOptions v-if="selectedComponent" v-model:components="components" v-model:selectedComponent="selectedComponent" @update:selectedComponent="updateComponent" />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
