<script setup lang="ts">
import type { IProjectStateService } from "~/services/api/services/interfaces/IProjectStateService";
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";

const projectStateService: IProjectStateService = Api.getService<IProjectStateService>(ApiKeys.ProjectState);

const fields = [
  { name: 'label', type: 'text', header: 'Label', disabled: false },
  { name: 'entityValue', type: 'text', header: 'Project State' },
];

const columns = [
  { field: 'label', header: 'Label', editable: true, icon: 'pi pi-project-diagram' },
  { field: 'entityValue', header: 'Project State', icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="ProjectState" :service="projectStateService" :fields="fields" :columns="columns">
    <template #columns />
    <template #fields />
  </CRUD>
</template>

<style scoped>
</style>
