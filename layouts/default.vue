<script setup lang="ts">
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type DialogManager from "~/manager/DialogManager";
import AddProject from "~/components/modals/project/AddProject.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";
import UserProfile from "~/components/modals/UserProfile.vue";
import {CookieService} from "~/services/CookieService";
import {useAppStore} from "~/store/AppStore";
import {FileHelper} from "~/helper/FileHelper";
import ConfirmManager, {EConfirmType} from "~/manager/ConfirmManager";

const slotRef = ref();

const configManager: IConfigurationManager = DIContainer.getService<IConfigurationManager>(EServiceKeys.ConfigurationManager);
const confirmManager: ConfirmManager = DIContainer.getService<ConfirmManager>(EServiceKeys.ConfirmManager);
const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const dialogManager: IDialogManager = DIContainer.getService<IDialogManager>(EServiceKeys.DialogManager);
const cookieService: CookieService = DIContainer.getService<CookieService>(EServiceKeys.CookieService);

const projectStore = useAppStore();

const projectName: ComputedRef<string> = computed(()=> projectStore?.selectedProject?.name);
const projectId: ComputedRef<string> = computed(()=> projectStore?.selectedProject?.id);

const logout = () => {
  localStorageService.remove('authToken');
  navigateTo('/login');
}
const toggleDarkMode = () => {
  document.body.classList.toggle('app-dark');
};

const isDarkMode = computed(() => {
  return document.body.classList.contains('app-dark');
});
</script>
<template>
  <div style="height: 100vh;">
    <Toolbar class="pl-2 pr-3 border-none">
      <template #start>
        <div class="logo">
          <span class="font-bold">{{configManager.getName()}}</span> <i class="text-sm">{{ configManager.getVersion() }} <small>{{ configManager.getVersionDate() }}</small></i>
          <span class=" ml-5 opacity-80">· {{projectName}}</span>
          <Button v-if="projectId" rounded text severity="danger" icon="pi pi-trash" @click="confirmManager
                  .setMessage(`Confermi l'eliminazione del Progetto '${projectName}'?`)
                  .setType(EConfirmType.DIALOG)
                  .setAcceptCallback(async () => {
                    await ProjectHelper.deleteProject(projectId);
                    projectStore.setProject({})
                  })
                  .open($event.currentTarget as HTMLElement)" />
        </div>
      </template>

      <template #center></template>

      <template #end>
        <Button icon="pi pi-sun" class="mr-2" rounded text @click="toggleDarkMode" />
        <Button icon="pi pi-user" class="mr-2" rounded text @click="dialogManager.
          setComponent(UserProfile)
          .setTitle('Profilo Utente')
          .open()" />
        <Button icon="pi pi-sign-out" rounded text @click="logout" />
      </template>
    </Toolbar>

    <slot ref="slotRef" />
    <div class="text-sm text-center font-light pt-1 pb-1">Copyright &copy; {{new Date().getFullYear()}} vcodegenerator.com. All right reserved</div>
  </div>
</template>