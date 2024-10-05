<script setup lang="ts">
import type {TProject} from "~/models/interfaces/TProject";
import {ref, type Ref} from "vue";
import type {TComponentFactoryDropdown} from "~/models/types/TComponentFactoryDropdown";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {useAppStore} from "~/store/AppStore";
import type {TFile} from "~/models/types/TFile";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {EProjectTypes} from "~/models/enum/EProjectTypes";

const projectStore = useAppStore();

type TDialogFileParams = {
  editMode?: boolean,
  selectedProject?: TFile
}

// TODO: aggiungere validazione
const emit = defineEmits(['addProject']);
const dialog = inject('dialogRef')
const params: Ref<TDialogFileParams> = ref({} as TDialogFileParams);
const isEditMode: Ref<boolean> = ref(false);
const selectedProject: Ref<TProject> = ref({} as TProject);

const newProject: Ref<TProject> = ref({} as TProject);

const projectTypeValues: Ref<TComponentFactoryDropdown[]> = ref([
  { name: 'HTML', code: EProjectTypes.HTML },
  { name: 'Vue', code: EProjectTypes.VUE },
]);

const componentsTypeValues: Ref<TComponentFactoryDropdown[]> = ref([
  { name: 'Basic HTML', code: EComponentTypes.HtmlElements },
  { name: 'PrimeVue', code: EComponentTypes.PrimeVue },
  { name: 'Bootstrap', code: EComponentTypes.Bootstrap },
]);

const createProject = async () => {
  const result = await ProjectHelper.addProject(newProject.value);
  if(result){
    dialog.value.close({edited: true, project: result});
  }
}

const editProject = async () => {
  const result = await ProjectHelper.editProject(newProject.value);
  if(result){
    dialog.value.close({edited: true, project: result});
  }
}

onMounted(() => {
  params.value = dialog?.value?.data;
  isEditMode.value = params.value.editMode;
  selectedProject.value = params.value.selectedProject || projectStore.selectedProject;

  if(isEditMode.value && selectedProject.value){
    newProject.value = selectedProject.value;
  } else {
    newProject.value = {} as TProject;
  }
})
</script>

<template>
  <div class="flex mb-0 p-0 flex-column">
    <Select
        v-model="newProject.projectType"
        :disabled="isEditMode"
        :options="projectTypeValues"
        option-label="name"
        option-value="code"
        placeholder="Seleziona il tipo di progetto"
        class="w-full mb-1"
    />
    <Select
        v-model="newProject.componentsType"
        :disabled="isEditMode"
        :options="componentsTypeValues"
        option-label="name"
        option-value="code"
        placeholder="Seleziona il tipo dei componenti"
        class="w-full mb-1"
    />
    <InputGroup>
      <InputText v-model="newProject.name" class="m-0" placeholder="Nome progetto" />
      <Button
          class="m-0"
          :icon="isEditMode ? 'fa fa-edit' : 'fa fa-plus'"
          @click="isEditMode ? editProject() : createProject()"
      />
    </InputGroup>
  </div>
</template>

<style scoped>

</style>