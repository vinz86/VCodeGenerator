<script setup lang="ts">
import {ref} from "vue";
import type DialogManager from "~/manager/DialogManager";
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
      { label: 'Salva', icon: 'pi pi-save' },
      { separator:true },
      { label: 'Logout', icon: 'pi pi-sign-out' },
    ]
  },
  { label: 'Progetti', icon: 'pi pi-search', items: [
      { label: 'Nuovo', icon: 'pi pi-plus',
        command: ()=> {
          dialogManager.setComponent(AddProject).setTitle('Aggiungi Progetto').setProps({ style:{ width:'50%' } })
              .setOnClose((e)=> onAddProject(e))
              .setData({editMode: false})
              .setCallback('onSave', (e)=> console.log('save', e))
              .open()
        }
      },
      { label: 'Apri', icon: 'pi pi-arrow-right',
        command: ()=> {
          dialogManager.setComponent(SelectProject).setTitle('Apri Progetto').setProps({ style:{ width:'70%' } })
              .setOnClose((e)=> onSelectProject(e))
              .open()
        }
      },
      { separator:true },
      { label: 'Modifica selezionato', icon: 'pi pi-pencil',
      command: ()=> {
        dialogManager.setComponent(AddProject).setTitle('Modifica Progetto').setProps({ style:{ width:'50%' } })
            .setData({editMode: true})
            .setOnClose((e)=> onEditProject(e))
            .open()
        }
      },
      {
        label: 'Elimina selezionato', icon: 'pi pi-trash',
        command: () => {
          projectStore.selectedProject && ProjectHelper.deleteProject(projectStore.selectedProject.id)
          onDeleteProject(projectStore.selectedProject.id);
        },
      }
    ]
  },
  { label: 'Files', icon: 'pi pi-file', items: [
      { label: 'Nuovo file', icon: 'pi pi-file-plus' },
      { label: 'Nuova cartella', icon: 'pi pi-folder-plus' },
      { separator:true },
      { label: 'Modifica selezionato', icon: 'pi pi-pencil' },
      { label: 'Elimina selezionato', icon: 'pi pi-trash', }
    ]
  },
  { label: 'Export', icon: 'pi pi-file-export', items: [
      { label: 'Esporta file', icon: 'pi pi-file-export' },
      { label: 'Esporta progetto', icon: 'pi pi-save' },
    ]
  },
  { label: 'Pagine', icon: 'pi pi-file-export', items: [
      { label: 'ProjectTypes', icon: 'pi pi-file-export', command: async ()=> await navigateTo('/CRUD/ProjectTypes')},
      { label: 'ProjectStates', icon: 'pi pi-save', command: async () => await navigateTo('/CRUD/ProjectStates')},
      { label: 'FileTypes', icon: 'pi pi-save', command: async () => await navigateTo('/CRUD/FileTypes')},
      { label: 'ComponentTypes', icon: 'pi pi-save', command: async () => await navigateTo('/CRUD/ComponentTypes')},
      { label: 'FileExtensions', icon: 'pi pi-save', command: async () => await navigateTo('/CRUD/FileExtensions')},
      { label: 'ComponentPresets', icon: 'pi pi-save', command: async () => await navigateTo('/CRUD/ComponentPresets')},
    ]
  },
  { label: 'Info', icon: 'pi pi-info-circle'  }
]);
</script>

<template>
  <Menubar class="flex-none p-0"  :model="itemsNavbar" />
</template>

<style scoped>

</style>