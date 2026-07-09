<template>
  <div class="card" :class="{ 'favorito': esFavorito }">
    <!-- Imagen si existe -->
    <div v-if="noticia.urlToImage" class="card-image">
      <img :src="noticia.urlToImage" :alt="noticia.title" loading="lazy" @error="handleImageError">
    </div>
    
    <div class="card-content">
      <h3>{{ noticia.title }}</h3>
      <p v-if="noticia.description" class="description">{{ noticia.description }}</p>
      
      <div class="card-footer">
        <button 
          @click="toggleFavorito" 
          class="favorito-btn"
          :class="{ 'activo': esFavorito }"
        >
          {{ esFavorito ? '❤️ Quitar de Favoritos' : '🤍 Añadir a Favoritos' }}
        </button>
        
        <a :href="noticia.url" target="_blank" rel="noopener noreferrer" class="leer-mas">
          Leer más →
        </a>
      </div>
      
      <div v-if="noticia.source?.name" class="source">
        📰 {{ noticia.source.name }}
        <span class="fecha" v-if="noticia.publishedAt">
          • {{ formatDate(noticia.publishedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNoticiasStore } from '../stores/noticiasStore';
import type { Noticia } from '../stores/noticiasStore';

const props = defineProps<{
  noticia: Noticia;
}>();

const store = useNoticiasStore();

// Computed para verificar si es favorito
const esFavorito = computed(() => store.esFavorito(props.noticia.url));

// Función para alternar favorito
const toggleFavorito = () => {
  store.toggleFavorito(props.noticia);
};

// Manejar error de imagen
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

// Formatear fecha
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card.favorito {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #2d3748;
}

.description {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 15px 0;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 10px;
  flex-wrap: wrap;
}

.favorito-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.favorito-btn:hover {
  background: #f7fafc;
  transform: scale(1.02);
}

.favorito-btn.activo {
  border-color: #ff6b6b;
  background: #fff5f5;
  color: #e53e3e;
}

.favorito-btn.activo:hover {
  background: #ffebeb;
}

.leer-mas {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.leer-mas:hover {
  color: #3182ce;
  text-decoration: underline;
}

.source {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #718096;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.fecha {
  color: #a0aec0;
}

/* Responsive */
@media (max-width: 640px) {
  .card-image {
    height: 150px;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .favorito-btn {
    width: 100%;
    text-align: center;
  }
}
</style>