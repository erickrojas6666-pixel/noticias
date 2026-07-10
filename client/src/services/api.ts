// client/src/services/api.ts

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

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getServerUrl();
  const url = `${baseUrl}/api/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  
  console.log(`🔗 Petición a: ${url}`);
  
  const token = localStorage.getItem('token');
  
  // ✅ Usar Record<string, string> para headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Combinar headers de options
  if (options.headers) {
    const optionsHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optionsHeaders);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};