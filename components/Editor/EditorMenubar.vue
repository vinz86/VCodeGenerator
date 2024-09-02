<script setup lang="ts">
import {ref} from "vue";

const itemsNavbar = ref([
  { label: 'Home',  icon: 'pi pi-home', command: async () => await navigateTo('/') },
  { label: 'Progetti', icon: 'pi pi-search', items: [
      { label: 'Nuovo', icon: 'pi pi-plus' },
      { label: 'Seleziona', icon: 'pi pi-arrow-right' },
      { label: 'Modifica', icon: 'pi pi-pencil' },
      { label: 'Elimina', icon: 'pi pi-trash', }
    ]
  },
  { label: 'Files', icon: 'pi pi-file', items: [
      { label: 'Nuovo', icon: 'pi pi-plus' },
      { label: 'Seleziona', icon: 'pi pi-arrow-right' },
      { label: 'Modifica', icon: 'pi pi-pencil' },
      { label: 'Elimina', icon: 'pi pi-trash', }
    ]
  },
  { label: 'Pannelli', icon: 'pi pi-file', items: [
      { label: 'Pannello 1', icon: 'pi pi-check' },
      { label: 'Pannello 2', icon: 'pi pi-times' },
    ]
  },
  { label: 'Info', icon: 'pi pi-info-circle'  }
]);
</script>

<template>
  <Menubar class="flex-none p-0 surface-100"  :model="itemsNavbar" />
</template>

<style scoped>

</style>