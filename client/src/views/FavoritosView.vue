<template>
  <div>
    <h1>Mis Noticias Favoritas</h1>
    
    <!-- Depuración: Muestra cuántos favoritos hay -->
    <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border: 1px solid #ccc;">
      <strong>🔧 Debug:</strong> Tienes {{ store.favoritos.length }} favoritos guardados
    </div>
    
    <div v-if="store.favoritos.length === 0" style="text-align: center; padding: 40px; color: #666;">
      <p style="font-size: 1.2rem;">📭 No tienes favoritos aún</p>
      <p>Ve a la página de <router-link to="/">Inicio</router-link> y agrega algunas noticias a favoritos.</p>
    </div>
    
    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px;">
      <NoticiaCard 
        v-for="noticia in store.favoritos" 
        :key="noticia.url" 
        :noticia="noticia" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoticiasStore } from '../stores/noticiasStore';
import NoticiaCard from '../components/NoticiaCard.vue';

const store = useNoticiasStore();

// Log para depuración
console.log('📊 Favoritos cargados:', store.favoritos.length);
</script>

<style scoped>
h1 {
  text-align: center;
  color: #2d3748;
  margin: 20px 0;
}
</style>