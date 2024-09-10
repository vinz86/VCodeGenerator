import { defineNuxtPlugin } from '#app';
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";
import Button from "primevue/button";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('DroppableComponent', DroppableComponent);
});
