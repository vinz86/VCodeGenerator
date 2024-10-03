<script setup lang="ts">
import type {Project} from "~/models/interfaces/Project";
import {ref, type Ref} from "vue";
import type {TComponentFactoryDropdown} from "~/models/types/TComponentFactoryDropdown";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {useAppStore} from "~/store/AppStore";
import type {TFile} from "~/models/types/TFile";
import {EFileTypes} from "~/models/enum/EFileTypes";

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
const selectedProject: Ref<Project> = ref({} as Project);

const newProject: Ref<Project> = ref({} as Project);

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
    newProject.value = {} as Project;
  }
})
</script>

<template>
  <div class="flex m-o p-0 flex-column">
    <Select
        v-model="newProject.componentsType"
        :options="componentsTypeValues"
        optionLabel="name"
        option-value="code"
        placeholder="Seleziona il tipo dei componenti"
        class="w-full mb-1"
    />
    <InputGroup>
      <InputText v-model="newProject.name" class="m-0" placeholder="Nome progetto" />
      <Button
          class="m-0"
          @click="params?.edit ? editProject() : createProject()"
          :icon="params?.edit ? 'fa fa-edit' : 'fa fa-plus'"
      />
    </InputGroup>
  </div>
</template>

<style scoped>

</style>