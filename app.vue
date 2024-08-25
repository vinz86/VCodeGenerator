<script setup lang="ts">
import {LoadingManager} from "~/manager/LoadingManager";

import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

let configManager: IConfigurationManager = DIContainer.getService<IConfigurationManager>(EServiceKeys.ConfigurationManager);

const { $api } = useNuxtApp();
//const apiClient = ApiClient.getInstance(EApiHttpClientType.Axios);

async function fetchData() {
  const data = {
    "userId": 1,
    "title": "delectus aut autem",
    "completed": false
  };

  try {
    await $api.http.get('todos/1', { }, true);
    await $api.http.post('todos', data);
    await $api.http.put('todos/1', data);
    await $api.http.patch('todos/1', data);
    await $api.http.delete('todos/1');

    await $api.user.getUserById(1);

  } catch (error) {
    console.error('API Request Error:', error);
  }
}

onMounted(async () => {
  try {
    LoadingManager.getInstance().start();

    if(configManager instanceof ConfigurationManager){
      console.log('configManager.getConfig()', configManager.getConfig())
      LoadingManager.getInstance().stop();
    }

    // Utilizza il repository per ottenere gli utenti
    //users.value = await $api.userRepository.getUsers();


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