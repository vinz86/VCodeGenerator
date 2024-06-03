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
    'primeflex/primeflex.min.css',
    '@/assets/vendor/fontawesome/css/all.css',
  ]
})
