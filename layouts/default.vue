<script setup lang="ts">
import type {IConfigurationManager} from "~/models/interfaces/IConfigurationManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

let configManager: IConfigurationManager = DIContainer.getService<IConfigurationManager>(EServiceKeys.ConfigurationManager);

</script>
<template>
  <div>
    <Toolbar>
      <template #start>
        <div class="logo"><span class="font-bold">{{configManager.getName()}}</span> <i class="text-sm">{{ configManager.getVersion() }} <small>{{ configManager.getVersionDate() }}</small></i></div>
      </template>

      <template #center>

      </template>

      <template #end>
        <Button icon="pi pi-sun" class="mr-2" rounded />
        <Button icon="pi pi-user" class="mr-2" rounded />
        <Button icon="pi pi-sign-out" rounded />
      </template>
    </Toolbar>

    <slot />
    <div class="text-sm text-center font-light pt-1 pb-1">Copyright &copy; {{new Date().getFullYear()}} vcodegenerator.com. All right reserved</div>
  </div>
</template>