import { defineNuxtPlugin } from '#app';
import {DIContainerInit} from "~/DipendencyInjection/DIContainerInit";

export default defineNuxtPlugin(() => {
    DIContainerInit.init();
});