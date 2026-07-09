<template>
  <div>
    <h1>Mis Noticias Favoritas</h1>
    <div v-if="store.favoritos.length === 0">No tienes favoritos aún.</div>
    
    <NoticiaCard 
      v-for="noticia in store.favoritos" 
      :key="noticia.url" 
      :noticia="noticia" 
    />
  </div>
</template>

<script setup>
import { useNoticiasStore } from '../stores/noticiasStore';
import NoticiaCard from '../components/NoticiaCard.vue';

const store = useNoticiasStore();
</script>