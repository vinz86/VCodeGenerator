<script setup lang="ts">
import {ref, type Ref} from "vue";
import type {TProject} from "~/models/types/TProject";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {DIContainer} from "~/DIContainer/DIContainer";
import type ConfirmManager from "~/manager/ConfirmManager";
import {EConfirmType} from "~/manager/ConfirmManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import AddProject from "~/components/modals/project/AddProject.vue";
import type DialogManager from "~/manager/DialogManager";

const emit = defineEmits(['selectProject']);
const dialog = inject('dialogRef')

const confirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const dialogManager = DIContainer.getService<DialogManager>(EServiceKeys.DialogManager);

//TODO implementare la paginazione jhipster
const projects: Ref<TProject[]> = ref([] as TProject[]);
const selectedProject: Ref<TProject> = ref({} as TProject);
const currentPage: Ref<number> = ref(0);
const totalRecords: Ref<number> = ref(0);
const rowsPerPage: Ref<number> = ref(10);

const getProjects = async () => {
  projects.value = await ProjectHelper.getProjects({size: 10, page: currentPage.value});
  totalRecords.value = await ProjectHelper.countProjects();
}

const onEditProject = (e)=> {
  if(e?.data?.edited){
    emit('editProject', e?.data);
    notifyManager.success('Progetto modificato correttamente');
  }
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
    <div class="mb-1">
      <DataTable v-model:selection="selectedProject" data-key="id" :value="projects" selection-mode="single" scroll-height="flex">
        <Column selection-mode="single" header-style="width: 2rem"/>
        <Column field="name" header="Nome"/>
        <Column field="projectType.entityValue" header="Tipo Progetto"/>
        <Column field="componentFactory.entityValue" header="Componenti"/>
        <Column>
          <template #body="slotProps">
            <Button
text severity="info" icon="pi pi-pencil" @click="dialogManager.setComponent(AddProject).setTitle('Modifica Progetto').setProps({ style:{ width:'50%' } })
            .setData({editMode: true, selectedProject: slotProps.data })
            .setOnClose((e)=> onEditProject(e))
            .open()" />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
text severity="danger" icon="pi pi-trash" @click="
              confirmManager
                .setMessage(`Confermi l'eliminazione del progetto ${slotProps.data?.name}?`)
                .setType(EConfirmType.DIALOG)
                .setAcceptCallback(async () => {
                  if(await ProjectHelper.deleteProject(slotProps.data?.id)){
                    notifyManager.success('Progetto eliminato correttamente!');
                    await getProjects();
                  }
                })
                .open()
              " />
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="rowsPerPage" :total-records="totalRecords" :rows-per-page-options="[10, 20, 30]" @page="onPageChange" />
    </div>


    <div class=" absolute bottom-0 right-0">
      <div class="flex justify-content-end p-5">
        <Button label="Seleziona progetto" icon="" @click="onSelectProject" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>