import {defineNuxtPlugin} from '#app';
import {ApiContainer, initApiContainer} from "~/services/api/ApiContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export default defineNuxtPlugin(nuxtApp => {
    initApiContainer();

    const repositories = {
        http: ApiContainer.getService(EServiceKeys.ApiClient),
        auth: ApiContainer.getService(EServiceKeys.AuthRepository),
        user: ApiContainer.getService(EServiceKeys.UserRepository),
        project: ApiContainer.getService(EServiceKeys.ProjectRepository),
        files: ApiContainer.getService(EServiceKeys.FileRepository),
    }

    nuxtApp.provide('api', repositories);
});