<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NoticiaCard from '../components/NoticiaCard.vue';
import type { Noticia } from '../stores/noticiasStore';

const noticias = ref<Noticia[]>([]);
const cargando = ref(true);
const error = ref<string | null>(null);

// 🔥 FUNCIÓN MEJORADA con múltiples estrategias
const getServerUrl = (): string => {
  // 1. Si estamos en producción (Render)
  if (import.meta.env.PROD) {
    // Prioridad 1: Variable de entorno específica
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      console.log('✅ Usando VITE_API_URL:', apiUrl);
      return apiUrl;
    }
    
    // Prioridad 2: Misma URL del frontend (si están juntos)
    console.log('✅ Usando window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // 2. Si estamos en desarrollo (local)
  console.log('✅ Modo desarrollo, usando localhost:3000');
  return 'http://localhost:3000';
};

// 🔥 Función con reintentos automáticos
const cargarNoticiasConReintento = async (intentos = 3) => {
  for (let i = 0; i < intentos; i++) {
    try {
      await cargarNoticias();
      return; // Si funciona, salimos
    } catch (err) {
      console.log(`⚠️ Intento ${i + 1} fallido, reintentando...`);
      if (i === intentos - 1) {
        throw err; // Si es el último intento, lanzamos el error
      }
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const cargarNoticias = async () => {
  cargando.value = true;
  error.value = null;
  
  try {
    const baseUrl = getServerUrl();
    const apiUrl = `${baseUrl}/api/noticias`;
    
    console.log('🔗 Conectando a:', apiUrl);
    console.log('🌍 Modo:', import.meta.env.MODE);
    console.log('🔄 Variables de entorno:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV
    });
    
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
    
    // Mostrar más información para debugging
    if (err.message.includes('Failed to fetch')) {
      error.value = '❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }
  } finally {
    cargando.value = false;
  }
};

// Cargar noticias al montar el componente
onMounted(() => {
  // Usar la versión con reintentos
  cargarNoticiasConReintento(3).catch(err => {
    console.error('❌ Todos los intentos fallaron:', err);
  });
});
</script>