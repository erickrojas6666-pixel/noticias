// client/src/views/HomeView.vue
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
    
    // 👇 VERIFICA QUÉ TIENES
    console.log('🔍 Total de artículos:', data.articles?.length);
    console.log('🔍 Primer artículo:', data.articles?.[0]);
    
    // Verifica qué artículos tienen title y url
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