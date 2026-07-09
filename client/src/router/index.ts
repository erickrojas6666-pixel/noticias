import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '/src/views/HomeView.vue';
import FavoritosView from '/src/views/FavoritosView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritosView
    }
  ]
});

export default router;