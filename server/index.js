const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración CORS más permisiva para desarrollo
app.use(cors({
  origin: '*', // En desarrollo, permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Endpoint para obtener noticias
app.get('/api/noticias', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error en API de noticias:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener noticias',
      details: error.message 
    });
  }
});

// Endpoint para búsqueda de noticias (opcional)
app.get('/api/noticias/buscar', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Acceso local: http://localhost:${PORT}`);
});