// client/src/stores/noticiasStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '../services/api';

export interface Noticia {
  source?: {
    id?: string | null;
    name: string;
  };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string;
  content?: string | null;
}

export const useNoticiasStore = defineStore('noticias', () => {
  const favoritos = ref<Noticia[]>([]);
  const loadingFavoritos = ref(false);

  // Cargar favoritos desde el backend
  async function cargarFavoritos() {
    loadingFavoritos.value = true;
    try {
      const data = await apiFetch('favoritos');
      if (data.success) {
        favoritos.value = data.favorites || [];
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      favoritos.value = [];
    } finally {
      loadingFavoritos.value = false;
    }
  }

  // Agregar favorito al backend
  async function agregarFavorito(noticia: Noticia) {
    try {
      const data = await apiFetch('favoritos', {
        method: 'POST',
        body: JSON.stringify({ noticia })
      });
      
      if (data.success) {
        favoritos.value.push(noticia);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      console.error('Error al agregar favorito:', error);
      return { success: false, message: error.message };
    }
  }

  // Eliminar favorito del backend
  async function eliminarFavorito(url: string) {
    try {
      const data = await apiFetch(`favoritos/${encodeURIComponent(url)}`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        favoritos.value = favoritos.value.filter(fav => fav.url !== url);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error: any) {
      console.error('Error al eliminar favorito:', error);
      return { success: false, message: error.message };
    }
  }

  // Verificar si es favorito
  function esFavorito(url: string): boolean {
    return favoritos.value.some(fav => fav.url === url);
  }

  // Alternar favorito
  async function toggleFavorito(noticia: Noticia) {
    if (esFavorito(noticia.url)) {
      return await eliminarFavorito(noticia.url);
    } else {
      return await agregarFavorito(noticia);
    }
  }

  return {
    favoritos,
    loadingFavoritos,
    cargarFavoritos,
    agregarFavorito,
    eliminarFavorito,
    esFavorito,
    toggleFavorito
  };
});