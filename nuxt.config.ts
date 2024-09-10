// https://nuxt.com/docs/api/configuration/nuxt-config
import  Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  ssr: false,
  components: true,
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module'
  ],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark', //system
        }
      }
    }
  },
  css: [
    '@/assets/theme_override.css',
    'primeflex/primeflex.min.css',
    'primeicons/primeicons.css',
    '@/assets/vendor/fontawesome/css/all.css',
    '@/assets/style.css',
  ],
  runtimeConfig: {
    public: {
      clientConfig: 'VCodeGenerator' || process.env.CLIENT_ID || 'default',
      environment: 'development',
      mainAppVersion: '1.0.0'
    }
  },
  router: {
    middleware: ['auth'],
  }
})

