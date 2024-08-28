import {defineNuxtPlugin} from '#app';
import {ApiContainer} from "~/services/api/ApiContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {Api} from "~/services/api/Api";

export default defineNuxtPlugin(nuxtApp => {
    /*const repositories = {
        http: ApiContainer.getService(EServiceKeys.ApiClient),
        auth: ApiContainer.getService(EServiceKeys.AuthRepository),
        user: ApiContainer.getService(EServiceKeys.UserRepository),
        project: ApiContainer.getService(EServiceKeys.ProjectRepository),
        files: ApiContainer.getService(EServiceKeys.FileRepository),
    }

    nuxtApp.provide('api', repositories);*/
    nuxtApp.provide('api', Api.getInstance().getRepository());
});