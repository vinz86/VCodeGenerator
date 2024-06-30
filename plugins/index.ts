import { defineNuxtPlugin } from '#app';
import ButtonComponent from '~/components/DraggableComponents/Form/ButtonComponent.vue';
import InputComponent from '~/components/DraggableComponents/Form/InputComponent.vue';
import VCGInputText from "~/components/DraggableComponents/PrimeVue/VCGInputText.vue";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";
import LabelComponent from '~/components/DraggableComponents/Form/LabelComponent.vue';
import VCGInputNumber from "~/components/DraggableComponents/PrimeVue/VCGInputNumber.vue";
import VCGSlider from "~/components/DraggableComponents/PrimeVue/VCGSlider.vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('ButtonComponent', ButtonComponent);
    nuxtApp.vueApp.component('InputComponent', InputComponent);
    nuxtApp.vueApp.component('LabelComponent', LabelComponent);
    nuxtApp.vueApp.component('DroppableComponent', DroppableComponent);
    nuxtApp.vueApp.component('VCGInputText', VCGInputText);
    nuxtApp.vueApp.component('VCGInputNumber', VCGInputNumber);
    nuxtApp.vueApp.component('VCGSlider', VCGSlider);
});
