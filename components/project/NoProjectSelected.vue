<script setup lang="ts">
import SelectProject from "~/components/modals/project/SelectProject.vue";
import type DialogManager from "~/manager/DialogManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

const emit = defineEmits(['selectProject']);
const dialogManager: DialogManager = DIContainer.getService<DialogManager>(EServiceKeys.DialogManager)

const onSelectProject = (e: Event): void => emit('selectProject', e?.data);
</script>

<template>
<div class="flex h-full flex-column">
  <div class="flex-grow-1 justify-content-center align-content-center m-5 p-5 border-2 border-dashed border-black-alpha-40 bg-black-alpha-10 border-round-2xl">
    <Button
        size="large"
        class="w-full"
        @click.prevent="dialogManager
          .setComponent(SelectProject)
          .setTitle('Seleziona Progetto')
          .setProps({ style:{ width:'70%' } })
          .setOnClose((e)=> onSelectProject(e))
          .open()"
    >
      <span><i class="pi pi-search mr-2 text-3xl font-bold" /></span><br>
      <span class="font-bold uppercase">Seleziona un Progetto</span>
    </Button>
  </div>
</div>
</template>

<style scoped>

</style>