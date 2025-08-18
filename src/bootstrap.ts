// bootstrap.ts
import { createApp, type App as VueApp, type ComponentPublicInstance } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';

export function createVueApp(): VueApp {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);

  const app = createApp(App);
  app.use(pinia);
  app.use(router);

  return app;
}

export async function setAppVue(selector = '#app'): Promise<ComponentPublicInstance> {
  const app = createVueApp();
  await router.isReady();
  return app.mount(selector);
}
