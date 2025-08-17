import './shared/styles/main.css';
import { createApp, ComponentPublicInstance } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';

async function setAppVue(): Promise<ComponentPublicInstance> {
  const pinia = createPinia();

  pinia.use(piniaPluginPersistedstate);

  const app = createApp(App);

  app.use(pinia);

  app.use(router);

  await router.isReady();

  return app.mount('#app');
}

await setAppVue();
