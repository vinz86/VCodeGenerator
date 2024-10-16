<script setup lang="ts">
import type { IFileExtensionService } from "~/services/api/services/interfaces/IFileExtensionService";
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";

const fileExtensionService: IFileExtensionService = Api.getService<IFileExtensionService>(ApiKeys.FileExtensionsService);

const fields = [
  { name: 'label', type: 'text', header: 'Label', disabled: false },
  { name: 'extension', type: 'text', header: 'Estensione', disabled: true },
];

const columns = [
  { field: 'label', header: 'Label', editable: true, icon: 'pi pi-home' },
  { field: 'extension', header: 'Estensione', template: '<template #hh>tttttt</template>', editable: true, icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="FileExtension" :service="fileExtensionService" :fields="fields" :columns="columns">
    <!-- COlonne per tabella-->
    <template #columns>
      <Column header="Test" field="test" />
    </template>
    <!-- Fields per form di aggiunta/modifica-->
    <template #fields>
      <span>test</span>
    </template>
  </CRUD>
</template>

<style scoped>
</style>
