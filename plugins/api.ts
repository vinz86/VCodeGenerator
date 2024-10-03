import {defineNuxtPlugin} from '#app';
import {ApiInit} from "~/services/api/ApiInit";
import {EApiHttpClientType} from "~/services/api/core/models/enum/EApiHttpClientType";
import {EApiAuthType} from "~/services/api/core/models/enum/EApiAuthType";

export default defineNuxtPlugin(nuxtApp => {
    //registro i servizi
    ApiInit.getInstance(EApiHttpClientType.Fetch, 10000, EApiAuthType.LOCALSTORAGE);
});