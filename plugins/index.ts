import { defineNuxtPlugin } from '#app';
import ButtonComponent from '~/components/ButtonComponent.vue';
import InputComponent from '~/components/InputComponent.vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('ButtonComponent', ButtonComponent);
    nuxtApp.vueApp.component('InputComponent', InputComponent);
});
