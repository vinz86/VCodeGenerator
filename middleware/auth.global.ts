import { defineNuxtRouteMiddleware } from '#app';
import {LocalStorageService} from "~/services/LocalStorageService";

export default defineNuxtRouteMiddleware((to, from) => {
    const localStorageService = new LocalStorageService();
    const token = localStorageService.load('authToken');

    const isAuthenticated = !!token;

    if (!isAuthenticated && to.path !== '/login') {
        return navigateTo('/login');
    }
})