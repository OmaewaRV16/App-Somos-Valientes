const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');

// ==========================
// CREAR NOTICIA
// ==========================
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, imagen, link } = req.body;

    if (!titulo || !descripcion || !imagen || !link) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevaNoticia = new Noticia({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      imagen: imagen.trim(),
      link: link.trim(),
    });

    await nuevaNoticia.save();

    res.status(201).json(nuevaNoticia);
  } catch (error) {
    console.error('Error creando noticia:', error);
    res.status(500).json({ message: 'Error al crear noticia' });
  }
});

// ==========================
// OBTENER TODAS
// ==========================
router.get('/', async (req, res) => {
  try {
    const noticias = await Noticia.find().sort({ createdAt: -1 });
    res.json(noticias);
  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    res.status(500).json({ message: 'Error al obtener noticias' });
  }
});

// ==========================
// OBTENER UNA POR ID
// ==========================
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    console.error('Error obteniendo noticia:', error);
    res.status(500).json({ message: 'Error al obtener noticia' });
  }
});

// ==========================
// EDITAR NOTICIA
// ==========================
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, imagen, link } = req.body;

    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      {
        titulo: titulo?.trim(),
        descripcion: descripcion?.trim(),
        imagen: imagen?.trim(),
        link: link?.trim(),
      },
      { new: true }
    );

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    console.error('Error actualizando noticia:', error);
    res.status(500).json({ message: 'Error al actualizar noticia' });
  }
});

// ==========================
// ELIMINAR NOTICIA
// ==========================
router.delete('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.json({ message: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando noticia:', error);
    res.status(500).json({ message: 'Error al eliminar noticia' });
  }
});

module.exports = router;