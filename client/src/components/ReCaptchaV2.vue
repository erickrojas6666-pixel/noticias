<!-- ===================================================== -->
<!-- COMPONENTE DE RECAPTCHA V2 - VUE 3                    -->
<!-- ===================================================== -->
<!-- Este componente renderiza el widget de Google reCAPTCHA -->
<!-- v2 y maneja su ciclo de vida: carga, renderizado,    -->
<!-- verificación y limpieza.                             -->
<!-- ===================================================== -->

<template>
  <!-- Contenedor donde se renderizará el widget de reCAPTCHA -->
  <!-- reCAPTCHA inyecta su propio HTML dentro de este div -->
  <div ref="recaptchaContainer"></div>
</template>

<script setup lang="ts">
// ================================================================
// IMPORTACIONES
// ================================================================
import { ref, onMounted, onBeforeUnmount } from 'vue';
// ref: Para crear referencias reactivas
// onMounted: Ejecutar código cuando el componente se monta
// onBeforeUnmount: Limpiar recursos antes de destruir el componente

// ================================================================
// PROPS (Propiedades que recibe el componente)
// ================================================================
// siteKey: La clave pública proporcionada por Google reCAPTCHA
// Esta clave identifica tu sitio web ante el servicio de Google
const props = defineProps<{
  siteKey: string;
}>();

// ================================================================
// EVENTOS (Eventos que emite el componente)
// ================================================================
// verify: Se emite cuando el usuario pasa la verificación
// expired: Se emite cuando el token de verificación expira
// error: Se emite cuando ocurre un error en el proceso
const emit = defineEmits<{
  (e: 'verify', token: string): void;
  (e: 'expired'): void;
  (e: 'error'): void;
}>();

// ================================================================
// ESTADO INTERNO
// ================================================================

// Referencia al contenedor del DOM donde se renderizará el widget
// Almacena la referencia al elemento HTML <div> del template
const recaptchaContainer = ref<HTMLElement | null>(null);

// ID del widget de reCAPTCHA
// Google asigna un ID único a cada widget renderizado
// Este ID se usa para resetear el widget cuando sea necesario
let widgetId: number | null = null;

// ================================================================
// FUNCIONES PRIVADAS
// ================================================================

/**
 * Carga el script de Google reCAPTCHA de forma dinámica
 * Retorna una promesa que se resuelve cuando el script está cargado
 * 
 * Estrategia de carga:
 * 1. Verificar si ya está cargado (window.grecaptcha)
 * 2. Si no, crear un <script> y añadirlo al <head>
 * 3. Usar el callback 'onRecaptchaLoaded' para saber cuando está listo
 * 
 * @returns {Promise<void>} Promesa que se resuelve al cargar el script
 */
const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, resolver inmediatamente
    if (typeof window.grecaptcha !== 'undefined') {
      resolve();
      return;
    }

    // Crear el elemento <script>
    const script = document.createElement('script');
    
    // URL del script de reCAPTCHA con parámetros:
    // - onload: Función a ejecutar cuando el script cargue
    // - render: 'explicit' para control manual del renderizado
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
    script.async = true;  // No bloquea la carga de la página
    script.defer = true;  // Ejecuta después de que la página esté lista

    // Función global que Google llamará cuando el script esté listo
    window.onRecaptchaLoaded = () => {
      resolve(); // Resuelve la promesa indicando que el script cargó
    };

    // Manejo de errores al cargar el script
    script.onerror = () => {
      reject(new Error('Error al cargar el script de reCAPTCHA'));
    };

    // Añadir el script al <head> del documento
    document.head.appendChild(script);
  });
};

/**
 * Renderiza el widget de reCAPTCHA en el contenedor
 * 
 * Pasos:
 * 1. Validar que el contenedor existe y el objeto grecaptcha está disponible
 * 2. Limpiar el contenedor si ya tiene contenido
 * 3. Crear un div para que Google reCAPTCHA lo use
 * 4. Llamar a window.grecaptcha.render con la configuración
 */
const renderWidget = () => {
  // Verificar que todo está listo para renderizar
  if (!recaptchaContainer.value || !window.grecaptcha) return;

  const container = recaptchaContainer.value;

  // Limpiar el contenedor para evitar duplicados
  // Útil cuando el componente se monta/desmonta repetidamente
  if (container.hasChildNodes()) {
    container.innerHTML = '';
  }

  // Crear el div que Google reCAPTCHA necesita
  // Google inyecta su contenido dentro de este div
  const widgetDiv = document.createElement('div');
  container.appendChild(widgetDiv);

  // Renderizar el widget de reCAPTCHA
  // window.grecaptcha.render() devuelve un ID único para este widget
  widgetId = window.grecaptcha.render(widgetDiv, {
    // La Site Key pública proporcionada por Google
    sitekey: props.siteKey,
    
    // Callback cuando el usuario completa el desafío
    // Recibe el token que debe enviarse al backend
    callback: (token: string) => {
      emit('verify', token);
    },
    
    // Callback cuando el token expira
    // El usuario debe verificar nuevamente
    'expired-callback': () => {
      emit('expired');
    },
    
    // Callback cuando ocurre un error en el widget
    'error-callback': () => {
      emit('error');
    },
  });
};

/**
 * Inicializa el reCAPTCHA cargando el script y renderizando el widget
 * Orquesta el proceso completo de inicialización
 */
const initializeRecaptcha = async () => {
  try {
    // 1. Cargar el script de Google
    await loadRecaptchaScript();
    
    // 2. Renderizar el widget
    renderWidget();
  } catch (error) {
    // Si falla la carga o el renderizado, emitir error
    console.error('Error al inicializar reCAPTCHA:', error);
    emit('error');
  }
};

// ================================================================
// FUNCIONES PÚBLICAS (expuestas al componente padre)
// ================================================================

/**
 * Resetear el widget de reCAPTCHA
 * Útil cuando el formulario falla y el usuario debe intentar nuevamente
 * El padre puede llamar a esta función usando una referencia al componente
 * 
 * Ejemplo de uso en componente padre:
 * recaptchaRef.value?.resetWidget();
 */
const resetWidget = () => {
  if (widgetId !== null && window.grecaptcha) {
    window.grecaptcha.reset(widgetId);
  }
};

// Exponer funciones públicas al componente padre
// Permite que el padre use: recaptchaRef.value?.resetWidget()
defineExpose({
  resetWidget,
});

// ================================================================
// CICLO DE VIDA DEL COMPONENTE
// ================================================================

/**
 * onMounted - Se ejecuta cuando el componente se monta en el DOM
 * 
 * Pasos:
 * 1. Verificar que la siteKey esté definida (obligatoria)
 * 2. Esperar 100ms para asegurar que el DOM está listo
 * 3. Inicializar reCAPTCHA
 * 
 * El setTimeout es necesario porque el DOM puede no estar
 * completamente renderizado cuando se ejecuta onMounted
 */
onMounted(() => {
  // Validación de prop obligatoria
  if (!props.siteKey) {
    console.error('❌ ReCaptchaV2: siteKey no definida');
    emit('error');
    return;
  }
  
  // Esperar un tick para asegurar que el DOM esté listo
  // 100ms es suficiente para que Vue termine de renderizar
  setTimeout(() => {
    initializeRecaptcha();
  }, 100);
});

/**
 * onBeforeUnmount - Limpieza antes de destruir el componente
 * 
 * Buenas prácticas de limpieza:
 * 1. Resetear el widget para liberar recursos de Google
 * 2. Eliminar la función global para evitar memory leaks
 */
onBeforeUnmount(() => {
  // Resetear el widget si existe
  if (widgetId !== null && window.grecaptcha) {
    try {
      window.grecaptcha.reset(widgetId);
    } catch (e) {
      // Ignorar errores de limpieza (no críticos)
    }
  }
  
  // Limpiar la función global para evitar memory leaks
  // Si no se limpia, podría causar comportamientos inesperados
  // al montar/desmontar el componente repetidamente
  if (window.onRecaptchaLoaded) {
    delete window.onRecaptchaLoaded;
  }
});
</script>

<style scoped>
/* ================================================================ */
/* ESTILOS DEL COMPONENTE                                          */
/* ================================================================ */
/* scoped: Los estilos solo afectan a este componente              */
/* ================================================================ */

.recaptcha-wrapper {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  min-height: 78px; /* Altura mínima para evitar saltos visuales */
}
</style>