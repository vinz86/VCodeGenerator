<script setup lang="ts">
const emit = defineEmits(['preview', 'exportHtml', 'exportProject', 'importProject'])
</script>

<template>

  <div class="flex flex-column">
    <div class="flex">
      <Panel class="w-full" toggleable>
        <template #header>
          <i class="fa fa-file-export" />&nbsp;<small>Esportazione</small>
        </template>
        <Button outlined class="w-full mb-1" @click="emit('preview')" severity="success"><i class="fa fa-search" />&nbsp;Preview</Button>
        <Button @click="emit('exportHtml')" severity="dark" class="w-full"><i class="fa fa-download" />&nbsp;Download HTML</Button>
      </Panel>
    </div>
    <div class="flex">
      <Panel class="w-full" toggleable collapsed>
        <template #header>
          <i class="fa fa-save" />&nbsp;<small>Salva Progetto</small>
        </template>
        <Button text @click="emit('exportProject')" severity="secondary"><i class="fa fa-file-export" />&nbsp;Esporta progetto</Button>
        <FileUpload class="p-button-text" mode="basic" accept="application/json" :maxFileSize="1000000" @select="emit('importProject', $event)" :auto="true" chooseLabel="Importa progetto">
          <template #uploadicon> <i class="fa fa-file-import" />&nbsp; </template>
        </FileUpload>
      </Panel>
    </div>
  </div>
</template>

<style scoped>

</style>