import './style.css';
import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);

app.use(router);

app.mount("#app");

const loader = document.getElementById("loader");
if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.remove();
    }, 300);
}