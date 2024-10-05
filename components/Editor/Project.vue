<script lang="ts" setup>
import {onMounted, ref, type Ref} from 'vue';
import {StateManager} from '~/store/StateManager';
import {DIContainer} from '~/DIContainer/DIContainer';
import type {LocalStorageService} from '~/services/LocalStorageService';
import type {TProject} from '~/models/interfaces/TProject';
import type {TComponentFactoryDropdown} from '~/models/types/TComponentFactoryDropdown';
import {EComponentTypes} from '~/models/enum/EComponentTypes';
import {EServiceKeys} from '~/models/enum/EServiceKeys';
import FileManager from "~/components/Editor/FileManager.vue";
import type {TFile} from "~/models/types/TFile";
import {LoadingManager} from "~/manager/LoadingManager";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {Api} from "~/services/api/core/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IProjectService} from "~/services/api/services/interfaces/IProjectService";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type ConfirmManager from "~/manager/ConfirmManager";
import {EConfirmType} from "~/manager/ConfirmManager";
import {useAppStore} from "~/store/AppStore";

const emit = defineEmits([ 'selectProject', 'selectFile']);

const projectStore = useAppStore();

const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);

const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const confirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);

const projects: Ref<TProject[]> = ref([]);
const selectedProjectId = ref<string | null>(null);
const defaultProject: Partial<TProject> = { name: '', componentsType: EComponentTypes.PrimeVue }
const newProject: Ref<Partial<TProject>> = ref(defaultProject);

const getProjects = async ()=>{
  try{
    LoadingManager.getInstance().start();

    projects.value = await projectService.getProjects();
  }
  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
}

const loadProjects = async (): TProject => {
  const storedSelectedProjectId: string = localStorageService.load('selectedProjectId');

  await getProjects();

  if(storedSelectedProjectId){
    await selectProject(storedSelectedProjectId);
  }
};

const saveProjects = () => {
  localStorageService.save('selectedProjectId', selectedProjectId.value);
  projectStore.setProject(ProjectHelper.findProjectById(selectedProjectId.value, projects.value))
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

const onSelectFile = (file: TFile) => {
  emit('selectFile', file);
};

onMounted(async ()=> {
    await loadProjects();
});

</script>

<template>
  <div class="project-manager w-full">
<Button icon="pi pi-refresh" @click="getProjects()" />
    <Accordion value="2">
<!--      <AccordionPanel value="0">
        <AccordionHeader>Nuovo Progetto</AccordionHeader>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionPanel>-->
      <AccordionPanel value="1">
        <AccordionHeader>Lista Progetti</AccordionHeader>
        <AccordionContent>
          <div class="flex m-o p-0 flex-column">
            <Select
                v-if="projects?.length>0"
                v-model="selectedProjectId"
                :options="projects"
                option-label="name"
                id="select-project"
                option-value="id"
                placeholder="Seleziona un progetto"
                class="w-full mb-1"
                @change="selectedProjectId && selectProject(selectedProjectId)"
            >
              <template #option="slotProps">
                <div class="flex w-full">
                  <div class="flex-grow-1">
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                  <div class="flex-none">
                    <i
class="fa fa-trash cursor-pointer text-red-800"
                      @click="confirmManager
                        .setMessage(`Confermi l'eliminazione dell'elemento con ID ${slotProps.option.id}?`)
                        .setType(EConfirmType.DIALOG)
                        .setAcceptCallback(async () => {
                          await projectService.deleteProject(slotProps.option.id)
                          notifyManager.success('Progetto eliminato correttamente!')
                          await getProjects();
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
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>Files e Folders</AccordionHeader>
        <AccordionContent>
          <FileManager
              v-if="selectedProjectId"
              :project-id="selectedProjectId"
              @select-file="onSelectFile"
          />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

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
