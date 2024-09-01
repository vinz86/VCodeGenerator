<script lang="ts" setup>
import {computed, defineProps, nextTick, onMounted, type Ref, ref} from 'vue';
import type {TFile} from '~/models/types/TFile';
import {DIContainer} from '~/DIContainer/DIContainer';
import {EServiceKeys} from '~/models/enum/EServiceKeys';
import type {LocalStorageService} from '~/services/LocalStorageService';
import type {IFileService} from '~/models/interfaces/IFileService';
import {EFileTypes} from '~/models/enum/EFileTypes';
import type ContextMenu from "primevue/contextmenu";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IFileRepository} from "~/services/api/interfaces/IFileRepository";

const emit = defineEmits(['selectFile']);

const fileRepository: IFileRepository = ApiContainer.getService<IFileRepository>(EApiKeys.FileRepository);

const fileService = DIContainer.getService<IFileService>(EServiceKeys.FileService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

const files: Ref<File[]> = ref([]);
const newFileName = ref('');
const newFileType = ref<EFileTypes>(EFileTypes.File);
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

onMounted(async ()=> {
  try{
    await loadFiles();
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
});

const loadFiles = async () => {
  files.value = await fileRepository.getFiles({ "projectId.equals": props.projectId });
}
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

const onComponentRightClick = () => {
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

const addFileToRoot = () => {
  if (files.value && newFileName.value.trim()) {
    const newFile = fileService.createFile(newFileName.value, EFileTypes.File);
    files.value.push(newFile);
    newFileName.value = '';
  } else {
    console.warn('Progetto non selezionato o nome file non valido');
  }
};

const addFile = async (parent: TFile, name: string, type: EFileTypes) => {
  try{
    debugger
    const storedSelectedProjectId = localStorageService.load('selectedProjectId')
    const newFile = await fileRepository.createFile({
      name: name,
      type: type,
      projectId: storedSelectedProjectId,
      parent: parent,
      projectId: storedSelectedProjectId,
      parentId: parent.id,
    }) //fileService.createFile(name, type);
    if (parent.type === EFileTypes.Folder) {
      parent.children?.push(newFile);
    }
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
};

const addNewFile = async (name: string, type: EFileTypes) => {
  try{
    debugger
    const storedSelectedProjectId = localStorageService.load('selectedProjectId')
    const newFile = await fileRepository.createFile({
      name: name,
      type: type,
      projectId: storedSelectedProjectId
    }) //fileService.createFile(name, type);

    if (parent.type === EFileTypes.Folder) {
      parent.children?.push(newFile);
    }
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
};

const deleteFile = (file: TFile) => {
  if (files.value) {
    files.value = fileService.removeFile(files.value, file.id);
  }
};

const renameFile = (file: TFile, newName: string) => {
  if (newName.trim()) {
    file.name = newName;
  }
};

const confirmRename = () => {
  if (selectedNode.value && newFileName.value.trim()) {
    renameFile(selectedNode.value, newFileName.value);
    newFileName.value = '';
    renameDialog.value = false;
  }
};

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
      command: () => onRename(),
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => onDelete(),
    },
  ];
});

const onRename = () =>{
  if (selectedNode.value) {
    newFileName.value = selectedNode.value.name;
    renameDialog.value = true;
  }
}

const onDelete = () =>{
  if (selectedNode.value) {
    deleteFile(selectedNode.value);
    selectedNode.value = null;
  }
}

const handleAddFile = async (type: EFileTypes) => {
  debugger
  if (newFileName.value.trim()) {
    if (selectedNode.value) {
      // Aggiungi file o cartella al nodo selezionato
      await addFile(selectedNode.value, newFileName.value, type);
    } else {
      // Aggiungi file o cartella alla rooot del progetto
      //const newFile = fileService.createFile(newFileName.value, type);
      await addNewFile(newFileName.value, type);
      files.value.push(newFile);
    }
    newFileName.value = '';
    addFileDialog.value = false;
    addFolderDialog.value = false;
  }
};

// Funzioni per aprire i dialog
const openCreateFileDialog = () => {
  addFileDialog.value = true;
};

const openCreateFolderDialog = () => {
  addFolderDialog.value = true;
};

// Opzioni per il tipo di file nel Dropdown
const newFileTypeValues = [
  { name: 'File', code: EFileTypes.File },
  { name: 'Cartella', code: EFileTypes.Folder },
];
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
        <Button @click="onRename" text severity="info">
          <i class="fa fa-file-edit" />
        </Button>
        <Button @click="onDelete" text severity="danger">
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
        <InputText @keyup.enter="confirmRename" class="mb-2" v-model="newFileName" placeholder="Nuovo Nome" />
        <div class="dialog-footer">
          <Button @click="confirmRename" icon="pi pi-check" severity="success" label="Conferma" />
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

.flex {
  display: flex;
}

.flex-grow-1 {
  flex-grow: 1;
}

.flex-none {
  flex: none;
}

.align-content-center {
  align-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* Aggiungi stili per le icone */
.pi-folder {
  color: gold;
}

.pi-file {
  color: yellow;
}
</style>
