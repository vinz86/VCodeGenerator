<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, onUnmounted, ref} from 'vue';
import ComponentOptions from "~/components/Editor/ComponentOptions.vue";
import type {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import DraggableComponent from "~/components/Editor/DraggableComponent.vue";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {TProject as IProject} from '~/models/interfaces/TProject';
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {TFile} from "~/models/types/TFile";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {SaveManager} from "~/manager/SaveManager";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {LoadingManager} from "~/manager/LoadingManager";
import type {IFileService} from "~/services/api/services/interfaces/IFileService";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IComponentService} from "~/services/api/services/interfaces/IComponentService";
import type {TComponentOptions} from "~/models/types/TComponentOptions";
import {ComponentHelper} from "~/helper/ComponentHelper";
import type HistoryManager from "~/manager/HistoryManager";
import type {ICodeGenerator} from "~/services/api/services/interfaces/ICodeGenerator";
import {ApiFilterBuilder} from "~/services/api/core/ApiFilterBuilder";
import {EApiFilters} from "~/services/api/core/models/enum/EApiFilters";
import {useAppStore} from "~/store/AppStore";
import FileManager from "~/components/Editor/FileManager.vue";
import NoProjectSelected from "~/components/project/NoProjectSelected.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";

const components = ref<IComponentFactory[]>([] as IComponentFactory[]);
const selectedProject: Ref<IProject> = ref<IProject>({} as IProject);
const selectedComponent: Ref<IComponentFactory>  = ref<IComponentFactory>({} as IComponentFactory);
const selectedFile: Ref<TFile | null> = ref<TFile | null>(null);
const componentsType: Ref<IComponentFactory> = ref({} as IComponentFactory);
const generatedCode: Ref<string> = ref('');
const keyEditor: Ref<number> = ref(0);
const isEditorEnabled: Ref<boolean> = computed(()=>!!selectedFile.value && selectedFile.value.type===EFileTypes.File);
const isSavingState: Ref<boolean> = ref(false);

const projectRef = ref();

// servizi
const apiFilter = new ApiFilterBuilder();
const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
const componentService: IComponentService = Api.getService<IComponentService>(ApiKeys.ComponentService);
const codeService: ICodeGenerator = Api.getService<ICodeGenerator>(ApiKeys.CodeGeneratorService);

// dipendenze
const factoryProvider = DIContainer.getService<ComponentFactoryProvider>(EServiceKeys.ComponentFactory);
const componentFactory: Ref<ComponentFactory> = ref({} as ComponentFactory); // verrà assegnata in modo dinamico
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
//const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyAndLog);
const saveManager = new SaveManager<IComponentFactory>( () => console.error('TODO: Aggiungere callback SaveManager'), 1000);
const HistoryM = DIContainer.getService<HistoryManager>(EServiceKeys.HistoryManager);

// stores
const appStore = useAppStore();

const componentTree = computed(() => ComponentHelper.buildComponentTree(components.value));
const primeVueTreeNodes = computed(() => ComponentHelper.buildPrimeVueTree(components.value));

const getComponents = async (fileId?: number) => {
  try{
    LoadingManager.getInstance().start();

    fileId = fileId ? fileId : selectedFile.value?.id;
    if(!fileId) return;

    components.value = null;
    const queryParams = apiFilter
        .addFilter('fileId', fileId, EApiFilters.EQUALS)
        .build('json');
    const resultComponents = await componentService.getComponents(queryParams);
    if (resultComponents) {
      components.value = ComponentHelper.createFactoryComponents(resultComponents || [], factoryProvider);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

const updateComponent = async (component: TComponentOptions) => {
  if (!component?.options?.id && !selectedComponent.value?.options?.id) return;

  const componentOptions = component ? component.options: selectedComponent.value.options

  try{
    LoadingManager.getInstance().start();

    const index = components.value.findIndex(c => c?.options.id === componentOptions?.id);
    if (index !== -1) {
      const updatedComponent: TComponentOptions = await componentService.updateComponent(componentOptions?.id, componentOptions);
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
      appStore.setFile(file)
      appStore.setComponent({})
      await getComponents(fileId)
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

const onProjectChange = async (project: Project) => {
  if (!project) return;

  selectedProject.value = project;
  componentFactory.value = factoryProvider.getFactory(project.componentsTypes);
  appStore.setProject(project)
  localStorageService.save('selectedProject', project);
  appStore.setFile({})
  appStore.setComponent({})

  if (project.files?.length > 0) {
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

watch(components, async ()=>{
  try{
    LoadingManager.getInstance().start();
    if(selectedFile.value.id){
      generatedCode.value = await codeService.generateCodeByFileId(selectedFile.value.id);
    }
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
})

const unselectProject = () => {
  selectedProject.value = {};
  appStore.setProject({})
}


const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    undo();
  } else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
    event.preventDefault();
    redo();
  }
};

watch(selectedFile, async () => await getComponents(selectedFile.value?.id));

onMounted(async () => {
  try{
    const lsProject = localStorageService.load('selectedProject');
    if(lsProject){
      await onProjectChange(lsProject);
    }
  }
  catch (e){
    console.log(e)
  }

  window.addEventListener('keydown', handleKeyDown);
  //saveManager.startAutoSave(components, 5000);
});


onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  // saveManager.stopAutoSave();
});

defineExpose({unselectProject})
</script>
<template>
  <div class="w-full">
    <EditorMenubar
        v-if="Object.keys(selectedProject).length"
        class="pt-1 pb-1 border-round"
        style="background-color: rgba(239,239,239,0.6); border-top:1px solid #dedede; border-bottom:1px solid #dedede;"
        @add-project="onProjectChange($event)"
        @edit-project="onProjectChange($event)"
        @select-project="onProjectChange($event)"
        @delete-project="onProjectChange($event)"
    />
  </div>
  <div class="flex">
    <div class="w-6rem" style="border-right: 1px solid #dedede;">
      <Button outlined class="w-5rem h-5rem m-2 mb-0" severity="primary" size="large">
        <i class="pi pi-plus text-3xl font-bold" />
      </Button>
      <Button outlined class="w-5rem h-5rem m-2 mb-0" severity="warn" size="large">
        <i class="pi pi-folder-open text-3xl" />
      </Button>
      <Button outlined class="w-5rem h-5rem m-2 mb-0" severity="info" size="large">
        <i class="pi pi-save text-3xl" />
      </Button>
      <Button outlined class="w-5rem h-5rem m-2 mb-0" severity="success" size="large">
        <i class="pi pi-file-export text-3xl" />
      </Button>
      <Button outlined class="w-5rem h-5rem m-2 mb-0" severity="secondary" size="large">
        <i class="pi pi-ellipsis-h text-3xl" />
      </Button>
    </div>
    <div class="flex-grow-1">

      <div id="wrapper">
        <div class="editor-container flex flex-column">

          <div v-if="!Object.keys(selectedProject).length" class="editor">
            <NoProjectSelected @select-project="onProjectChange($event)" />
          </div>

          <Splitter v-else class="w-full m-0 flex-grow-1 border-none" layout="horizontal" >
            <!-- LEFT -->
            <SplitterPanel :size="15">
              <div class="flex flex-column h-full pt-2">
                <div class="flex-grow-1">
                  <Tabs value="0">
                    <TabList>
                      <Tab value="0">Files</Tab>
                      <Tab value="1">Componenti</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel value="0">
                        <FileManager
                            v-if="selectedProject.id"
                            v-model:selected-project="selectedProject"
                            v-model:selected-file="selectedFile"
                            @select-file="getComponents"
                        />
                      </TabPanel>
                      <TabPanel value="1">
                        <!--                     <Tree :value="primeVueTreeNodes" v-model:selectionKeys="selectedTreeKey" selectionMode="single"  @node-select="onTreeNodeSelect" />-->
                      </TabPanel>
                    </TabPanels>
                  </Tabs>

                </div>
                <div class="flex-none w-full"/>
              </div>
            </SplitterPanel>
            <SplitterPanel :size="10">
              <div class="flex flex-column h-full pt-2">
                <div class="flex-grow-1">
                  <BlockUI v-if="!isEditorEnabled">Seleziona file</BlockUI>
                  <DraggableComponent v-else v-model="componentsType" :factory="componentFactory" />
                </div>
              </div>
            </SplitterPanel>
            <!-- CENTER -->
            <SplitterPanel :size="45" class="flex flex-column h-full">

              <div v-if="!isEditorEnabled" class="p-2">
                Seleziona o crea un file
              </div>
              <Tabs v-if="isEditorEnabled" value="0">
                <TabList>
                  <Tab value="0">Visual Editor</Tab>
                  <Tab value="1">Code Editor</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel id="panel-editor" value="0" class="overflow-y-auto flex-grow-1 h-full mt-2" style="height: calc(100vh - 200px) !important;">
                    <div id="editor-components-wrapper" :key="keyEditor" class="editor" @click="selectedComponent = null">
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
                  <TabPanel id="panel-editor" value="1" class="overflow-y-auto flex-grow-1 h-full" style="height: calc(100vh - 100px);">
                    <Textarea :value="generatedCode.code" class="w-full min-h-full" />
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <!-- OUTPUT -->
              <!--          <OutputComponent v-model="generatedCode" />-->
            </SplitterPanel>

            <!-- RIGHT -->
            <SplitterPanel :size="25">
              <ComponentOptions v-if="selectedComponent" v-model:components="components" v-model:selected-component="selectedComponent" @update:selected-component="updateComponent" />
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
