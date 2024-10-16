<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { CRUDManager } from "~/manager/CRUDManager";
import DialogManager from "~/manager/DialogManager";
import EditEntity from "~/components/CRUD/EditEntity.vue";
import ConfirmManager from "~/manager/ConfirmManager";

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
});

const dialogManager = new DialogManager();

const entities: Ref<props.entityType[]> = ref([] as props.entityType[]);
const currentEntity: Ref<props.entityType> = ref({} as props.entityType);
const crudManager = new CRUDManager(props.service, props.entity);
const confirmManager = new ConfirmManager();
// const fieldsTemplate = ref(
const fieldsTemplate = ref(null);

const loadEntities = async () => {
  entities.value = await crudManager.getAll();
};

const onAddEntity = (resultAdd)=>{
  currentEntity.value = resultAdd;
  save();
}
const onAdd = () => {
  currentEntity.value = {};
  dialogManager
      .setTitle(`Aggiungi ${props.entity}`)
      .setOnClose((result)=> (result.data?.edited && result.data?.entity) && onAddEntity(result.data.entity))
      .open(EditEntity, { entityType: props.fields, entity: currentEntity.value, editMode: false, fieldsTemplate: fieldsTemplate.value });
};

const onEditEntity = (resultAdd)=>{
  const {id} = currentEntity.value;
  currentEntity.value = {id: id, ...resultAdd};
  save();
}
const onEdit = (entity: typeof props.entity) => {
  currentEntity.value = { ...entity };
  dialogManager
      .setTitle(`Modifica ${props.entity}`)
      .setOnClose((result)=> (result.data?.edited && result.data?.entity) && onEditEntity(result.data.entity))
      .open(EditEntity, { entityType: props.fields, entity: currentEntity.value, editMode: true, fieldsTemplate: fieldsTemplate.value});
};

const save = async () => {
  const { id, ...entityToSave } = currentEntity.value;

  if (id) {
    await crudManager.update(id, currentEntity.value);
  } else {
    await crudManager.create(entityToSave);
  }

  await loadEntities();
};

const onDelete = async (id: string) => {
  await crudManager.delete(id);
  await loadEntities();
};

const slots = useSlots();
onMounted(() => {
  loadEntities();

  // recupero lo slot fields
  fieldsTemplate.value = slots.fields || null;
});
</script>

<template>
  <div>
    <Panel class="m-2" style="height: calc(100vh - 120px)" :header="entity">
      <template #icons>

        <Button outlined label="Indietro" icon="pi pi-arrow-left" @click="useRouter().back()" class="mr-2" />
        <Button label="Aggiungi" icon="pi pi-plus" @click="onAdd" />
      </template>
      <div class="flex justify-content-end mb-2">
      </div>
      <DataTable :value="entities" dataKey="id">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :body="col.template" />

        <slot name="columns" />

        <Column>
          <template #body="{ data }">
            <div class="flex justify-content-end mb-2">
              <Button rounded outlined icon="pi pi-pencil" class="mr-2" @click="onEdit(data)" />
              <Button rounded outlined icon="pi pi-trash" class="p-button-danger" @click="confirmManager.setAcceptCallback(()=>onDelete(data.id)).open()" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Panel>


  </div>
</template>

<style scoped>
</style>
