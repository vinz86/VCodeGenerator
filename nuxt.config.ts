// https://nuxt.com/docs/api/configuration/nuxt-config
import  Aura from '@primevue/themes/aura'
import Lara from '@primevue/themes/lara'
import Nora from '@primevue/themes/nora'

export default defineNuxtConfig({
  app: {
    baseURL: '/vcodegenerator/'
  },
  ssr: false,
  components: true,
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@pinia/nuxt', "@nuxt/eslint"],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Lara,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark', // system || classe da applicare al body
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
    options: {
      hashMode: true
    }
  },
  nitro: {
    devProxy: {
      '/vcodegenerator/api/': {
        target: 'http://localhost:8080/api/',
        changeOrigin: true,
        pathRewrite: { '^/vcodegenerator/': '' },
      },
    },
  },
})