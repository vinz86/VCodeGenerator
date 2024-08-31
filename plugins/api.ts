import {defineNuxtPlugin} from '#app';
import {ApiInit} from "~/services/api/ApiInit";

export default defineNuxtPlugin(nuxtApp => {
    // Registro i servizi api
    ApiInit.getInstance();
});