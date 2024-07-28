import { defineNuxtPlugin } from '#app';
import {DIContainerInit} from "~/services/DipendencyInjection/DIContainerInit";

export default defineNuxtPlugin(() => {
    DIContainerInit.init();
});