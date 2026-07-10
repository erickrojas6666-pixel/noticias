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