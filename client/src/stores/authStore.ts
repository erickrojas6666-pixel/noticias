// client/src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiFetch } from '../services/api';

interface User {
  id: number;
  email: string;
  created_at: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Registrar usuario
  async function register(email: string, password: string, recaptchaToken: string) {
    loading.value = true;
    try {
      const data = await apiFetch('auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, recaptchaToken })
      });

      if (data.success) {
        setAuth(data.token, data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Error al registrar usuario' 
      };
    } finally {
      loading.value = false;
    }
  }

  // Iniciar sesión
  async function login(email: string, password: string, recaptchaToken: string) {
    loading.value = true;
    try {
      const data = await apiFetch('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, recaptchaToken })
      });

      if (data.success) {
        setAuth(data.token, data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      loading.value = false;
    }
  }

  // Cerrar sesión
  function logout() {
    localStorage.removeItem('token');
    token.value = null;
    user.value = null;
  }

  // Establecer autenticación
  function setAuth(newToken: string, userData: User) {
    token.value = newToken;
    user.value = userData;
    localStorage.setItem('token', newToken);
  }

  // Verificar token al cargar la app
  async function checkAuth() {
    if (!token.value) return;

    try {
      const data = await apiFetch('auth/profile', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });

      if (data.success) {
        user.value = data.user;
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
    setAuth
  };
});