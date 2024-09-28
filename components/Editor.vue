<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, onUnmounted, ref} from 'vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import ImportExport from "~/components/Editor/ImportExport.vue";
import {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import DraggableComponent from "~/components/Editor/DraggableComponent.vue";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import Project from "~/components/Editor/Project.vue";
import {type Project as IProject} from '~/models/interfaces/Project';
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {TFile} from "~/models/types/TFile";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {SaveManager} from "~/manager/SaveManager";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {LoadingManager} from "~/manager/LoadingManager";
import type {IFileService} from "~/services/api/interfaces/IFileService";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IComponentService} from "~/services/api/interfaces/IComponentService";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import {ComponentHelper} from "~/helper/ComponentHelper";
import type HistoryManager from "~/manager/HistoryManager";

const components = ref<IComponentFactory[]>([] as IComponentFactory[]);
const selectedProject = ref<IProject>({} as IProject);
const selectedComponent = ref<IComponentFactory>({} as IComponentFactory);
const selectedFile = ref<TFile | null>(null);
const componentsType: Ref<IComponentFactory> = ref({} as IComponentFactory);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const isEditorEnabled: Ref<boolean> = computed(()=>!!selectedFile.value && selectedFile.value.type===EFileTypes.File);
const isSavingState: Ref<boolean> = ref(false);

const projectRef = ref();

const fileService: IFileService = ApiContainer.getService<IFileService>(EApiKeys.FileService);
const componentService: IComponentService = ApiContainer.getService<IComponentService>(EApiKeys.ComponentService);
const factoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
let componentFactory: Ref<ComponentFactory> = ref({} as ComponentFactory); // verrà assegnata in modo dinamico
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const logNotify = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyAndLog);
const saveManager = new SaveManager<IComponentFactory>( () => console.error('TODO: Aggiungere callback SaveManager'), 1000);
const HistoryM = DIContainer.getService<HistoryManager>(EServiceKeys.HistoryManager);

const componentTree = computed(() => ComponentHelper.buildComponentTree(components.value));
const primeVueTreeNodes = computed(() => ComponentHelper.buildPrimeVueTree(components.value));

const getComponents = async (fileId?: number) => {
  try{
    LoadingManager.getInstance().start();

    fileId = fileId ? fileId : selectedFile.value?.id;
    components.value = null;
    const resultComponents = await componentService.getComponents({'fileId.equals': fileId});
    if (resultComponents) {
      components.value = ComponentHelper.createFactoryComponents(resultComponents || [], factoryProvider);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

const updateComponent = async (component: IDroppableComponent) => {
  if (!component?.options?.id && !selectedComponent.value?.options?.id) return;

  const componentOptions = component ? component.options: selectedComponent.value.options

  try{
    LoadingManager.getInstance().start();

    const index = components.value.findIndex(c => c?.options.id === componentOptions?.id);
    if (index !== -1) {
      const updatedComponent: IDroppableComponent = await componentService.updateComponent(componentOptions?.id, componentOptions);
      components.value[index] = componentFactory.value.updateElement(components.value[index], updatedComponent);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

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

const selectedTreeKey = ref();
const onTreeNodeSelect = (node) => {
  console.log('Nodo selezionato:', node);
  selectedComponent.value = node.data
  console.warn('Selezionare il componente')
};

onMounted(async () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
      event.preventDefault();
      redo();
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
<!--              <Tree :value="primeVueTreeNodes" v-model:selectionKeys="selectedTreeKey" selectionMode="single"  @node-select="onTreeNodeSelect" />-->
            </div>
          </div>
        </SplitterPanel>
        <!-- CENTER -->
        <SplitterPanel :size="45" class="flex flex-column h-full">
            <div class="editor" v-if="!isEditorEnabled">Seleziona prima un file per spostare gli elementi nell'editor</div>

          <Tabs value="0" v-if="isEditorEnabled">
            <TabList>
              <Tab value="0">Visual Editor</Tab>
              <Tab value="1">Code Editor</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0" class="overflow-y-auto flex-grow-1 h-full" id="panel-editor" style="height: calc(100vh - 200px) !important;">
                <div id="editor-components-wrapper" class="editor" :key="keyEditor" @click="selectedComponent = null">
                  <EditorPanel
                      v-model:components="componentTree"
                      v-model:selected-component="selectedComponent"
                      v-model:project="selectedProject"
                      v-model:file="selectedFile"
                      :component-factory="componentFactory"
                      @update-components="getComponents()"
                  />
                </div>
              </TabPanel>
              <TabPanel value="1" class="overflow-y-auto flex-grow-1 h-full" id="panel-editor" style="height: calc(100vh - 100px);">
                <Textarea :value="generatedCode" class="w-full min-h-full" />
              </TabPanel>
            </TabPanels>
          </Tabs>

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
