<script setup lang="ts">
import {ref, type Ref} from "vue";
import type {TFile} from "~/models/types/TFile";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {FileHelper} from "~/helper/FileHelper";
import type {TFileExtension} from "~/models/types/TFileExtension";
import type {TFileType} from "~/models/types/TFileType";

type TDialogFileParams = {
  editMode: boolean,
  type: EFileTypes,
  selectedFile: TFile
}

// TODO: aggiungere validazione

const dialog = inject('dialogRef')
const params: Ref<TDialogFileParams> = ref({} as TDialogFileParams);
const isEditMode: Ref<boolean> = ref(false);
const projectId: Ref<number> = ref();
const extensionsValues: Ref<TFileExtension[]> = ref([]);
const fileTypes: Ref<TFileType[]> = ref([]);
const selectedFile: Ref<Tfile> = ref({} as TFile);

const newFile: Ref<TFile> = ref({
  name: '',
  parentId: null,
  type: {} as TFileType,
  project: {}
} as TFile);

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

const getExtensions = async(): void =>{
  extensionsValues.value = await FileHelper.getExtensions();
  if(extensionsValues.value?.length && !isEditMode.value){
    newFile.value['extension'] = extensionsValues.value?.at(0);
  }
}

const getFileTypes = async(): void =>{
  fileTypes.value = await FileHelper.getFileTypes();
  if(fileTypes.value?.length && !isEditMode.value){
    newFile.value['type'] = fileTypes.value?.at(0);
  }
}

onMounted(async () => {
  params.value = dialog?.value?.data
  isEditMode.value = !!params.value?.editMode;
  projectId.value = params.value?.projectId;
  selectedFile.value = params.value?.selectedFile;

  newFile.value.project['id'] = projectId.value;

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

  await getExtensions();
  await getFileTypes()
})

</script>

<template>
  <div class="flex m-o p-0 flex-column">
    <div class="grid mb-2">

      <div v-if="!isEditMode && newFile.value?.parentId" class="col-4">Parent:</div>
      <div v-if="!isEditMode && newFile.value?.parentId" class="col-8">{{selectedFile.name}}</div>

      <div v-if="!isEditMode" class="col-12 flex justify-content-center">
        <SelectButton v-model="newFile.type" :options="fileTypes" aria-labelledby="basic">
          <template #option="slotProps">
            <i class="mr-2" :class="FileHelper.getFileIconFromLabel(slotProps.option.label)" />{{slotProps.option.label}}
          </template>
        </SelectButton>
      </div>

      <div class="col-12">
        <InputGroup>
        <InputText v-model="newFile.name" class="m-0" placeholder="Nome file" />

          <Select
              v-if="newFile.type?.label !== EFileTypes.Folder"
              v-model="newFile.extension"
              :options="extensionsValues"
              option-label="label"
              placeholder=".ext"
              style="max-width: 100px"
          />
        <Button
            class="m-0"
            :icon="isEditMode ? 'fa fa-edit' : 'fa fa-plus'"
            @click="isEditMode ? editFile() : createFile()"
        />
        </InputGroup>
      </div>

    </div>


  </div>
</template>

<style scoped>

</style>