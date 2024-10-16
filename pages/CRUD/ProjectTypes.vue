
<script setup lang="ts">
import type { IFileExtensionService } from "~/services/api/services/interfaces/IFileExtensionService";
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";
import type {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {IComponentPresetService} from "~/services/api/services/interfaces/IComponentPresetService";
import type {IProjectTypeService} from "~/services/api/services/interfaces/IProjectTypeService";

const ProjectTypeService: IProjectTypeService = Api.getService<IProjectTypeService>(ApiKeys.ProjectType);



export type TOptionsPreset = {
  id: number;
  name: string;
  componentsType: EComponentTypes
  preset: string;
}


const fields = [
  { name: 'label', type: 'text', header: 'Label', disabled: false },
  { name: 'entityValue', type: 'text', header: 'Project type'},
];

const columns = [
  { field: 'label', header: 'Label', editable: true, icon: 'pi pi-home' },
  { field: 'entityValue', header: 'Project Type', icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="ProjectType" :service="ProjectTypeService" :fields="fields" :columns="columns">
    <!-- COlonne per tabella-->
    <template #columns/>
    <!-- Fields per form di aggiunta/modifica-->
    <template #fields/>
  </CRUD>
</template>

<style scoped>
</style>
