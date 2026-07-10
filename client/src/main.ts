// client/src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Cargar autenticación al iniciar
import { useAuthStore } from './stores/authStore';
const authStore = useAuthStore();
authStore.checkAuth();

app.mount('#app');