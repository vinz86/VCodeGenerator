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

const emit = defineEmits(['changeComponentsType', 'changeSelectedProject', 'selectFile']);


const stateManager = StateManager.getInstance();
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

const projects: Ref<Project[]> = ref([]);
const newProjectName = ref('');

const selectedProjectId = ref<string | null>(null);
const componentsType = defineModel<EComponentTypes>('componentsType');

const selectedProject = computed(() => {
  return projects.value.find(project => project.id === selectedProjectId.value) || null;
});

watch(projects, () => {
  saveProjects();
}, { deep: true });

watch(selectedProjectId, () => {
  saveProjects();
});

const loadProjects = () => {
  const storedProjects = localStorageService.load('projects');
  const storedSelectedProjectId = localStorageService.load('selectedProjectId');
  const storedComponentsType = localStorageService.load('componentsType');

  if (storedProjects) {
    projects.value = JSON.parse(storedProjects);
  }

  if (storedSelectedProjectId) {
    selectedProjectId.value = storedSelectedProjectId;
  }

  if (storedComponentsType) {
    componentsType.value = storedComponentsType;
  }
};

const saveProjects = () => {
  localStorageService.save('projects', JSON.stringify(projects.value));
  localStorageService.save('selectedProjectId', selectedProjectId.value);
  localStorageService.save('componentsType', componentsType.value);
};

const createProject = () => {
  if (newProjectName.value.trim()) {
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.value,
      files: [],
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
  { name: 'PrimeVue / PrimeFlex', code: EComponentTypes.PrimeVue },
  { name: 'Bootstrap', code: EComponentTypes.Bootstrap },
]);

const onchangeType = (): void => {
  saveProjects();
  emit('changeComponentsType', componentsType.value);
};


const onSelectFile = (file: TFile) => {
  emit('selectFile', file);
};


onMounted(loadProjects);
</script>

<template>
  <div class="project-manager w-full">
    <div class="flex">
      <div class="flex-grow-1">
        <InputText v-model="newProjectName" placeholder="Nome Nuovo Progetto" class="w-full" />
      </div>
      <div class="flex-none">
        <Button @click="createProject" class="mb-2" rounded><i class="fa fa-plus" /></Button>
      </div>
    </div>
    <div class="flex flex-column">
      <div>
        <Dropdown
            v-if="projects.length"
            @change="selectedProjectId && selectProject(selectedProjectId)"
            v-model="selectedProjectId"
            :options="projects"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleziona un progetto"
            class="w-full"
        >
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

    <FileManager
        v-if="selectedProject"
        :selectedProject="selectedProject"
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
