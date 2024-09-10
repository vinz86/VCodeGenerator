export default defineNuxtPlugin((nuxtApp) => {
    const originalFetch = nuxtApp.$fetch;

    nuxtApp.provide('fetch', async (request: string, options: any = {}) => {
        try {
            const response = await originalFetch(request, options);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirige alla pagina di login
                navigateTo('/login');
            }
            throw error; // Rilancia l'errore per gestire altri errori specifici nel componente chiamante
        }
    });
});
