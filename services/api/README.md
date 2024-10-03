Ricordarsi di creare il plugin per registrare i servizi e aggiungere le Keys in ApiKeys.ts

```vue
export default defineNuxtPlugin(nuxtApp => {
    ApiInit.getInstance(EApiHttpClientType.AsyncData, 10000, EApiAuthType.LOCALSTORAGE);
});
```