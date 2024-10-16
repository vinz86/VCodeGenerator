<script setup lang="ts">
import { ref, inject, onMounted, defineEmits } from "vue";

export interface TDialogFileParams {
  editMode: boolean;
  entityType: Record<string, any>[];
  entity?: Record<string, any>;
}

const emit = defineEmits(['save']);
const dialog = inject('dialogRef');

const params = ref<TDialogFileParams>({} as TDialogFileParams);
const isEditMode = ref(false);
const entityType = ref<Record<string, any>[]>([]);
const entity = ref<Record<string, any>>({});
const fieldsTemplate: Ref<[Array, object]> = ref();

const saveEntity = () => {
  const payload = Object.fromEntries(entityType.value.map(field => [field.name, entity.value[field.name]]));

  emit("save", payload);
  dialog.value.close({ edited: true, entity: payload });
};

onMounted(() => {
  params.value = dialog?.value?.data;

  isEditMode.value = params.value?.editMode || false;
  entityType.value = params.value?.entityType || [];
  fieldsTemplate.value = params.value?.fieldsTemplate || [];

  if (isEditMode.value && params.value.entity) {
    entity.value = { ...params.value.entity };
  } else {
    entity.value = entityType.value.reduce((acc, field) => {
      acc[field.name] = typeof field.type === 'boolean' ? false
          : typeof field.type === 'number' ? 0
              : "";
      return acc;
    }, {} as Record<string, any>);
  }
});
</script>

<template>
  <div class="edit-entity-wrapper">
    <div v-for="field in entityType" :key="field.name" class="mb-2">
      <label :for="field.name">{{ field.header }}</label>
      <template v-if="field.type === 'boolean'">
        <Checkbox v-model="entity[field.name]" class="w-full" :binary="true" />
      </template>
      <template v-else-if="field.type === 'number'">
        <InputNumber :id="field.name" v-model="entity[field.name]" class="w-full" />
      </template>
      <template v-else>
        <InputText :id="field.name" v-model="entity[field.name]" class="w-full" />
      </template>
    </div>

    <component :is="fieldsTemplate" v-if="fieldsTemplate"/>

    <div class="flex justify-content-end">
      <Button
          :label="isEditMode ? 'Modifica' : 'Aggiungi'"
          :icon="isEditMode ? 'pi pi-pencil' : 'pi pi-add'"
          type="submit"
          @click.prevent="saveEntity"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom styles */
</style>
