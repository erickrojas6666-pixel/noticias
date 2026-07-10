<!-- client/src/components/ReCaptchaV2.vue -->
<template>
  <div ref="recaptchaContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue';

// Definir props
const props = defineProps<{
  siteKey: string; // La Site Key de reCAPTCHA
}>();

// Definir eventos
const emit = defineEmits<{
  (e: 'verify', token: string): void;
  (e: 'expired'): void;
  (e: 'error'): void;
}>();

// Referencia al contenedor donde se renderizará el widget
const recaptchaContainer = ref<HTMLElement | null>(null);
let widgetId: number | null = null;

// Cargar el script de Google reCAPTCHA
const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.grecaptcha !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
    script.async = true;
    script.defer = true;

    // Definir la función global que se ejecutará cuando el script cargue
    window.onRecaptchaLoaded = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Error al cargar el script de reCAPTCHA'));
    };

    document.head.appendChild(script);
  });
};

// Renderizar el widget de reCAPTCHA
const renderWidget = () => {
  if (!recaptchaContainer.value || !window.grecaptcha) return;

  const container = recaptchaContainer.value;

  // Verificar si ya hay un widget renderizado en este contenedor
  if (container.hasChildNodes()) {
    container.innerHTML = '';
  }

  // Crear el div que Google reCAPTCHA necesita
  const widgetDiv = document.createElement('div');
  container.appendChild(widgetDiv);

  // Renderizar el widget
  widgetId = window.grecaptcha.render(widgetDiv, {
    sitekey: props.siteKey,
    callback: (token: string) => {
      emit('verify', token);
    },
    'expired-callback': () => {
      emit('expired');
    },
    'error-callback': () => {
      emit('error');
    },
  });
};

// Inicializar reCAPTCHA
const initializeRecaptcha = async () => {
  try {
    await loadRecaptchaScript();
    renderWidget();
  } catch (error) {
    console.error('Error al inicializar reCAPTCHA:', error);
    emit('error');
  }
};

// Resetear el widget
const resetWidget = () => {
  if (widgetId !== null && window.grecaptcha) {
    window.grecaptcha.reset(widgetId);
  }
};

// Exponer el método reset para usar desde el componente padre
defineExpose({
  resetWidget,
});

// Ejecutar al montar el componente
onMounted(() => {
  // Esperar un tick para asegurar que el DOM esté listo
  setTimeout(() => {
    initializeRecaptcha();
  }, 100);
});

// Limpiar al desmontar
onBeforeUnmount(() => {
  if (widgetId !== null && window.grecaptcha) {
    try {
      window.grecaptcha.reset(widgetId);
    } catch (e) {
      // Ignorar errores de limpieza
    }
  }
  // Limpiar la función global si es necesario
  if (window.onRecaptchaLoaded) {
    delete window.onRecaptchaLoaded;
  }
});
</script>

<style scoped>
/* Estilo para el contenedor */
.recaptcha-wrapper {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  min-height: 78px;
}
</style>