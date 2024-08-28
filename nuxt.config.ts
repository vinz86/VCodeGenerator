// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  components: true,
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue'
  ],
  primevue: {
    components: {
      include: '*',
      exclude: ['Editor']
    }
  },
  css: [
    'primevue/resources/themes/aura-light-blue/theme.css',
    '@/assets/theme_override.css',
    'primeflex/primeflex.min.css',
    'primeicons/primeicons.css',
    '@/assets/vendor/fontawesome/css/all.css',
    '@/assets/style.css',
  ],
  runtimeConfig: {
    public: {
      clientConfig: 'VCodeGenerator' || process.env.CLIENT_ID || 'default',
    }
  },
  router: {
    middleware: ['auth'],
  }
})

