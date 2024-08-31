<script setup lang="ts">
import {LoadingManager} from "~/manager/LoadingManager";

import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {IUserRepository} from "~/services/api/interfaces/IUserRepository";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";

let configManager: IConfigurationManager = DIContainer.getService<IConfigurationManager>(EServiceKeys.ConfigurationManager);
let userService: IUserRepository = ApiContainer.getService<IUserRepository>(EApiKeys.UserRepository);

async function fetchData() {
    await userService.getUsers();
}

onMounted(async () => {
  try {
    LoadingManager.getInstance().start();

    if(configManager instanceof ConfigurationManager){
      console.log('configManager.getConfig()', configManager.getConfig())
      LoadingManager.getInstance().stop();
    }

    await fetchData();
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
  }
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