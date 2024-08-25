import {defineNuxtPlugin} from '#app';
import {ApiClient} from "~/services/api/ApiClient";
import {UserRepository} from "~/services/api/repositories/UserRepository";
import {EApiHttpClientType} from "~/models/enum/EApiHttpClientType";
import {AuthRepository} from "~/services/api/repositories/AuthRepository";

export default defineNuxtPlugin(nuxtApp => {
    const repositories = {
        http: ApiClient.getInstance(EApiHttpClientType.Axios),
        auth: AuthRepository.getInstance(EApiHttpClientType.Fetch),
        user: UserRepository.getInstance(EApiHttpClientType.Axios),
    }

    nuxtApp.provide('api', repositories);
});