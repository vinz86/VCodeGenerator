<script setup lang="ts">
import {LoadingManager} from "~/manager/LoadingManager";

import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {IUserRepository} from "~/services/api/interfaces/IUserRepository";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {ILoggerDecorator} from "~/models/interfaces/ILoggerDecorator";

let notifyAndLog = DIContainer.getService<ILoggerDecorator<any>>(EServiceKeys.NotifyAndLog);
let userService: IUserRepository = ApiContainer.getService<IUserRepository>(EApiKeys.UserRepository);

async function fetchData() {
  await userService.getUsers();
  notifyAndLog.error('Errore durante il recupero degli utenti:');
}

onMounted(async () => {
  try {
    LoadingManager.getInstance().start();

    //await fetchData();

  } catch (error) { console.error('Errore durante il recupero dei dati:', error);
  } finally { LoadingManager.getInstance().stop(); }
});
</script>

<template>
  <div>
    <Toast />
    <ProgressBar mode="indeterminate" style="height: 6px" v-if="LoadingManager.getInstance().isLoading().value"></ProgressBar>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>