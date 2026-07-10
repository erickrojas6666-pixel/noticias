import { defineStore } from 'pinia';
import { ref } from 'vue';

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

  function esFavorito(url: string): boolean {
    return favoritos.value.some(fav => fav.url === url);
  }

  function toggleFavorito(noticia: Noticia) {
    const index = favoritos.value.findIndex(fav => fav.url === noticia.url);
    if (index === -1) {
      favoritos.value.push(noticia);
    } else {
      favoritos.value.splice(index, 1);
    }
  }

  return {
    favoritos,
    esFavorito,
    toggleFavorito
  };
});