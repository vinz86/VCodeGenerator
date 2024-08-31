<script lang="ts" setup>
import { ref, onMounted, type Ref, computed, watch } from 'vue';
import { StateManager } from '~/store/StateManager';
import { DIContainer } from '~/services/DipendencyInjection/DIContainer';
import { LocalStorageService } from '~/services/LocalStorageService';
import type { Project } from '~/models/interfaces/Project';
import type { ComponentsTypesModel } from '~/models/types/ComponentsTypesModel';
import { EComponentTypes } from '~/models/enum/EComponentTypes';
import { EServiceKeys } from '~/models/enum/EServiceKeys';
import FileManager from "~/components/Editor/FileManager.vue";
import type {TFile} from "~/models/types/TFile";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type {IApiRepositories} from "~/models/interfaces/IApiRepositories";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import type {IUserRepository} from "~/services/api/interfaces/IUserRepository";
import {ApiContainer} from "~/services/api/ApiContainer";
import type {IAuthRepository} from "~/services/api/interfaces/IAuthRepository";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {IProjectRepository} from "~/services/api/interfaces/IProjectRepository";

const emit = defineEmits(['changeComponentsType', 'changeSelectedProject', 'selectFile']);

const projectService: IProjectRepository = ApiContainer.getService<IProjectRepository>(EApiKeys.ProjectRepository);

const stateManager = DIContainer.getService<StateManager<any>>(EServiceKeys.StateManager);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

const projects: Ref<Project[]> = ref([]);
const newProjectName = ref('');

const selectedProjectId = ref<string | null>(null);
const componentsType = defineModel<EComponentTypes>('componentsType');

const selectedProject = computed(() => {
  return projects.value.length>0 ? projects.value.find(project => project.id === selectedProjectId.value) : null;
});

/*watch(projects, () => {
  saveProjects();
}, { deep: true });

watch(selectedProjectId, () => {
  saveProjects();
});*/

/*const loadProjects = () => {
  let storedSelectedProjectId: string;
  const storedProjects: Project[] = localStorageService.load('projects');
  const storedComponentsType: string = localStorageService.load('componentsType');

  if (storedProjects?.length>0) {
    projects.value = storedProjects;

    storedSelectedProjectId = localStorageService.load('selectedProjectId')
    if (storedSelectedProjectId) {
      selectedProjectId.value = storedSelectedProjectId;
    }

  }
  if (storedComponentsType) {
    componentsType.value = storedComponentsType;
  }
};*/
const loadProjects = async () => {
  let storedSelectedProjectId: string;
  projects.value = await projectService.getProjects();

  storedSelectedProjectId = localStorageService.load('selectedProjectId')
  if (storedSelectedProjectId) {
    selectedProjectId.value = storedSelectedProjectId;
  }
};

const loadComponentType = async () => {
  const storedComponentsType: string = localStorageService.load('componentsType');
  if (storedComponentsType) {
    componentsType.value = storedComponentsType;
  }
};

const saveProjects = () => {
  localStorageService.save('projects', projects.value);
  localStorageService.save('selectedProjectId', selectedProjectId.value);
  localStorageService.save('componentsType', componentsType.value);
};

const createProject = () => {
  if (newProjectName.value.trim()) {
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.value,
      //files: [],
    };

    projects.value.push(newProject);
    selectedProjectId.value = newProject.id;
    newProjectName.value = '';
    saveProjects();
    emit('changeSelectedProject', newProject);
  }
};

const selectProject = (projectId: string) => {
  const project = projects.value.find(p => p.id === projectId);
  if (project) {
    stateManager.setState('currentProject', project);
    selectedProjectId.value = projectId;
    console.log('Progetto Selezionato:', project);
    saveProjects();
    emit('changeSelectedProject', project);
  }
};

const deleteProject = (projectId: string) => {
  projects.value = projects.value.filter((project) => project.id !== projectId);

  if (selectedProjectId.value === projectId) {
    selectedProjectId.value = null;
  }

  saveProjects();
};

const componentsTypeValues: Ref<ComponentsTypesModel> = ref([
  { name: 'Basic HTML', code: EComponentTypes.HtmlElements },
  { name: 'PrimeVue', code: EComponentTypes.PrimeVue },
  { name: 'Bootstrap', code: EComponentTypes.Bootstrap },
]);

const onchangeType = (): void => {
  saveProjects();
  emit('changeComponentsType', componentsType.value);
};


const onSelectFile = (file: TFile) => {
  emit('selectFile', file);
};


onMounted(async ()=> {
  try{
    await loadProjects();
    await loadComponentType();
  }
  catch (e) { notifyManager.error(e); }
  finally { LoadingManager.getInstance().stop(); }
});

</script>

<template>
  <div class="project-manager w-full">
    <div class="flex m-1">
      <InputGroup>
        <InputText v-model="newProjectName" class="m-0"  placeholder="Nome progetto" />
        <Button class="m-0"  @click="createProject" icon="fa fa-plus" />
      </InputGroup>
    </div>
    <Divider />
    <div class="flex flex-column m-1">
      <div>
        <Dropdown
            v-if="projects.length>0"
            @change="selectedProjectId && selectProject(selectedProjectId)"
            v-model="selectedProjectId"
            :options="projects"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleziona un progetto"
            class="w-full mb-1"
        >
          {{projects.length}}
          <Divider />
          <template #option="slotProps">
            <div class="flex w-full">
              <div class="flex-grow-1">
                <div>{{ slotProps.option.name }}</div>
              </div>
              <div class="flex-none">
                <i class="fa fa-trash cursor-pointer text-red-800" @click="deleteProject(slotProps.option.id)" />
              </div>
            </div>
          </template>
          <template #empty>
            <div class="flex w-full">
              Nessun Progetto disponibile
            </div>
          </template>
        </Dropdown>
      </div>
      <div>
        <Dropdown
            v-model="componentsType"
            @change="onchangeType"
            :options="componentsTypeValues"
            optionLabel="name"
            option-value="code"
            placeholder="Seleziona il tipo dei componenti"
            class="w-full"
        />
      </div>
    </div>

    <Divider />
    <FileManager
        v-if="selectedProject"
        :projectId="selectedProject.id"
        @selectFile="onSelectFile"
    />
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
