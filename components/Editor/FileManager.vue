<script lang="ts" setup>
import {computed, defineProps, nextTick, onMounted, type Ref, ref} from 'vue';
import type {TFile} from '~/models/types/TFile';
import {DIContainer} from '~/DIContainer/DIContainer';
import {EServiceKeys} from '~/models/enum/EServiceKeys';
import type {LocalStorageService} from '~/services/LocalStorageService';
import {EFileTypes} from '~/models/enum/EFileTypes';
import type ContextMenu from "primevue/contextmenu";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IFileService} from "~/services/api/interfaces/IFileService";

const emit = defineEmits(['selectFile']);

const fileService: IFileService = ApiContainer.getService<IFileService>(EApiKeys.FileService);

const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

const files: Ref<File[]> = ref([]);
const newFileName = ref('');
const selectedNode = ref<TFile | null>(null);
const renameDialog = ref(false);
const contextMenu = ref<ContextMenu | null>(null);
const addFileDialog = ref(false);
const addFolderDialog = ref(false);
const treeSelectedKey = ref();

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const contextMenuItems = computed(() => {
  return [
    {
      label: 'Aggiungi',
      icon: 'pi pi-plus',
      visible: selectedNode.value?.type === EFileTypes.Folder,
      command: () => {
        if (selectedNode.value) {
          newFileName.value = '';
          addFileDialog.value = true;
        }
      },
    },
    {
      label: 'Rinomina',
      icon: 'pi pi-pencil',
      command: () => handleRename(),
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => handleDelete(),
    },
  ];
});

const formatTreeData: any = (files: TFile[]) => {
  return files.map(file => ({
    key: file.id,
    label: file.name,
    data: file,
    icon: file.type === EFileTypes.Folder ? 'pi pi-folder' : 'pi pi-file',
    children: file.type === EFileTypes.Folder && file.children ? formatTreeData(file.children) : null,
  }));
};

const treeData = computed(() => formatTreeData(files.value));

const onComponentRightClick = (event) => {
  event.preventDefault();
  selectFile(event.data)
  if (selectedNode.value) {
    nextTick(() => {
      if (contextMenu.value) {
        console.log('Showing context menu for:', selectedNode.value);
        contextMenu.value.show(event);
      } else {
        console.error('ContextMenu not found');
      }
    });
  } else {
    console.error('No node found for context menu');
  }
};

const selectFile = (node: TFile) => {
  selectedNode.value = node;
  console.log('Selected node:', node);
  emit('selectFile', node);
};


const renameFile = async () => {

  if (!selectedNode.value || !newFileName.value.trim()) {
    notifyManager.error('Seleziona un file/folder ed inserisci un nome valido');
  }
  try{
    LoadingManager.getInstance().start();

    if (selectedNode.value?.id && newFileName.value?.trim()) {

      const result = await fileService.updateFile(selectedNode.value.id, {...selectedNode.value, name: newFileName.value.trim()});
      await loadFiles();

      selectedNode.value = result;
      newFileName.value = '';
      renameDialog.value = false;
    }

  } catch (e) { notifyManager.error(e)
  } finally { LoadingManager.getInstance().stop(); }
};

const handleDelete = async () =>{
  try{
    LoadingManager.getInstance().start();

    if (selectedNode.value) {
      await fileService.deleteFile(selectedNode.value.id);
      await loadFiles();
      selectedNode.value = null;
    }
  } catch (e) { notifyManager.error(e)
  } finally { LoadingManager.getInstance().stop(); }
}

const handleRename = () =>{
  if (selectedNode.value) {
    newFileName.value = selectedNode.value.name;
    renameDialog.value = true;
  }
}

const handleAddFile = async (type: EFileTypes) => {
  try{
    LoadingManager.getInstance().start();

    const storedSelectedProjectId = localStorageService.load('selectedProjectId')

    const newFile: TFile = await fileService.createFile({
      name: newFileName.value,
      type: type,
      projectId: storedSelectedProjectId,
      parent: selectedNode.value || null,
      parentId: selectedNode.value?.id || null,
    })
    await loadFiles();

    newFileName.value = '';
    addFileDialog.value = false;
    addFolderDialog.value = false;

  } catch (e) { notifyManager.error(e);
  } finally { LoadingManager.getInstance().stop(); }
};

// Funzioni per aprire i dialog
const openCreateFileDialog = () => {
  addFileDialog.value = true;
};

const openCreateFolderDialog = () => {
  addFolderDialog.value = true;
};

const loadFiles = async () => {
  files.value = await fileService.getFiles({ "projectId.equals": props.projectId });
}

onMounted(async ()=> {
  try{
    await loadFiles();
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
});
</script>


<template>
  <div class="file-manager">
    <div class="flex">
        <Button @click="openCreateFileDialog" text  severity="success">
          <i class="fa fa-file-circle-plus" />
        </Button>
        <Button @click="openCreateFolderDialog" text severity="warning">
          <i class="fa fa-folder-plus" />
        </Button>
        <Button @click="handleRename" text severity="info">
          <i class="fa fa-file-edit" />
        </Button>
        <Button @click="handleDelete" text severity="danger">
          <i class="fa fa-trash" />
        </Button>
    </div>

    <Tree class="p-1" v-if="treeData?.length"
        v-model:selectionKeys="treeSelectedKey"
        :value="treeData"
        :selection-mode="'single'"
        :filter="true"
          filterMode="strict"
        :metaKeySelection="false"
        @node-select="(event) => {
          console.log('Node selected:', event.data);
          selectFile(event.data);
        }"
        @contextmenu="(event) => {
          console.log('contextmenu:', event.data);
          onComponentRightClick()
        }"
    />
    <p class="ml-3" v-else>Nessun file</p>

    <Dialog header="Rinomina File/Cartella" v-model:visible="renameDialog">
      <div class="p-fluid">
        <InputText @keyup.enter="renameFile" class="mb-2" v-model="newFileName" placeholder="Nuovo Nome" />
        <div class="dialog-footer">
          <Button @click="renameFile" icon="pi pi-check" severity="success" label="Conferma" />
          <Button class="ml-2" @click="() => renameDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Aggiungi File" v-model:visible="addFileDialog">
      <div class="p-fluid">
        <InputText class="mb-2" v-model="newFileName" placeholder="Nome File" @keyup.enter="handleAddFile(EFileTypes.File)" />
        <div class="dialog-footer">
          <Button @click="handleAddFile(EFileTypes.File)" icon="pi pi-check" severity="success" label="Aggiungi" />
          <Button class="ml-2" @click="() => addFileDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Aggiungi Cartella" v-model:visible="addFolderDialog">
      <div class="p-fluid">
        <InputText class="mb-2" v-model="newFileName" placeholder="Nome Cartella" @keyup.enter="handleAddFile(EFileTypes.Folder)" />
        <div class="dialog-footer">
          <Button @click="handleAddFile(EFileTypes.Folder)" icon="pi pi-check" severity="success" label="Aggiungi" />
          <Button class="ml-2" @click="() => addFolderDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <ContextMenu ref="contextMenu" :model="contextMenuItems"/>
  </div>
</template>

<style scoped>
.file-manager {
  margin-top: 20px;
}

.add-file {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
