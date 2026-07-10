// client/src/views/FavoritosView.vue
<script setup lang="ts">
import { useNoticiasStore } from '../stores/noticiasStore';
import NoticiaCard from '../components/NoticiaCard.vue';
import { apiFetch } from '../services/api';

const store = useNoticiasStore();

// Ejemplo de cómo usar el servicio
const cargarFavoritos = async () => {
  try {
    const data = await apiFetch('api/favoritos');
    // Procesar datos...
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>