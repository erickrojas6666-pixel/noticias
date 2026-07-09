import { defineStore } from 'pinia';

// Definir interfaz para las noticias
export interface Noticia {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NoticiasState {
  favoritos: Noticia[];
  loading: boolean;
  error: string | null;
}

export const useNoticiasStore = defineStore('noticias', {
  state: (): NoticiasState => ({
    favoritos: [],
    loading: false,
    error: null
  }),
  
  getters: {
    // Verificar si una noticia está en favoritos
    esFavorito: (state) => (url: string) => {
      return state.favoritos.some(n => n.url === url);
    },
    
    // Contar favoritos
    totalFavoritos: (state) => state.favoritos.length
  },
  
  actions: {
    // Cargar favoritos desde localStorage al iniciar
    cargarFavoritos() {
      try {
        const saved = localStorage.getItem('noticias_favoritos');
        if (saved) {
          this.favoritos = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    },
    
    // Agregar favorito con persistencia
    agregarFavorito(noticia: Noticia) {
      if (!this.favoritos.find(n => n.url === noticia.url)) {
        this.favoritos.push(noticia);
        this.guardarFavoritos();
        console.log('✅ Noticia agregada a favoritos:', noticia.title);
      } else {
        console.log('⚠️ La noticia ya está en favoritos');
      }
    },
    
    // Remover favorito con persistencia
    removerFavorito(url: string) {
      const noticiaRemovida = this.favoritos.find(n => n.url === url);
      this.favoritos = this.favoritos.filter(n => n.url !== url);
      this.guardarFavoritos();
      console.log('🗑️ Noticia removida de favoritos:', noticiaRemovida?.title);
    },
    
    // Guardar favoritos en localStorage
    guardarFavoritos() {
      try {
        localStorage.setItem('noticias_favoritos', JSON.stringify(this.favoritos));
      } catch (error) {
        console.error('Error al guardar favoritos:', error);
      }
    },
    
    // Limpiar todos los favoritos
    limpiarFavoritos() {
      this.favoritos = [];
      this.guardarFavoritos();
      console.log('🧹 Favoritos limpiados');
    },
    
    // Alternar favorito (útil para botones toggle)
    toggleFavorito(noticia: Noticia) {
      if (this.esFavorito(noticia.url)) {
        this.removerFavorito(noticia.url);
        return false; // Ya no es favorito
      } else {
        this.agregarFavorito(noticia);
        return true; // Es favorito
      }
    }
  }
});