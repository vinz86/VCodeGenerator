<script setup lang="ts">
import {ref, type Ref} from "vue";
import type {TFile} from "~/models/types/TFile";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {FileHelper} from "~/helper/FileHelper";
import type {TFileExtension} from "~/models/types/TFileExtension";

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
const extensionsValues: Ref<TFileExtension[]> = ref([]);
const selectedFile: Ref<Tfile> = ref({} as TFile);

const newFile: Ref<TFile> = ref({
  name: '',
  parentId: null,
  type: EFileTypes.File
} as TFile);

const options = ref([
  { name: 'File', value: EFileTypes.File, icon: 'pi pi-file' },
  { name: 'Cartella', value: EFileTypes.Folder, icon: 'pi pi-folder' },
]);


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

onMounted(async () => {
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

  await getExtensions();
})
</script>

<template>
  <div class="flex m-o p-0 flex-column">
    <div class="grid mb-2">

      <div v-if="!isEditMode && newFile.value?.parentId" class="col-4">Parent:</div>
      <div v-if="!isEditMode && newFile.value?.parentId" class="col-8">{{selectedFile.name}}</div>

      <div v-if="!isEditMode" class="col-12 flex justify-content-center">
        <SelectButton v-model="newFile.type" :options="options" aria-labelledby="basic" option-value="value" >
          <template #option="slotProps">
            <i class="mr-2" :class="slotProps.option.icon" />{{slotProps.option.name}}
          </template>
        </SelectButton>
      </div>

      <div class="col-12">
        <InputGroup>
        <InputText v-model="newFile.name" class="m-0" placeholder="Nome file" />

          <Select
              v-if="newFile.type!==EFileTypes.Folder"
              v-model="newFile.extension"
              :options="extensionsValues"
              option-label="label"
              option-value="entityValue"
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