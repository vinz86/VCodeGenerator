export default defineNuxtRouteMiddleware(async (to, from) => {
    // In un middleware globale, possiamo monitorare tutte le navigazioni e risposte alle API
    const { $fetch } = useNuxtApp();

    // Wrappa la funzione fetch globale per intercettare le risposte
    useRequestFetch((ctx, { request, options, response }) => {
        if (response && response.status === 401) {
            // Se la risposta è 401, redirige alla pagina di login
            return navigateTo('/login');
        }
    });
});
