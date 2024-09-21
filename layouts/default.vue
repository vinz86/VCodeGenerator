<script setup lang="ts">
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type DialogManager from "~/manager/DialogManager";
import AddProject from "~/components/modals/AddProject.vue";
import {ProjectHelper} from "~/helper/ProjectHelper";
import UserProfile from "~/components/modals/UserProfile.vue";
import {CookieService} from "~/services/CookieService";

const configManager: IConfigurationManager = DIContainer.getService<IConfigurationManager>(EServiceKeys.ConfigurationManager);
const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const dialogManager: IDialogManager = DIContainer.getService<IDialogManager>(EServiceKeys.DialogManager);
const cookieService: CookieService = DIContainer.getService<CookieService>(EServiceKeys.CookieService);

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
  <div>
    <Toolbar class="p-0 pl-2 pr-3">
      <template #start>
        <div class="logo"><span class="font-bold">{{configManager.getName()}}</span> <i class="text-sm">{{ configManager.getVersion() }} <small>{{ configManager.getVersionDate() }}</small></i></div>
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

    <slot />
    <div class="text-sm text-center font-light pt-1 pb-1">Copyright &copy; {{new Date().getFullYear()}} vcodegenerator.com. All right reserved</div>
  </div>
</template>