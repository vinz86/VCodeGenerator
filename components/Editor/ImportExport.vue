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
        <Button text severity="secondary" @click="emit('exportProject')"><i class="fa fa-file-export" />&nbsp;Esporta progetto</Button>
        <FileUpload class="p-button-text" mode="basic" accept="application/json" :max-file-size="1000000" :auto="true" choose-label="Importa progetto" @select="emit('importProject', $event)">
          <template #uploadicon> <i class="fa fa-file-import" />&nbsp; </template>
        </FileUpload>
      </Panel>
    </div>
  </div>
</template>

<style scoped>

</style>