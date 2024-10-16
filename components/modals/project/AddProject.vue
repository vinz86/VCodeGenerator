<script setup lang="ts">
import type {TProject} from "~/models/interfaces/TProject";
import {ref, type Ref} from "vue";
import type {TComponentFactoryDropdown} from "~/models/types/TComponentFactoryDropdown";
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {useAppStore} from "~/store/AppStore";
import type {TFile} from "~/models/types/TFile";
import {EProjectTypes} from "~/models/enum/EProjectTypes";
import {LoadingManager} from "~/manager/LoadingManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import {NotifyManagerFactory} from "~/factory/NotifyManagerFactory/NotifyManagerFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {Api} from "~/services/api/Api";
import {ProjectTypeService} from "~/services/api/services/ProjectTypeService";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IProjectTypeService} from "~/services/api/services/interfaces/IProjectTypeService";
import type {IComponentFactoryService} from "~/services/api/services/interfaces/IComponentFactoryService";

const projectStore = useAppStore();

type TDialogFileParams = {
  editMode?: boolean,
  selectedProject?: TFile
}

// TODO: aggiungere validazione
const emit = defineEmits(['save']);
const dialog = inject('dialogRef')

const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

const projectTypeService = Api.getService<IProjectTypeService>(ApiKeys.ProjectType)
const componentFactoryService = Api.getService<IComponentFactoryService>(ApiKeys.ComponentFactory);

const params: Ref<TDialogFileParams> = ref({} as TDialogFileParams);
const isEditMode: Ref<boolean> = ref(false);
const selectedProject: Ref<TProject> = ref({} as TProject);

const newProject: Ref<TProject> = ref({} as TProject);

const projectTypes: Ref<TComponentFactoryDropdown[]> = ref([]);
const componentsFactories: Ref<TComponentFactoryDropdown[]> = ref([
  { name: 'Basic HTML', code: EComponentTypes.HtmlElements },
  { name: 'PrimeVue', code: EComponentTypes.PrimeVue },
  { name: 'Bootstrap', code: EComponentTypes.Bootstrap },
]);


const getProjectTypes = async () => {
  try{
    LoadingManager.getInstance().start();
    projectTypes.value = await projectTypeService.getProjectTypes() || [];
  } catch (e) { notifyManager.error(e?.message || e);
  } finally { LoadingManager.getInstance().stop() }
}

const getComponentFactories = async () => {
  try{
    LoadingManager.getInstance().start();
    componentsFactories.value = await componentFactoryService.getComponentFactories() || [];
  } catch (e) { notifyManager.error(e?.message || e);
  } finally { LoadingManager.getInstance().stop() }
}
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

onMounted(async () => {
  params.value = dialog?.value?.data;
  isEditMode.value = params.value.editMode;
  selectedProject.value = params.value.selectedProject || projectStore.selectedProject;

  if(isEditMode.value && selectedProject.value){
    newProject.value = selectedProject.value;
  } else {
    newProject.value = {} as TProject;
  }

  const promises = [
    await getProjectTypes(),
    await getComponentFactories(),
  ]
  await Promise.all(promises);
  emit('save', 'testdata')
})
</script>

<template>
  <div class="flex mb-0 p-0 flex-column">
    <Select
        v-model="newProject.projectType"
        :disabled="isEditMode"
        :options="projectTypes"
        option-label="label"
        option-value="entityValue"
        placeholder="Seleziona il tipo di progetto"
        class="w-full mb-1"
    />
    <Select
        v-model="newProject.componentsType"
        :disabled="isEditMode"
        :options="componentsFactories"
        option-label="label"
        option-value="entityValue"
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