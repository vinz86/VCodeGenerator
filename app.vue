<script setup lang="ts">
import {LoadingManager} from "~/manager/LoadingManager";

import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";

let configManager: IConfigurationManager;
onMounted(()=>{

  LoadingManager.getInstance().start();
  console.log(LoadingManager.getInstance().isLoading().value);
  configManager = ConfigurationManager.getInstance();

  setTimeout(async ()=>{
    await nextTick();

    LoadingManager.getInstance().stop();
    console.log(LoadingManager.getInstance().isLoading().value);
  },3000)
})
</script>

<template>
  <div>
    <div v-if="configManager">
      {{ configManager.getConfig() }}
      <p>FeatureX: {{ configManager.isFeatureEnabled('featureX') }}</p>
      <p>FeatureY: {{ configManager.getTheme() }}</p>
      <p>API Base URL: {{ configManager.getApiBase() }}</p>
      <p>Tema: {{ configManager.getTheme() }}</p>
    </div>


    <Toast />
    <ProgressBar mode="indeterminate" style="height: 6px" v-if="LoadingManager.getInstance().isLoading().value"></ProgressBar>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>