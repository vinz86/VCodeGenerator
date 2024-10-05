<script lang="ts" setup>
import {computed, nextTick, onMounted, type Ref, ref} from 'vue';

import type {TFile} from '~/models/types/TFile';
import {DIContainer} from '~/DIContainer/DIContainer';
import {EServiceKeys} from '~/models/enum/EServiceKeys';
import type {LocalStorageService} from '~/services/LocalStorageService';
import {EFileTypes} from '~/models/enum/EFileTypes';
import type ContextMenu from "primevue/contextmenu";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {Api} from "~/services/api/core/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IFileService} from "~/services/api/services/interfaces/IFileService";
import {EApiFilters} from "~/services/api/core/models/enum/EApiFilters";
import {ApiFilterBuilder} from "~/services/api/core/ApiFilterBuilder";
import {FileHelper} from "~/helper/FileHelper";
import type {TProject} from "~/models/interfaces/TProject";
import type {TItemContextMenu} from "~/models/types/TItemContextMenu";
import {useAppStore} from "~/store/AppStore";
import AddFile from "~/components/modals/files/AddFile.vue";
import type DialogManager from "~/manager/DialogManager";
import type ConfirmManager from "~/manager/ConfirmManager";
import {EConfirmType} from "~/manager/ConfirmManager";
import type {TreeNode} from "primevue/treenode";

const emit = defineEmits(['selectFile']);

const contextMenuFileRef = ref();

const appStore = useAppStore();

const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);

const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const dialogManager = DIContainer.getService<DialogManager>(EServiceKeys.DialogManager);
const confirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

const apiFilter = new ApiFilterBuilder();

const files: Ref<File[]> = ref([]);
const contextMenu = ref<ContextMenu | null>(null);
const treeSelectedKey = ref();

const selectedProject: Ref<TProject> = defineModel<TProject>('selectedProject');
const selectedFile: Ref<TFile> = defineModel<File>('selectedFile');

const treeData = computed(() => formatTreeData(files.value));

const contextMenuItems: ComputedRef<TItemContextMenu> = computed(() => {
  return [
    {
      label: 'Aggiungi File',
      icon: 'pi pi-file',
      command: () => openCreateFileDialog(),
    },
    {
      label: 'Aggiungi Cartella',
      icon: 'pi pi-file',
      command: () => openCreateFolderDialog(),
    },
    {
      label: 'Rinomina',
      icon: 'pi pi-pencil',
      command: () => handleRename(),
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () =>
          confirmManager
              .setMessage(`Confermi l'eliminazione del file ${selectedFile.value?.name}?`)
              .setType(EConfirmType.DIALOG)
              .setAcceptCallback(async () => {
                await handleDelete();
              })
              .open(),
    },
  ];
});

const formatTreeData = (files: TFile[], parentId: string | null = null): TreeNode[] => {
  return files
      .filter(file => file.parentId === parentId)
      .map(file => ({
        key: file.id,
        label: file.name,
        data: file,
        icon: file.type === EFileTypes.Folder ? 'pi pi-folder' : 'pi pi-file',
        children: formatTreeData(files, file.id),
      }));
};

const onComponentRightClick = (event) => {
  event.preventDefault();

  const clickedFileId = event?.currentTarget?.id && parseInt(event.currentTarget.id);
  if (!clickedFileId) return;

  const file = FileHelper.findById(clickedFileId, files.value);
  if (!file) return;

  selectFile(file);

  if (selectedFile.value) {
    nextTick(() => {
      if (contextMenuFileRef.value) {
        contextMenuFileRef.value.show(event);
      } else {
        console.error('ContextMenu non trovato');
      }
    });
  } else {
    console.error('No node found for context menu');
  }
};

const selectFile = (node: TFile) => {
  selectedFile.value = node;
  if(selectedFile.value?.id){
    appStore.setFile(selectedFile.value);
    appStore.setComponent({});
  }
};

const handleDelete = async () =>{
  await FileHelper.deleteFile(selectedFile.value?.id);
  await getFiles();
  selectFile({});
}

const handleRename = () =>{
  dialogManager.setComponent(AddFile).setTitle('Rinomina File').setProps({ style:{ width:'50%' } })
      .setData({editMode: true, selectedFile: selectedFile.value})
      .setOnClose((response)=> response.data?.edited && getFiles())
      .open();

}

const openCreateFileDialog = () => {
  dialogManager.setComponent(AddFile).setTitle('Aggiungi').setProps({ style:{ width:'50%' } })
      .setData({edit: false, type: EFileTypes.File, projectId: selectedProject.value?.id, selectedFile: selectedFile.value})
      .setOnClose((response)=> response.data?.edited && getFiles())
      .open();

};

const openCreateFolderDialog = () => {
  dialogManager.setComponent(AddFile).setTitle('Aggiungi').setProps({ style:{ width:'50%' } })
      .setData({edit: true, type: EFileTypes.Folder, projectId: selectedProject.value?.id, selectedFile: selectedFile.value})
      .setOnClose((response)=> response.data?.edited && getFiles())
      .open();
};

const getFiles = async () => {
  const queryParams = apiFilter
      .addFilter('projectId', selectedProject.value?.id, EApiFilters.EQUALS)
      .build('json');
  files.value = await fileService.getFiles(queryParams);
  await nextTick();
}

const loadFiles = async () => {
  try{
    if(selectedProject.value?.id){
      await getFiles();
      const selectedFileId: number = selectedFile.value.id || localStorageService.load('selectedFileId') || null;

      if (!!selectedFileId && files.value?.length){
        const selectedFile = FileHelper.findById(selectedFileId, files.value);

        if (selectedFile) {
          selectFile(selectedFile);
        }
      }

    }
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
}

watch(selectedProject, async () => await loadFiles());

onMounted(async ()=> {
  await loadFiles();
});

</script>


<template>
  <div class="file-manager-wrapper">
    <ContextMenu ref="contextMenuFileRef" :model="contextMenuItems" />

    <div class="flex justify-content-around">
        <Button text severity="success"  @click="openCreateFileDialog">
          <i class="fa fa-file-circle-plus" />
        </Button>
        <Button text severity="warning" @click="openCreateFolderDialog">
          <i class="fa fa-folder-plus" />
        </Button>
        <Button text severity="info" @click="handleRename">
          <i class="fa fa-file-edit" />
        </Button>
        <Button
text severity="danger" @click="
          confirmManager
              .setMessage(`Confermi l'eliminazione del file ${selectedFile.name}?`)
              .setType(EConfirmType.DIALOG)
              .setAcceptCallback(async () => {
                await handleDelete();
              })
              .open()"
        >
          <i class="fa fa-trash" />
        </Button>
    </div>

    <div v-if="treeData?.length" >
<!--      <pre>
        {{ treeData }}
      </pre>-->
      <Tree
          v-model:selection-keys="treeSelectedKey"
          class="p-0"
          :pt="{
    pcFilterInput: { style: { width: '100%' } },
  }"
          :value="treeData"
          :selection-mode="'single'"
          :filter="true"
          filter-mode="strict"
          :meta-key-selection="false"
          :highlight-on-select="true"
          @node-select="(event) => selectFile(event.data)"
          @node-contextmenu="onComponentRightClick"
          >
        <template #default="slotProps">
          <div
              :id="slotProps.node.key"
              @contextmenu="onComponentRightClick"
          >
            <span class="w-full">{{ slotProps.node.label }}</span>
          </div>
        </template>
      </Tree>
    </div>
    <p v-else class="m-3">Nessun file</p>

  </div>
</template>

<style scoped>
</style>
