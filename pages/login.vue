<script setup lang="ts">

import {LoadingManager} from "~/manager/LoadingManager";
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {LoggerDecorator} from "~/decorator/LoggerDecorator";
import {ELoggerLevel} from "~/models/enum/ELoggerLevel";
import {ELoggerOutput} from "~/models/enum/ELoggerOutput";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import {StateManager} from "~/store/StateManager";
import {LocalStorageService} from "~/services/LocalStorageService";
import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";

const { $api } = useNuxtApp();
const notifyManager: INotifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const configurationManager: ConfigurationManager = ConfigurationManager.getInstance()
const notifyManagerAndLogger = new LoggerDecorator(notifyManager, {level:ELoggerLevel.Debug, output: ELoggerOutput.LocalStorage, length: 50});
const stateManager = StateManager.getInstance<AppState>();
const localStorageService = new LocalStorageService();



const formData: IAuthorize = ref({} as IAuthData);
const login = async () => {
    const result = await $api.auth.login(formData.value);

    console.log('Login Ok: ', result);
    const token = result.id_token;
    stateManager.setState('authToken', token);
    localStorageService.save('authToken', stateManager.getState('authToken'));
}

const getAccount = async () => {
    const result = await $api.user.getAccount();

    console.log('account Ok: ', result);
    stateManager.setState('currentUser', result);
    localStorageService.save('currentUser', stateManager.getState('currentUser'));
}
const onLoginClick = async () => {
  try{
    await login();
    debugger
    await getAccount();

    await navigateTo('/');
  }
  catch (e) { notifyManager.error(e)  }
  finally { LoadingManager.getInstance().stop() }
}
</script>

<template>
  <div class="surface-card p-4 shadow-2 border-round w-full w-6; " style="margin: 0 auto;">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        {{ configurationManager.getName() }}
        <small>{{ configurationManager.getVersion()}}</small>
      </div>
      <span class="text-600 font-medium line-height-3">Non hai un account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Registrati!</a>
    </div>

    <div>
      <label for="user" class="block text-900 font-medium mb-2">Nome Utente</label>
      <InputText id="user" v-model="formData.username" placeholder="Nome Utente" class="w-full mb-3" />

      <label for="password" class="block text-900 font-medium mb-2">Password</label>
      <Password id="password" v-model="formData.password" type="password" placeholder="Password" class="w-full mb-3" />

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberme" v-model="formData.rememberMe" :binary="true" styleClass="mr-2"></Checkbox>
          <label for="rememberme" class="text-900">Ricordami</label>
        </div>
      </div>

      <Button @click="onLoginClick" pRipple label="Login" icon="pi pi-user" class="w-full" />
    </div>
  </div>
</template>

<style scoped>

</style>