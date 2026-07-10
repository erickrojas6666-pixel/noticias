// server/index.js - VERSIÓN CON ES MODULES
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Importar rutas (usando import)
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== SEGURIDAD ==========
app.use(helmet());

// Rate limiting (previene ataques de fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por IP
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
  }
});
app.use('/api', limiter);

// ========== CORS ==========
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== RUTAS ==========

// 1. Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Autenticación
app.use('/api/auth', authRoutes);

// 3. Favoritos - protege con autenticación
app.use('/api/favoritos', favoriteRoutes);

// 4. Noticias (tu código existente)
app.get('/api/noticias', async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error en API de noticias:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener noticias',
      details: error.message 
    });
  }
});

// 5. Búsqueda de noticias
app.get('/api/noticias/buscar', async (req, res) => {
  const { query } = req.query;
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

// ========== MANEJO DE ERRORES ==========

// Ruta 404 - No encontrada
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Middleware de error global
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// ========== INICIO DEL SERVIDOR ==========
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Acceso local: http://localhost:${PORT}`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend esperado: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});