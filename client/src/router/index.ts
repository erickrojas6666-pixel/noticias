// client/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FavoritosView from '../views/FavoritosView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuthStore } from '../stores/authStore';

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
      component: FavoritosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    }
  ]
});

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Verificar autenticación si hay token
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    await authStore.checkAuth();
  }

  // Redirigir si requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  // Redirigir si es solo para invitados y ya está autenticado
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router;