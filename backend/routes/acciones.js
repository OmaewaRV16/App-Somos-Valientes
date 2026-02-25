const express = require("express");
const router = express.Router();
const Accion = require("../models/Accion");

// ==========================
// OBTENER TODAS
// ==========================
router.get("/", async (req, res) => {
  try {
    const acciones = await Accion.find().sort({ createdAt: -1 });
    res.json(acciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener acciones" });
  }
});

// ==========================
// CREAR ACCIÓN
// ==========================
router.post("/", async (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || !descripcion) {
    return res
      .status(400)
      .json({ message: "Faltan datos para crear la acción" });
  }

  try {
    const nuevaAccion = new Accion({
      titulo,
      descripcion,
      estado: "en_curso", // 🔥 siempre inicia en curso
    });

    await nuevaAccion.save();
    res.status(201).json(nuevaAccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear acción" });
  }
});

// ==========================
// EDITAR (incluye estado)
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const accion = await Accion.findByIdAndUpdate(
      req.params.id,
      req.body, // 🔥 ahora acepta estado
      { new: true }
    );

    if (!accion)
      return res.status(404).json({ message: "Acción no encontrada" });

    res.json(accion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar acción" });
  }
});

// ==========================
// ELIMINAR
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const accion = await Accion.findByIdAndDelete(req.params.id);

    if (!accion)
      return res.status(404).json({ message: "Acción no encontrada" });

    res.json({ message: "Acción eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar acción" });
  }
});

// ==========================
// MARCAR COMO REALIZADA
// ==========================
router.patch("/:id/realizar", async (req, res) => {
  const { usuario } = req.body;

  try {
    const accion = await Accion.findById(req.params.id);
    if (!accion)
      return res.status(404).json({ message: "Acción no encontrada" });

    if (!accion.realizados.includes(usuario)) {
      accion.realizados.push(usuario);
      await accion.save();
    }

    res.json({
      message: "Acción marcada como realizada",
      accion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar acción" });
  }
});

module.exports = router;