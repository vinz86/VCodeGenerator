<script lang="ts" setup>
import {onMounted, ref, type Ref} from 'vue';
import {StateManager} from '~/store/StateManager';
import {DIContainer} from '~/DIContainer/DIContainer';
import {LocalStorageService} from '~/services/LocalStorageService';
import type {Project} from '~/models/interfaces/Project';
import type {ComponentsTypesModel} from '~/models/types/ComponentsTypesModel';
import {EComponentTypes} from '~/models/enum/EComponentTypes';
import {EServiceKeys} from '~/models/enum/EServiceKeys';
import FileManager from "~/components/Editor/FileManager.vue";
import type {TFile} from "~/models/types/TFile";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IProjectService} from "~/services/api/interfaces/IProjectService";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type ConfirmManager from "~/manager/ConfirmManager";

const emit = defineEmits([ 'selectProject', 'selectFile']);

const projectService: IProjectService = ApiContainer.getService<IProjectService>(EApiKeys.ProjectService);

const stateManager = DIContainer.getService<StateManager<any>>(EServiceKeys.StateManager);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const confirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);

const projects: Ref<Project[]> = ref([]);
const selectedProjectId = ref<string | null>(null);
const defaultProject: Partial<Project> = { name: '', componentsType: EComponentTypes.PrimeVue }
const newProject: Ref<Partial<Project>> = ref(defaultProject);

const getProjects = async ()=>{
  try{
    LoadingManager.getInstance().start();

    projects.value = await projectService.getProjects();
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
}

const loadProjects = async (): Project => {
  const storedSelectedProjectId: string = localStorageService.load('selectedProjectId');

  await getProjects();

  if(storedSelectedProjectId){
    await selectProject(storedSelectedProjectId);
  }
};

const saveProjects = () => {
  localStorageService.save('selectedProjectId', selectedProjectId.value);
};

const createProject = async (e) => {
  e.preventDefault();
  try{
    LoadingManager.getInstance().start();

    if (newProject.value?.name?.trim() || newProject.value?.componentsType?.trim()) {
      const resultAddProject = await projectService.createProject(newProject.value)
      await getProjects();
      await selectProject(resultAddProject.id);

      newProject.value = defaultProject;
    } else {
      notifyManager.error('Inserisci un nome valido')
    }
  }
  catch (e) { notifyManager.error(e) }
  finally { LoadingManager.getInstance().stop(); }
};

const selectProject = async (projectId: string) => {
  const project = ProjectHelper.findProjectById(projectId, projects.value);

  if (project) {
    selectedProjectId.value = null;
    await nextTick();
    selectedProjectId.value = projectId;
    saveProjects();
    emit('selectProject', project);
  }
};

const deleteProject = async (projectId: string) => {
  try {
    LoadingManager.getInstance().start();
    if (projectId) {
      // TODO: BE Cancellare anche tutti i file contenuti all'interno
      await projectService.deleteProject(projectId)
      notifyManager.success('Progetto eliminato correttamente!')
      await getProjects();
    } else {
      notifyManager.error('ID progetto non valido')
    }
  }
  catch (e) { notifyManager.error(e) }
  finally { LoadingManager.getInstance().stop(); }
/*
  projects.value = ProjectHelper.removeProjectById(projectId);
  if (selectedProjectId.value === projectId) {
    selectedProjectId.value = null;
  }
  saveProjects();*/
};

const componentsTypeValues: Ref<ComponentsTypesModel> = ref([
  { name: 'Basic HTML', code: EComponentTypes.HtmlElements },
  { name: 'PrimeVue', code: EComponentTypes.PrimeVue },
  { name: 'Bootstrap', code: EComponentTypes.Bootstrap },
]);

const onSelectFile = (file: TFile) => {
  emit('selectFile', file);
};

onMounted(async ()=> {
    await loadProjects();
});

</script>

<template>
  <div class="project-manager w-full">
    <Panel header="Nuovo Progetto" class="m-0 p-0" toggleable collapsed>
      <div class="flex m-o p-0 flex-column">
        <Select
            v-model="newProject.componentsTypes"
            :options="componentsTypeValues"
            optionLabel="name"
            option-value="code"
            placeholder="Seleziona il tipo dei componenti"
            class="w-full mb-1"
        />
        <InputGroup>
          <InputText v-model="newProject.name" class="m-0" placeholder="Nome progetto" />
          <Button class="m-0" @click="createProject" icon="fa fa-plus" />
        </InputGroup>
      </div>
    </Panel>

    <Panel header="Lista Progetti" class="m-0 p-0" toggleable>
      <div class="flex m-o p-0 flex-column">
        <Select
            v-if="projects?.length>0"
            @change="selectedProjectId && selectProject(selectedProjectId)"
            v-model="selectedProjectId"
            :options="projects"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleziona un progetto"
            class="w-full mb-1"
        >
          <template #option="slotProps">
            <div class="flex w-full">
              <div class="flex-grow-1">
                <div>{{ slotProps.option.name }}</div>
              </div>
              <div class="flex-none">
                <i class="fa fa-trash cursor-pointer text-red-800" @click="confirmManager
                  .setMessage(`Confermi l'eliminazione dell'elemento con ID ${slotProps.option.id}?`)
                  .setAcceptCallback(async () => {
                    await deleteProject(slotProps.option.id)
                  })
                  .open($event.currentTarget as HTMLElement)"
                />
              </div>
            </div>
          </template>
          <template #empty>
            <div class="flex w-full">
              Nessun Progetto disponibile
            </div>
          </template>
        </Select>
      </div>
    </Panel>


    <Panel header="Files e Folders" id="panel-projects-files" class="m-0 p-0"  toggleable>

      <FileManager
          v-if="selectedProjectId"
          :projectId="selectedProjectId"
          @selectFile="onSelectFile"
      />
    </Panel>
  </div>
</template>

<style scoped>
.project-manager {
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}

li span {
  cursor: pointer;
  margin-right: 10px;
}

li span:hover {
  text-decoration: underline;
}

button {
  margin-left: 5px;
}
</style>
