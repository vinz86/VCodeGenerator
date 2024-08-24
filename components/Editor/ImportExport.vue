<script setup lang="ts">
const emit = defineEmits([ 'exportProject', 'importProject'])
</script>

<template>

  <div class="flex flex-column">
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