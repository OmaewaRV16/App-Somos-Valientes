const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');

// CREAR NOTICIA
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, imagen, link } = req.body;

    if (!titulo || !descripcion || !imagen || !link) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevaNoticia = new Noticia({
      titulo,
      descripcion,
      imagen,
      link,
    });

    await nuevaNoticia.save();

    res.status(201).json(nuevaNoticia);
  } catch (error) {
    console.error('Error creando noticia:', error);
    res.status(500).json({ message: 'Error al crear noticia' });
  }
});

// OBTENER NOTICIAS
router.get('/', async (req, res) => {
  try {
    const noticias = await Noticia.find().sort({ createdAt: -1 });
    res.json(noticias);
  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    res.status(500).json({ message: 'Error al obtener noticias' });
  }
});

module.exports = router;