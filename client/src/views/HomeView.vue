// client/src/views/HomeView.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NoticiaCard from '../components/NoticiaCard.vue';
import type { Noticia } from '../stores/noticiasStore';
import { getServerUrl, apiFetch } from '../services/api';  // 👈 IMPORTAR

const noticias = ref<Noticia[]>([]);
const cargando = ref(true);
const error = ref<string | null>(null);

const cargarNoticias = async () => {
  cargando.value = true;
  error.value = null;
  
  try {
    // Usar la función importada
    const data = await apiFetch('api/noticias');
    
    console.log('📰 Noticias recibidas:', data);
    
    if (data && data.articles && Array.isArray(data.articles)) {
      noticias.value = data.articles.filter(
        (article: any) => article.title && article.url
      );
      
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