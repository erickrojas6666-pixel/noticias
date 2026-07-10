export const getServerUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    console.log('✅ Usando VITE_API_URL:', apiUrl);
    return apiUrl;
  }
  
  if (import.meta.env.PROD) {
    console.log('✅ Usando window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  console.log('✅ Modo desarrollo, usando localhost:3000');
  return 'http://localhost:3000';
};

// Función genérica para peticiones a la API
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getServerUrl();
  const url = `${baseUrl}/api/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  
  console.log(`🔗 Petición a: ${url}`);
  
  // Obtener token del localStorage si existe
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Si hay token, añadir al header Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    ...options
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};