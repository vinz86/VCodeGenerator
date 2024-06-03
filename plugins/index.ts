import { defineNuxtPlugin } from '#app';
import ButtonComponent from '~/components/Form/ButtonComponent.vue';
import InputComponent from '~/components/Form/InputComponent.vue';
import VCGInputText from "~/components/PrimeVue/VCGInputText.vue";
import DroppableComponent from "~/components/Layout/DroppableComponent.vue";
import LabelComponent from '~/components/Form/LabelComponent.vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('ButtonComponent', ButtonComponent);
    nuxtApp.vueApp.component('InputComponent', InputComponent);
    nuxtApp.vueApp.component('LabelComponent', LabelComponent);
    nuxtApp.vueApp.component('VCGInputText', VCGInputText);
    nuxtApp.vueApp.component('DroppableComponent', DroppableComponent);
});
