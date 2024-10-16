<script setup lang="ts">
import type { IFileTypeService } from "~/services/api/services/interfaces/IFileTypeService";
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";
import type { EFileTypes } from "~/models/enum/EFileTypes";

const fileTypeService: IFileTypeService = Api.getService<IFileTypeService>(ApiKeys.FileType);

const fields = [
  { name: 'label', type: 'text', header: 'Label', disabled: false },
  { name: 'entityValue', type: 'text', header: 'File Type' },
];

const columns = [
  { field: 'label', header: 'Label', editable: true, icon: 'pi pi-file' },
  { field: 'entityValue', header: 'File Type', icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="FileType" :service="fileTypeService" :fields="fields" :columns="columns">
    <template #columns />
    <template #fields />
  </CRUD>
</template>

<style scoped>
</style>
