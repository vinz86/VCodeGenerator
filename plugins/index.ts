import { defineNuxtPlugin } from '#app';
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('DroppableComponent', DroppableComponent);
});
