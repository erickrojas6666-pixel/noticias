<!-- client/src/App.vue -->
<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-links">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/favoritos" class="nav-link" v-if="authStore.isAuthenticated">
            Mis Favoritos
          </router-link>
        </div>
        
        <div class="nav-auth">
          <template v-if="authStore.isAuthenticated">
            <span class="user-email">{{ authStore.user?.email }}</span>
            <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
            <router-link to="/register" class="nav-link register-btn">Registrarse</router-link>
          </template>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f7fafc;
  color: #2d3748;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-auth {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.router-link-active {
  background: #ebf8ff;
  color: #4299e1;
}

.register-btn {
  background: #4299e1;
  color: white !important;
}

.register-btn:hover {
  background: #3182ce !important;
}

.user-email {
  color: #4a5568;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: none;
  color: #e53e3e;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fff5f5;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 640px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 10px 0;
    gap: 10px;
  }
  
  .nav-links, .nav-auth {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>