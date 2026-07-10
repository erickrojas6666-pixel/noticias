// server/routes/favoriteRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import Favorite from '../models/Favorite.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.findByUser(req.user.id);
    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener favoritos' 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { noticia } = req.body;
    
    if (!noticia || !noticia.url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Datos de noticia incompletos' 
      });
    }

    const exists = await Favorite.exists(req.user.id, noticia.url);
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: 'La noticia ya está en favoritos' 
      });
    }

    const favorite = await Favorite.create(req.user.id, noticia);
    res.status(201).json({
      success: true,
      favorite
    });
  } catch (error) {
    console.error('Error agregando favorito:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al agregar favorito' 
    });
  }
});

router.delete('/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url);
    const deleted = await Favorite.delete(req.user.id, url);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Favorito no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Favorito eliminado correctamente'
    });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar favorito' 
    });
  }
});

export default router;