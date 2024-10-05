<script setup lang="ts">
import {LoadingManager} from "~/manager/LoadingManager";

import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {IUserService} from "~/services/api/services/interfaces/IUserService";
import {Api} from "~/services/api/core/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {ILoggerDecorator} from "~/models/interfaces/ILoggerDecorator";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {StateManager} from "~/store/StateManager";

const notifyAndLog = DIContainer.getService<ILoggerDecorator<any>>(EServiceKeys.NotifyAndLog);
const userService: IUserService = Api.getService<IUserService>(ApiKeys.UserService);
const stateManager: StateManager<any> = DIContainer.getService<StateManager<any>>(EServiceKeys.StateManager);
const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

async function fetchData() {
  await userService.getUsers();
  notifyAndLog.error('Errore durante il recupero degli utenti:');
}
const getAccount = async () => {
  const result = await userService.getAccount();

  console.log('account Ok: ', result);
  stateManager.setState('currentUser', result);
  localStorageService.save('currentUser', stateManager.getState('currentUser'));
}
onMounted(async () => {
  try {
    LoadingManager.getInstance().start();

    //await getAccount();

  } catch (error) { console.error('Errore durante il recupero dei dati:', error);
  } finally { LoadingManager.getInstance().stop(); }
});
</script>

<template>
  <div>
    <ConfirmDialog />
<!--    <ConfirmPopup />-->
    <DynamicDialog />
    <Toast />
    <ProgressBar v-if="LoadingManager.getInstance().isLoading().value" mode="indeterminate" style="position:absolute; top:0; left:0; width:100%; height: 6px"/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>