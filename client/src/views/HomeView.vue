<template>
  <div>
    <h1>Inicio</h1>
    
    <!-- Depuración -->
    <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border: 1px solid #ccc; font-family: monospace; font-size: 12px;">
      <strong>🔧 Debug:</strong> 
      Cargando: {{ cargando }} | 
      Error: {{ error }} | 
      Noticias: {{ noticias.length }}
      <span v-if="noticias.length > 0" style="color: green;"> ✅ Hay noticias</span>
    </div>
    
    <div v-if="cargando" style="text-align: center; padding: 20px;">
      ⏳ Cargando noticias...
    </div>
    
    <div v-else-if="error" style="color: red; padding: 20px; text-align: center;">
      ❌ {{ error }}
    </div>
    
    <div v-else-if="noticias.length === 0" style="text-align: center; padding: 20px; color: #666;">
      📭 No hay noticias disponibles
    </div>
    
    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px;">
      <NoticiaCard 
        v-for="noticia in noticias" 
        :key="noticia.url" 
        :noticia="noticia" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NoticiaCard from '../components/NoticiaCard.vue';
import type { Noticia } from '../stores/noticiasStore';
import { getServerUrl, apiFetch } from '../services/api';

const noticias = ref<Noticia[]>([]);
const cargando = ref(true);
const error = ref<string | null>(null);

const cargarNoticias = async () => {
  cargando.value = true;
  error.value = null;
  
  try {
    const baseUrl = getServerUrl();
    const apiUrl = `${baseUrl}/api/noticias`;
    
    console.log('🔗 Petición a:', apiUrl);
    
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('📰 Datos completos:', data);
    console.log('🔍 Total de artículos:', data.articles?.length);
    console.log('🔍 Primer artículo:', data.articles?.[0]);
    
    if (data && data.articles && Array.isArray(data.articles)) {
      const articulosFiltrados = data.articles.filter(
        (article: any) => {
          const tieneTitle = !!article.title;
          const tieneUrl = !!article.url;
          console.log(`📌 Artículo: ${article.title?.substring(0, 20) || 'sin título'} - Title: ${tieneTitle}, URL: ${tieneUrl}`);
          return tieneTitle && tieneUrl;
        }
      );
      
      console.log('✅ Artículos después del filtro:', articulosFiltrados.length);
      
      noticias.value = articulosFiltrados;
      
      if (noticias.value.length === 0) {
        error.value = 'No se encontraron noticias con información válida';
      }
    } else {
      throw new Error('Formato de datos inválido');
    }
  } catch (err: any) {
    console.error('❌ Error al cargar noticias:', err);
    error.value = `Error: ${err.message || 'Error al conectar con el servidor'}`;
  } finally {
    cargando.value = false;
  }
};

// Con reintentos
const cargarNoticiasConReintento = async (intentos = 3) => {
  for (let i = 0; i < intentos; i++) {
    try {
      await cargarNoticias();
      return;
    } catch (err) {
      console.log(`⚠️ Intento ${i + 1} fallido, reintentando...`);
      if (i === intentos - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

onMounted(() => {
  cargarNoticiasConReintento(3).catch(err => {
    console.error('❌ Todos los intentos fallaron:', err);
  });
});
</script>

<style scoped>
h1 {
  text-align: center;
  color: #2d3748;
  margin: 20px 0;
}
</style>