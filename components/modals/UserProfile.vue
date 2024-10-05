<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IUser} from "~/models/interfaces/IUser";
import type { LocalStorageService } from '~/services/LocalStorageService';
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);

const user = ref<IUser | null>(null);

const ruoli = ref([
  { name: 'Administrator', code: 'ROLE_ADMIN' },
  { name: 'User', code: 'ROLE_USER' }
]);

onMounted(() => {
  user.value = localStorageService.load('currentUser') as IUser;
});
</script>

<template>
  <div v-if="user" class="user-profile">
    <div class="p-fluid grid">
      <div class="field col-12 md:col-6">
        <label for="login">Login:&nbsp;</label>
        <InputText id="login" v-model="user.login" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="firstName">Nome:&nbsp;</label>
        <InputText id="firstName" v-model="user.firstName" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="lastName">Cognome:&nbsp;</label>
        <InputText id="lastName" v-model="user.lastName" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="email">Email:&nbsp;</label>
        <InputText id="email" v-model="user.email" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="langKey">Lingua:&nbsp;</label>
        <InputText id="langKey" v-model="user.langKey" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="createdBy">Creato da:&nbsp;</label>
        <InputText id="createdBy" v-model="user.createdBy" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="createdDate">Data di Creazione:&nbsp;</label>
        <InputText id="createdDate" v-model="user.createdDate" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="lastModifiedBy">Modificato da:&nbsp;</label>
        <InputText id="lastModifiedBy" v-model="user.lastModifiedBy" disabled />
      </div>

      <div class="field col-12 md:col-6">
        <label for="lastModifiedDate">Data Ultima Modifica:&nbsp;</label>
        <InputText id="lastModifiedDate" v-model="user.lastModifiedDate" disabled />
      </div>

      <div class="field col-12">
        <label for="activated">Attivo:&nbsp;</label>
        <Checkbox id="activated" v-model="user.activated" binary disabled />
      </div>

      <div class="field col-12">
        <label>Ruoli:&nbsp;</label>
        <MultiSelect
v-model="user.authorities" :options="ruoli" option-label="name" option-value="code" filter placeholder="Scegli Ruoli"
                     display="chip" :max-selected-labels="10" class="w-full" disabled />
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 20px;
  *{
    border:0;
    background: transparent;
  }
}
</style>
