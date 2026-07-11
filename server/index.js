// ============================================================
// 1. IMPORTACIONES
// ============================================================
import express from 'express';         // Framework web para Node.js
import axios from 'axios';             // Cliente HTTP para consumir APIs externas
import cors from 'cors';               // Permite peticiones desde otros dominios
import dotenv from 'dotenv';           // Carga variables de entorno desde .env
import rateLimit from 'express-rate-limit'; // Limita peticiones por IP
import helmet from 'helmet';           // Añade headers de seguridad HTTP

// Rutas propias (servicios web propios)
import authRoutes from './routes/authRoutes.js';     // Rutas de autenticación
import favoriteRoutes from './routes/favoriteRoutes.js'; // Rutas de favoritos

// ============================================================
// 2. CONFIGURACIÓN INICIAL
// ============================================================
dotenv.config(); // Cargar variables de entorno desde .env

const app = express(); // Crear instancia de Express
const PORT = process.env.PORT || 3000; // Puerto (Render asigna 10000)

// ============================================================
// 3. SEGURIDAD
// ============================================================

// 3.1 Helmet: Protege contra vulnerabilidades HTTP
// Añade headers como X-Frame-Options, X-XSS-Protection, etc.
app.use(helmet());

// 3.2 Rate Limiting: Previene ataques de fuerza bruta
// Cada IP solo puede hacer 100 peticiones cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 100, // Límite de peticiones por IP
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
  }
});
app.use('/api', limiter); // Aplica solo a rutas /api/*

// 3.3 CORS: Controla qué dominios pueden acceder a la API
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Frontend permitido (Render o local)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true // Permite enviar cookies/tokens
}));

// ============================================================
// 4. MIDDLEWARES DE PARSEO
// ============================================================
app.use(express.json()); // Convierte JSON recibido a objeto JavaScript
app.use(express.urlencoded({ extended: true })); // Convierte datos de formulario URL-encoded

// ============================================================
// 5. RUTAS (WEB SERVICES PROPIOS)
// ============================================================

// 5.1 Health Check - Verifica que el servidor esté vivo
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 5.2 Autenticación - Registro, login y perfil
// Rutas: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile
app.use('/api/auth', authRoutes);

// 5.3 Favoritos - CRUD de favoritos (requiere autenticación JWT)
// Rutas: GET /api/favoritos, POST /api/favoritos, DELETE /api/favoritos/:url
app.use('/api/favoritos', favoriteRoutes);

// 5.4 Noticias - Obtener noticias desde NewsAPI
// Endpoint: GET /api/noticias
app.get('/api/noticias', async (req, res) => {
  try {
    // Consultar NewsAPI (servicio de terceros)
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.json(response.data); // Devolver las noticias al frontend
  } catch (error) {
    console.error('Error en API de noticias:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener noticias',
      details: error.message 
    });
  }
});

// 5.5 Búsqueda de noticias
// Endpoint: GET /api/noticias/buscar?query=palabra
app.get('/api/noticias/buscar', async (req, res) => {
  const { query } = req.query; // Obtener palabra de búsqueda
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error en búsqueda:', error.message);
    res.status(500).json({ 
      error: 'Error en la búsqueda',
      details: error.message 
    });
  }
});

// ============================================================
// 6. MANEJO DE ERRORES
// ============================================================

// 6.1 Ruta 404 - Cuando la URL solicitada no existe
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// 6.2 Middleware de error global - Captura cualquier error no manejado
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.stack); // Log del error
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    // En desarrollo, muestra detalles del error para depurar
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// ============================================================
// 7. INICIO DEL SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Acceso local: http://localhost:${PORT}`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend esperado: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});