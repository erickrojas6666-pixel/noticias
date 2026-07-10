<!-- client/src/views/RegisterView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister">
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

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Repite tu contraseña"
          />
        </div>

        <!-- reCAPTCHA -->
        <div class="form-group">
          <VueRecaptcha
            ref="recaptchaRef"
            :sitekey="siteKey"
            @verify="onRecaptchaVerify"
            @expired="onRecaptchaExpired"
            @error="onRecaptchaError"
          />
        </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>

        <button type="submit" :disabled="loading || !recaptchaToken">
          {{ loading ? 'Cargando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="auth-link">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import VueRecaptcha from 'vue-recaptcha';

const router = useRouter();
const authStore = useAuthStore();

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const recaptchaToken = ref('');
const recaptchaRef = ref<InstanceType<typeof VueRecaptcha>>();

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

const handleRegister = async () => {
  if (!recaptchaToken.value) {
    error.value = 'Por favor, completa el reCAPTCHA';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.register(email.value, password.value, recaptchaToken.value);
    
    if (result.success) {
      router.push('/');
    } else {
      error.value = result.message || 'Error al registrar usuario';
      recaptchaRef.value?.reset();
      recaptchaToken.value = '';
    }
  } catch (err: any) {
    error.value = err.message || 'Error al registrar usuario';
    recaptchaRef.value?.reset();
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