<script setup lang="ts">
import type { IComponentFactoryService } from "~/services/api/services/interfaces/IComponentFactoryService";
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";
import type { EComponentTypes } from "~/models/enum/EComponentTypes";

const componentTypeService: IComponentFactoryService = Api.getService<IComponentFactoryService>(ApiKeys.ComponentType);

const fields = [
  { name: 'label', type: 'text', header: 'Label', disabled: false },
  { name: 'entityValue', type: 'text', header: 'Component Type' },
];

const columns = [
  { field: 'label', header: 'Label', editable: true, icon: 'pi pi-cog' },
  { field: 'entityValue', header: 'Component Type', icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="ComponentType" :service="componentTypeService" :fields="fields" :columns="columns">
    <template #columns />
    <template #fields />
  </CRUD>
</template>

<style scoped>
</style>
