<script setup lang="ts">

import {ProjectHelper} from "~/helper/ProjectHelper";

const generatedCode = defineModel();

</script>

<template>
  <Panel class="overflow-y-auto h-auto" header="Codice generato" toggleable>
    <template #default>
      <div class="h-15rem">
        <div class="text-right text-green-400 mb-1">
          <Button size="small" outlined icon="fa fa-copy" @click="ProjectHelper.copyTextareaToClipboard('textarea-generated-code')" />
        </div>
        <textarea id="textarea-generated-code" class="w-full h-10rem" disabled v-html="generatedCode"/>
      </div>
    </template>
  </Panel>
</template>

<style scoped>

</style>