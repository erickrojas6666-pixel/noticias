<!-- client/src/views/LoginView.vue -->
<template>
  <script setup lang="ts">
// 👇 Agrega este log ANTES de usar siteKey
console.log('🔍 Variables de entorno disponibles:', import.meta.env);
console.log('🔍 VITE_RECAPTCHA_SITE_KEY:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
console.log('🔑 Site Key final:', siteKey);
</script>

  <div class="auth-container">
    <div class="auth-card">
      <h1>Iniciar Sesión</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <!-- 👇 Aquí va el componente reCAPTCHA -->
        <div class="form-group">
          <ReCaptchaV2
            ref="recaptchaRef"
            :siteKey="siteKey"
            @verify="onRecaptchaVerify"
            @expired="onRecaptchaExpired"
            @error="onRecaptchaError"
          />
        </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>

        <button type="submit" :disabled="loading || !recaptchaToken">
          {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="auth-link">
        ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import ReCaptchaV2 from '../components/ReCaptchaV2.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 👇 Tu site key (debe estar en .env)
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const recaptchaToken = ref('');
const recaptchaRef = ref<InstanceType<typeof ReCaptchaV2> | null>(null);

// Eventos del reCAPTCHA
const onRecaptchaVerify = (token: string) => {
  recaptchaToken.value = token;
  error.value = '';
};

const onRecaptchaExpired = () => {
  recaptchaToken.value = '';
  error.value = 'reCAPTCHA expirado, por favor verifica de nuevo';
};

const onRecaptchaError = () => {
  recaptchaToken.value = '';
  error.value = 'Error con reCAPTCHA, intenta de nuevo';
};

const handleLogin = async () => {
  if (!recaptchaToken.value) {
    error.value = 'Por favor, completa el reCAPTCHA';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.login(email.value, password.value, recaptchaToken.value);

    if (result.success) {
      const redirect = route.query.redirect as string || '/';
      router.push(redirect);
    } else {
      error.value = result.message || 'Error al iniciar sesión';
      // Resetear reCAPTCHA
      recaptchaRef.value?.resetWidget();
      recaptchaToken.value = '';
    }
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión';
    recaptchaRef.value?.resetWidget();
    recaptchaToken.value = '';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background: #f7fafc;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #4a5568;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.error-message {
  color: #e53e3e;
  background: #fff5f5;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

button {
  width: 100%;
  padding: 12px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #3182ce;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #4a5568;
}

.auth-link a {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>