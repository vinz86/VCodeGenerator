<script setup lang="ts">
import {ref, type Ref} from "vue";
import type {Project} from "~/models/interfaces/Project";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {DIContainer} from "~/DIContainer/DIContainer";
import ConfirmManager, {EConfirmType} from "~/manager/ConfirmManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";

const emit = defineEmits(['selectProject']);
const dialog = inject('dialogRef')

const confirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

//TODO implementare la paginazione jhipster
const projects: Ref<Project[]> = ref([] as Project[]);
const selectedProject: Ref<Project> = ref({} as Project);
const currentPage: Ref<number> = ref(0);
const totalRecords: Ref<number> = ref(0);
const rowsPerPage: Ref<number> = ref(10);

const getProjects = async () => {
  projects.value = await ProjectHelper.getProjects({size: 10, page: currentPage.value});
  totalRecords.value = await ProjectHelper.countProjects();
}

const onSelectProject = () => dialog.value.close(selectedProject.value);

const onPageChange = async (data: any) => {
  currentPage.value = data?.page;
  await getProjects();
};

onMounted(async ()=>{
  await getProjects();
})
</script>

<template>
  <div>
    <DataTable v-model:selection="selectedProject" data-key="id" :value="projects">
      <Column selectionMode="single" headerStyle="width: 2rem"></Column>
      <Column field="name" header="Nome"></Column>
      <Column field="componentsType" header="Tipo"></Column>
      <Column>
        <template #body="slotProps">
          <Button text severity="danger" icon="pi pi-trash" @click="
          confirmManager
              .setMessage(`Confermi l'eliminazione del progetto ${slotProps.data?.name}?`)
              .setType(EConfirmType.DIALOG)
              .setAcceptCallback(async () => {
                await ProjectHelper.deleteProject(slotProps.data?.id);
                notifyManager.success('Progetto eliminato correttamente!');
                await getProjects();
              })
              .open()
              " />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]" @page="onPageChange" />

    <div class="flex justify-content-end">
      <Button label="Seleziona progetto" @click="onSelectProject" />
    </div>
  </div>
</template>

<style scoped>

</style>