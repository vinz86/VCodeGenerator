<script setup lang="ts">

import {LoadingManager} from "~/manager/LoadingManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {LoggerDecorator} from "~/decorator/LoggerDecorator";
import {ELoggerLevel} from "~/models/enum/ELoggerLevel";
import {ELoggerOutput} from "~/models/enum/ELoggerOutput";
import type {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import type {StateManager} from "~/store/StateManager";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IAuthService} from "~/services/api/services/interfaces/IAuthService";
import type {IUserService} from "~/services/api/services/interfaces/IUserService";
import type {CookieService} from "~/services/CookieService";
import {useUserStore} from "~/store/useUserStore";

const authService: IAuthService = Api.getService<IAuthService>(ApiKeys.AuthService);
const userService: IUserService = Api.getService<IAuthService>(ApiKeys.UserService);

const notifyManager: INotifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
const configurationManager: ConfigurationManager = DIContainer.getService<ConfigurationManager>(EServiceKeys.ConfigurationManager);
const notifyManagerAndLogger = new LoggerDecorator(notifyManager, {level:ELoggerLevel.Debug, output: ELoggerOutput.LocalStorage, length: 50});
const stateManager: StateManager<AppState> = DIContainer.getService<StateManager<AppState>>(EServiceKeys.StateManager);
const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const cookieService: CookieService = DIContainer.getService<CookieService>(EServiceKeys.CookieService);

const userStore = useUserStore();
definePageMeta({
  layout: 'empty'
})


const formData: IAuthorize = ref({} as IAuthorize);
const login = async () => {
    const result = await authService.login(formData.value);
// TODO: cookie o localSTorage?
    const token = result.id_token;
    if(token){
      //stateManager.setState('authToken', token);
      cookieService.save('authToken', token, 1);
      localStorageService.save('authToken', token);
      await getAccount();
      await navigateTo('/');
    }
}

const getAccount = async () => {
  await userStore.fetchUser();
}

const onLoginClick = async () => {
  try{
    await login();
  }
  catch (e) { notifyManager.error(e)  }
  finally { LoadingManager.getInstance().stop() }
}
</script>

<template>
  <div class="w-full flex align-items-center" style="height: 100vh">

    <div class="surface-card p-4 shadow-2 border-round w-full max-w-30rem" style=" margin: 0 auto;">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">
          {{ configurationManager.getName() }}
          <small>{{ configurationManager.getVersion()}}</small>
        </div>
        <span class="text-600 font-medium line-height-3">Non hai un account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Registrati!</a>
      </div>

      <div>
        <form>
          <label for="user" class="block text-900 font-medium mb-2">Nome Utente</label>
          <InputText id="user" v-model="formData.username" placeholder="Nome Utente" class="w-full mb-3" />

          <label for="password" class="block text-900 font-medium mb-2">Password</label>
          <Password id="password" v-model="formData.password" type="password" placeholder="Password" autocomplete="current-password" class="w-full mb-3" style="width:100%" />

          <div class="flex align-items-center justify-content-between mb-6">
            <div class="flex align-items-center">
              <Checkbox id="rememberme" v-model="formData.rememberMe" :binary="true" style-class="mr-2"/>
              <label for="rememberme" class="text-900">Ricordami</label>
            </div>
          </div>

          <Button p-ripple label="Login" icon="pi pi-user" class="w-full" @click="onLoginClick" />
        </form>
      </div>
    </div>
  </div>
</template>

<style >
.p-password-input{
  width:100%
}
</style>