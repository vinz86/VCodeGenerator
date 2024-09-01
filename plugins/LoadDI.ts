import { defineNuxtPlugin } from '#app';
import {DIContainerInit} from "~/DIContainer/DIContainerInit";

export default defineNuxtPlugin(() => {
    DIContainerInit.init();
});