<script lang="ts" setup>
import { defineProps, ref, type PropType, computed, nextTick } from 'vue';
import type { FileModel } from '~/models/interfaces/FileModel';
import type { Project } from '~/models/interfaces/Project';
import { DIContainer } from '~/services/DipendencyInjection/DIContainer';
import { ServiceKeys } from '~/models/enum/ServiceKeys';
import type { LocalStorageService } from '~/services/LocalStorageService';
import type { FileServiceInterface } from '~/models/interfaces/FileServiceInterface';
import { FilesTypes } from '~/models/enum/FilesTypes';
import type ContextMenu from "primevue/contextmenu";

const emit = defineEmits(['selectFile']);

const fileService = DIContainer.getService<FileServiceInterface>(ServiceKeys.FileService);
const localStorageService = DIContainer.getService<LocalStorageService>(ServiceKeys.LocalStorageService);

const newFileName = ref('');
const newFileType = ref<FilesTypes>(FilesTypes.File);
const selectedNode = ref<FileModel | null>(null);
const renameDialog = ref(false);
const contextMenu = ref<ContextMenu | null>(null);
const addFileDialog = ref(false);
const addFolderDialog = ref(false);

const props = defineProps({
  selectedProject: {
    type: Object as PropType<Project>,
    required: true,
  },
});

const formatTreeData = (files: FileModel[]) => {
  return files.map(file => ({
    key: file.id,
    label: file.name,
    data: file,
    icon: file.type === FilesTypes.Folder ? 'pi pi-folder' : 'pi pi-file',
    children: file.type === FilesTypes.Folder && file.children ? formatTreeData(file.children) : null,
  }));
};

const treeData = computed(() => formatTreeData(props.selectedProject.files));

const onComponentRightClick = (event) => {
  event.preventDefault();

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

const selectFile = (node: FileModel) => {
  selectedNode.value = node;
  console.log('Selected node:', node);
  emit('selectFile', node);
};

const addFileToRoot = () => {
  if (props.selectedProject && newFileName.value.trim()) {
    const newFile = fileService.createFile(newFileName.value, FilesTypes.File);
    props.selectedProject.files.push(newFile);
    newFileName.value = '';
  } else {
    console.warn('Progetto non selezionato o nome file non valido');
  }
};

const addFile = (parent: FileModel, name: string, type: 'file' | 'folder') => {
  const newFile = fileService.createFile(name, type);
  if (parent.type === FilesTypes.Folder) {
    parent.children?.push(newFile);
  }
};

const deleteFile = (file: FileModel) => {
  if (props.selectedProject) {
    props.selectedProject.files = fileService.removeFile(props.selectedProject.files, file.id);
  }
};

const renameFile = (file: FileModel, newName: string) => {
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
      visible: selectedNode.value?.type === FilesTypes.Folder,
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
      command: () => {
        if (selectedNode.value) {
          newFileName.value = selectedNode.value.name;
          renameDialog.value = true;
        }
      },
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => {
        if (selectedNode.value) {
          deleteFile(selectedNode.value);
          selectedNode.value = null;
        }
      },
    },
  ];
});

const handleAddFile = (type: 'file' | 'folder') => {
  if (newFileName.value.trim()) {
    if (selectedNode.value) {
      // Aggiungi file o cartella al nodo selezionato
      addFile(selectedNode.value, newFileName.value, type);
    } else {
      // Aggiungi file o cartella alla rooot del progetto
      const newFile = fileService.createFile(newFileName.value, type);
      props.selectedProject.files.push(newFile);
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
  { name: 'File', code: FilesTypes.File },
  { name: 'Cartella', code: FilesTypes.Folder },
];
</script>


<template>
  <div class="file-manager">
    <div class="flex">
      <div class="flex-grow-1">
        <Button @click="openCreateFileDialog" text class="mb-2">
          <i class="fa fa-file-circle-plus" />
        </Button>
        <Button @click="openCreateFolderDialog" text class="mb-2">
          <i class="fa fa-folder-plus" />
        </Button>
      </div>
    </div>

    <h4>/root</h4>
    <Tree
        :value="treeData"
        :selection-mode="'single'"
        @node-select="(event) => {
          console.log('Node selected:', event.data);
          selectFile(event.data);
        }"
        @contextmenu="onComponentRightClick"
    />

    <Dialog header="Rinomina File/Cartella" v-model:visible="renameDialog">
      <div class="p-fluid">
        <InputText v-model="newFileName" placeholder="Nuovo Nome" />
        <div class="dialog-footer">
          <Button @click="confirmRename" icon="pi pi-check" severity="success" label="Conferma" />
          <Button @click="() => renameDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Aggiungi File" v-model:visible="addFileDialog">
      <div class="p-fluid">
        <InputText v-model="newFileName" placeholder="Nome File" />
        <div class="dialog-footer">
          <Button @click="handleAddFile('file')" icon="pi pi-check" severity="success" label="Aggiungi" />
          <Button @click="() => addFileDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Aggiungi Cartella" v-model:visible="addFolderDialog">
      <div class="p-fluid">
        <InputText v-model="newFileName" placeholder="Nome Cartella" />
        <div class="dialog-footer">
          <Button @click="handleAddFile('folder')" icon="pi pi-check" severity="success" label="Aggiungi" />
          <Button @click="() => addFolderDialog = false" icon="pi pi-times" severity="danger" label="Annulla" />
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
