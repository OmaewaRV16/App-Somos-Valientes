const express = require("express");
const router = express.Router();
const Comentario = require("../models/Comentario"); // Asegúrate de tener el modelo creado

// GET /api/comentarios → obtener todos los comentarios
router.get("/", async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fecha: -1 });
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
});

// POST /api/comentarios → crear un comentario
router.post("/", async (req, res) => {
  const { usuario, mensaje } = req.body;
  if (!usuario || !mensaje) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const nuevoComentario = new Comentario({
      usuario,
      mensaje,
      fecha: new Date(),
    });
    await nuevoComentario.save();
    res.status(201).json({ message: "Comentario enviado correctamente", comentario: nuevoComentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar comentario" });
  }
});

// DELETE /api/comentarios/:id → eliminar un comentario
router.delete("/:id", async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) return res.status(404).json({ message: "Comentario no encontrado" });

    // Forma correcta en Mongoose moderno
    await Comentario.deleteOne({ _id: req.params.id });

    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar comentario" });
  }
});

module.exports = router;
