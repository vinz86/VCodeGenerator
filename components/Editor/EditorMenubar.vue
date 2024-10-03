<script setup lang="ts">
import {ref} from "vue";
import DialogManager from "~/manager/DialogManager";
import AddProject from "~/components/modals/project/AddProject.vue";
import SelectProject from "~/components/modals/project/SelectProject.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";
import {useAppStore} from "~/store/AppStore";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

const emit = defineEmits([
    'addProject', 'selectProject', 'editProject', 'deleteProject'
]);

const dialogManager = DIContainer.getService<DialogManager>(EServiceKeys.DialogManager);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

// stores
const projectStore = useAppStore();

const onAddProject = (e)=> {
  if(e?.data?.edited){
    emit('addProject', e?.data);
    notifyManager.success('Progetto aggiunto correttamente');
  }
}

const onSelectProject = (e)=> {
  emit('selectProject', e?.data)
}

const onEditProject = (e)=> {
  if(e?.data?.edited){
    emit('editProject', e?.data);
    notifyManager.success('Progetto modificato correttamente');
  }
}

const onDeleteProject = (e)=> {
  emit('deleteProject', e?.data);
  notifyManager.success('Progetto eliminato correttamente');
}

const itemsNavbar = ref([
  { label: 'Home', icon: 'pi pi-home', items: [
      { label: 'Home',  icon: 'pi pi-home',
        command: async () => {
          await navigateTo('/');
          projectStore.setProject(-1);
          projectStore.setFile(-1);
          projectStore.setComponent(-1);
        }
      },
      { label: 'Esporta file', icon: 'pi pi-save' },
      { label: 'Esporta progetto', icon: 'pi pi-save' },
    ]
  },
  { label: 'Progetti', icon: 'pi pi-search', items: [
      { label: 'Nuovo', icon: 'pi pi-plus',
        command: ()=> {
          dialogManager.setComponent(AddProject).setTitle('Aggiungi Progetto').setProps({ style:{ width:'50%' } })
              .setOnClose((e)=> onAddProject(e))
              .setData({editMode: false})
              .setCallback('save', (e)=> console.log('save', e))
              .open()
        }
      },
      { label: 'Seleziona', icon: 'pi pi-arrow-right',
        command: ()=> {
          dialogManager.setComponent(SelectProject).setTitle('Seleziona Progetto').setProps({ style:{ width:'70%' } })
            .setOnClose((e)=> onSelectProject(e))
            .open()
        }
      },
      { label: 'Modifica', icon: 'pi pi-pencil',
      command: ()=> {
        dialogManager.setComponent(AddProject).setTitle('Modifica Progetto').setProps({ style:{ width:'50%' } })
            .setData({editMode: true})
            .setOnClose((e)=> onEditProject(e))
            .open()
        }
      },
      {
        label: 'Elimina', icon: 'pi pi-trash',
        command: () => {
          projectStore.selectedProject && ProjectHelper.deleteProject(projectStore.selectedProject.id)
          onDeleteProject(projectStore.selectedProject.id);
        },
      }
    ]
  },
  { label: 'Files', icon: 'pi pi-file', items: [
      { label: 'Nuovo', icon: 'pi pi-plus' },
      { label: 'Seleziona', icon: 'pi pi-arrow-right' },
      { label: 'Modifica', icon: 'pi pi-pencil' },
      { label: 'Elimina', icon: 'pi pi-trash', }
    ]
  },
  { label: 'Pannelli', icon: 'pi pi-file', items: [
      { label: 'Pannello 1', icon: 'pi pi-check' },
      { label: 'Pannello 2', icon: 'pi pi-times' },
    ]
  },
  { label: 'Info', icon: 'pi pi-info-circle'  }
]);
</script>

<template>
  <Menubar class="flex-none p-0 surface-100"  :model="itemsNavbar" />
</template>

<style scoped>

</style>