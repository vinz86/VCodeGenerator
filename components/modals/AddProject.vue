<script setup lang="ts">
const emit = defineEmits(['save']);
const dialog = inject('dialogRef')

const newProjectName: Ref<string> = ref();

const createProject = () => {
  emit('save', { data: 'save', name: newProjectName.value });
  //dialog.value.close({data:'test'})
}

onMounted(() => {
  const params = dialog.value.data;
  console.log(params);
  emit('save', { data: 'save', name: "onMounted" });
})
</script>

<template>

  <InputGroup>
    <InputText v-model="newProjectName" class="m-0"  placeholder="Nome progetto" />
    <Button class="m-0"  @click="createProject" icon="fa fa-plus" />
  </InputGroup>
</template>

<style scoped>

</style>