const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para probar que el servidor funciona
app.get('/api/noticias', async (req, res) => {
    try {
        // Aquí consumirás la API de terceros (NewsAPI)
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener noticias' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));