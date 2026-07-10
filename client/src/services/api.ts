// client/src/services/api.ts
export const getServerUrl = (): string => {
  // 1. Variable de entorno (prioridad máxima)
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    console.log('✅ Usando VITE_API_URL:', apiUrl);
    return apiUrl;
  }
  
  // 2. Si estamos en producción y no hay variable, usar misma URL
  if (import.meta.env.PROD) {
    console.log('✅ Usando window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // 3. Desarrollo local
  console.log('✅ Modo desarrollo, usando localhost:3000');
  return 'http://localhost:3000';
};

// Función genérica para hacer peticiones a la API
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getServerUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  console.log(`🔗 Petición a: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};