<script setup lang="ts">
import {ref, type Ref} from "vue";
import type {TFile} from "~/models/types/TFile";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {FileHelper} from "~/helper/FileHelper";

type TDialogFileParams = {
  editMode: boolean,
  type: EFileTypes,
  selectedFile: TFile
}

// TODO: aggiungere validazione
const emit = defineEmits(['addFile']);

const dialog = inject('dialogRef')
const params: Ref<TDialogFileParams> = ref({} as TDialogFileParams);
const isEditMode: Ref<boolean> = ref(false);
const projectId: Ref<number> = ref();
const selectedFile: Ref<Tfile> = ref({} as TFile);

const newFile: Ref<TFile> = ref({
  name: '',
  parentId: null,
  type: EFileTypes.File
} as TFile);

const options = ref([EFileTypes.File, EFileTypes.Folder]);


const createFile = async () => {
  const result = await FileHelper.addFile(newFile.value);
  if(result){
    dialog.value.close({edited: true, file: result});
  }
}

const editFile = async () => {
  const result = await FileHelper.editFile(newFile.value);
  if(result){
    dialog.value.close({edited: true, file: result});
  }
}

onMounted(() => {
  params.value = dialog?.value?.data
  isEditMode.value = !!params.value?.editMode;
  projectId.value = params.value?.projectId;
  selectedFile.value = params.value?.selectedFile;

  newFile.value.projectId = projectId.value;

  if(!isEditMode.value) {
    newFile.value.type = params.value?.type;
    newFile.value.parentId = selectedFile.value ? selectedFile.value?.id : null;
  } else {
    if(selectedFile.value) {
      newFile.value.id = selectedFile.value?.id;
      newFile.value.name = selectedFile.value?.name;
      newFile.value.type = selectedFile.value?.type;
    }
  }
})
</script>

<template>
  <div class="flex m-o p-0 flex-column">
    <div class="grid mb-2">

      <div class="col-4" v-if="!isEditMode && newFile.value?.parentId">Parent:</div>
      <div class="col-8" v-if="!isEditMode && newFile.value?.parentId">{{selectedFile.name}}</div>

      <div v-if="!isEditMode" class="col-12 flex justify-content-center">
        <SelectButton v-model="newFile.type" :options="options" aria-labelledby="basic" />
      </div>

      <div class="col-12">
        <InputGroup>
        <InputText v-model="newFile.name" class="m-0" placeholder="Nome file" />
        <Button
            class="m-0"
            @click="isEditMode ? editFile() : createFile()"
            :icon="isEditMode ? 'fa fa-edit' : 'fa fa-plus'"
        />
        </InputGroup>
      </div>

    </div>


  </div>
</template>

<style scoped>

</style>