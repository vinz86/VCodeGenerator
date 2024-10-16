
<script setup lang="ts">
import { Api } from "~/services/api/Api";
import { ApiKeys } from "~/services/api/ApiKeys";
import type {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {IComponentPresetService} from "~/services/api/services/interfaces/IComponentPresetService";

const componentPresetService: IComponentPresetService = Api.getService<IComponentPresetService>(ApiKeys.OptionsPreset);



export type TOptionsPreset = {
  id: number;
  name: string;
  componentsType: EComponentTypes
  preset: string;
}



const fields = [
  { name: 'name', type: 'text', header: 'Nome', disabled: false },
  { name: 'componentsType', type: 'text', header: 'ComponentsType'},
  { name: 'preset', type: 'text', header: 'Preset'},
];

const columns = [
  { field: 'name', header: 'Nome', editable: true, icon: 'pi pi-home' },
  { field: 'componentsType', header: 'Components Type', icon: 'pi pi-testicon' },
  { field: 'preset', header: 'Preset', icon: 'pi pi-testicon' },
];
</script>

<template>
  <CRUD entity="ComponentPreset" :service="componentPresetService" :fields="fields" :columns="columns">
    <!-- Colonne per tabella-->
    <template #columns/>
    <!-- Fields per form di aggiunta/modifica-->
    <template #fields/>
  </CRUD>
</template>

<style scoped>
</style>
