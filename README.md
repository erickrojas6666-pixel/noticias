# Noticias App

Aplicación web de noticias con autenticación JWT, favoritos y reCAPTCHA v2.

## 🚀 Tecnologías

- **Frontend:** Vue 3, TypeScript, Vite, Pinia, Vue Router
- **Backend:** Node.js, Express, PostgreSQL, JWT
- **Seguridad:** bcryptjs, helmet, rate-limit, reCAPTCHA v2
- **Despliegue:** Render (Static Site + Web Service)
- **Contenerización:** Docker, Docker Compose

## 📦 Estructura del proyecto

noticias/
├── client/ # Frontend Vue.js
│ ├── src/
│ │ ├── views/ # Login, Register, Home, Favoritos
│ │ ├── stores/ # Pinia (auth, noticias)
│ │ ├── services/ # API client
│ │ └── components/ # ReCaptchaV2, NoticiaCard
│ └── .env.production
├── server/ # Backend Node.js
│ ├── config/ # database.js
│ ├── models/ # User.js, Favorite.js
│ ├── routes/ # authRoutes.js, favoriteRoutes.js
│ └── middleware/ # auth.js
└── docker-compose.yml


## 🔧 Instalación

### 1. Clonar el repositorio
git clone https://github.com/erickrojas6666-pixel/noticias.git
cd noticias