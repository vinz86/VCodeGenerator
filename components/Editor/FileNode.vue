A<script lang="ts" setup>
import {computed, defineEmits, defineProps, type Ref, ref, watch} from 'vue';
import type { TFile as File } from '~/models/types/TFile';
import type {ComponentsTypesModel, ComponentTypeModel} from '~/models/types/ComponentsTypesModel';
import { EFileTypes } from '~/models/enum/EFileTypes';
import { ContextMenu } from "#components";
import { Dialog } from "#components";

const props = defineProps<{
  file: File;
  allFiles: File[];
}>();

const emit = defineEmits(['addFile', 'deleteFile', 'renameFile', 'moveFile', 'selectFile']);  // Emissione degli eventi

// Stato di espansione della cartella
const isExpanded = ref(false);
// Stato di aggiunta di un nuovo figlio
const isAddingChild = ref(false);
// Stato di rinomina del file
const isRenaming = ref(false);
// Stato di spostamento del file
const isMoving = ref(false);
// Nome del nuovo figlio
const childName = ref('');
// Tipo del nuovo figlio
const childType = ref<'file' | 'folder'>('file');
// Nuovo nome per la rinomina
const newFileName = ref('');
// ID della cartella target per lo spostamento
const targetFolderId = ref('');
// Opzioni per le cartelle
const folderOptions = computed(() => {
  const folders: File[] = [];
  const traverse = (file: File) => {
    if (file.type === 'folder') {
      folders.push(file);
      if (file.children) {
        file.children.forEach(traverse);
      }
    }
  };
  props.allFiles.forEach(traverse);
  return folders;
});

// Funzione per attivare/disattivare la visualizzazione dei figli
const toggleChildren = () => {
  if (props.file.type === 'folder') {
    isExpanded.value = !isExpanded.value;
  }
};

// Inizia l'aggiunta di un nuovo figlio
const startAddChild = () => {
  isAddingChild.value = true;
};

// Conferma l'aggiunta di un nuovo figlio
const addChild = () => {
  if (childName.value.trim()) {
    emit('addFile', props.file, childName.value, childType.value);
    childName.value = '';
    isAddingChild.value = false;
  }
};

// Annulla l'aggiunta di un nuovo figlio
const cancelAddChild = () => {
  isAddingChild.value = false;
  childName.value = '';
};

// Inizia la rinomina del file/cartella
const startRenameFile = () => {
  isRenaming.value = true;
  newFileName.value = props.file.name;
};

// Conferma la rinomina del file/cartella
const confirmRename = () => {
  if (newFileName.value.trim()) {
    emit('renameFile', props.file.id, newFileName.value);
    isRenaming.value = false;
  }
};

// Annulla la rinomina del file/cartella
const cancelRename = () => {
  isRenaming.value = false;
  newFileName.value = '';
};

// Inizia lo spostamento del file/cartella
const startMoveFile = () => {
  isMoving.value = true;
  targetFolderId.value = '';
};

// Conferma lo spostamento del file/cartella
const confirmMove = () => {
  if (targetFolderId.value) {
    emit('moveFile', props.file.id, targetFolderId.value);
    isMoving.value = false;
  }
};

// Annulla lo spostamento del file/cartella
const cancelMove = () => {
  isMoving.value = false;
  targetFolderId.value = '';
};

// Emette l'evento per eliminare il file
const emitDeleteFile = () => {
  emit('deleteFile', props.file.id);
};

// Seleziona un file e apre l'editor
const selectFile = () => {
  if (props.file.type === 'file') {
    emit('selectFile', props.file);
  }
};

const childTypeValues: Ref<ComponentsTypesModel> = ref([
  { name: 'TFilel', code: EFileTypes.File },
  { name: 'Cartella', code: EFileTypes.Folder },
]);

const onComponentRightClick = (event: any) => {
  contextMenu.value.hide();
  nextTick(() => {
    contextMenu.value.show(event);
  });
};
const contextMenu = ref();

// Context menu items
const contextMenuItems = computed(() => [
  {
    label: 'Aggiungi',
    icon: 'fa fa-add',
    visible: props.file.type === EFileTypes.Folder,
    command: () => startAddChild(),
  },
  {
    label: 'Rinomina',
    icon: 'fa fa-edit',
    command: () => startRenameFile(),
  },
  {
    label: 'Elimina',
    icon: 'fa fa-trash',
    command: () => emitDeleteFile(),
  },
  {
    label: 'Sposta',
    icon: 'fa-solid fa-up-down-left-right',
    command: () => startMoveFile(),
  },
]);
</script>

<template>
  <ContextMenu ref="contextMenu" :model="contextMenuItems"/>

  <li class="w-full flex flex-column" @contextmenu.stop="onComponentRightClick($event)">

    <div class="node w-full">
      <span @click="selectFile">
        <i :class="file.type === EFileTypes.Folder ? (isExpanded ? 'fa fa-folder-open' : 'fa fa-folder') : 'fa fa-file'" aria-hidden="true"></i>
        {{ file.name }}
      </span>
    </div>

    <Dialog header="Rinomina File/Cartella" v-model:visible="isRenaming">
      <div class="p-fluid">
        <InputText v-model="newFileName" placeholder="Nuovo Nome" />
        <div class="dialog-footer">
          <Button @click="confirmRename" icon="fa fa-check" severity="success" label="Conferma" />
          <Button @click="cancelRename" icon="fa fa-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Aggiungi File/Cartella" v-model:visible="isAddingChild">
      <div class="p-fluid">
        <InputText v-model="childName" placeholder="Nome File/Cartella" />
        <Dropdown v-model="childType" :options="childTypeValues" optionLabel="name" option-value="code" placeholder="Seleziona il tipo" />
        <div class="dialog-footer">
          <Button @click="addChild" icon="fa fa-check" severity="success" label="Aggiungi" />
          <Button @click="cancelAddChild" icon="fa fa-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <Dialog header="Sposta File/Cartella" v-model:visible="isMoving">
      <div class="p-fluid">
        <Dropdown v-model="targetFolderId" :options="folderOptions" optionLabel="name" option-value="id" placeholder="Seleziona la cartella" />
        <div class="dialog-footer">
          <Button @click="confirmMove" icon="fa fa-check" severity="success" label="Sposta" />
          <Button @click="cancelMove" icon="fa fa-times" severity="danger" label="Annulla" />
        </div>
      </div>
    </Dialog>

    <ul v-if="file.type === 'folder' && isExpanded">
      <FileNode
          v-for="child in file.children"
          :key="child.id"
          :file="child"
          :allFiles="props.allFiles"
          @selectFile="selectFile"
      />
<!--      @addFile="addFile"-->
<!--      @deleteFile="deleteFile"-->
<!--      @renameFile="renameFile"-->
<!--      @moveFile="moveFile"-->
    </ul>
  </li>
</template>

<style scoped>
.node {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
