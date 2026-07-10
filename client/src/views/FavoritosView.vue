<!-- client/src/views/FavoritosView.vue -->
<template>
  <div>
    <h1>Mis Noticias Favoritas</h1>
    
    <div v-if="store.loadingFavoritos" style="text-align: center; padding: 40px;">
      ⏳ Cargando favoritos...
    </div>
    
    <div v-else-if="store.favoritos.length === 0" style="text-align: center; padding: 40px; color: #666;">
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
import { onMounted } from 'vue';
import { useNoticiasStore } from '../stores/noticiasStore';
import NoticiaCard from '../components/NoticiaCard.vue';

const store = useNoticiasStore();

onMounted(() => {
  store.cargarFavoritos();
});
</script>

<style scoped>
h1 {
  text-align: center;
  color: #2d3748;
  margin: 20px 0;
}
</style>