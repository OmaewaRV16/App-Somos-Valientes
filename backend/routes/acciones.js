const express = require("express");
const router = express.Router();
const Accion = require("../models/Accion"); // crea un modelo Accion similar a Cupon

// Obtener todas las acciones
router.get("/", async (req, res) => {
  try {
    const acciones = await Accion.find();
    res.json(acciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener acciones" });
  }
});

// Crear acción
router.post("/", async (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo || !descripcion) {
    return res.status(400).json({ message: "Faltan datos para crear la acción" });
  }

  try {
    const nuevaAccion = new Accion({ titulo, descripcion });
    await nuevaAccion.save();
    res.status(201).json(nuevaAccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear acción" });
  }
});

// Editar acción
router.put("/:id", async (req, res) => {
  const { titulo, descripcion } = req.body;
  try {
    const accion = await Accion.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion },
      { new: true }
    );
    if (!accion) return res.status(404).json({ message: "Acción no encontrada" });
    res.json(accion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar acción" });
  }
});

// Eliminar acción
router.delete("/:id", async (req, res) => {
  try {
    const accion = await Accion.findByIdAndDelete(req.params.id);
    if (!accion) return res.status(404).json({ message: "Acción no encontrada" });
    res.json({ message: "Acción eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar acción" });
  }
});

// Marcar acción como realizada
router.patch("/:id/realizar", async (req, res) => {
  const { usuario } = req.body; // celular del usuario
  try {
    const accion = await Accion.findById(req.params.id);
    if (!accion) return res.status(404).json({ message: "Acción no encontrada" });

    // Inicializa el array si no existe
    if (!accion.realizados) accion.realizados = [];

    // Evita duplicados
    if (!accion.realizados.includes(usuario)) {
      accion.realizados.push(usuario);
      await accion.save();
    }

    res.json({ message: "Acción marcada como realizada", accion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar acción" });
  }
});


module.exports = router;
