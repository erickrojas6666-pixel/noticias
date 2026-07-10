// client/src/services/api.ts

// 1. Función para obtener la URL base del servidor
export const getServerUrl = (): string => {
  // Prioridad 1: Variable de entorno específica para producción
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    console.log('✅ Usando VITE_API_URL:', apiUrl);
    return apiUrl;
  }
  
  // Prioridad 2: Si estamos en producción y no hay variable, usar la misma URL del frontend
  if (import.meta.env.PROD) {
    console.log('✅ Usando window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // Prioridad 3: Desarrollo local
  console.log('✅ Modo desarrollo, usando localhost:3000');
  return 'http://localhost:3000';
};

// 2. Función genérica para hacer peticiones a la API (¡EXPORTADA!)
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getServerUrl();
  // Asegura que el endpoint tenga una barra al inicio
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