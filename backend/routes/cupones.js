const express = require("express");
const router = express.Router();
const Cupon = require("../models/Cupon");

// =========================
// OBTENER CUPONES
// =========================
router.get("/", async (req, res) => {
  try {
    const cupones = await Cupon.find();
    res.json(cupones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cupones" });
  }
});

// =========================
// CREAR CUPÓN ✅ (CON LOGO)
// =========================
router.post("/", async (req, res) => {
  const { nombre, descripcion, codigo, logo } = req.body;

  if (!nombre || !descripcion || !codigo) {
    return res.status(400).json({ message: "Faltan datos para crear el cupón" });
  }

  try {
    const nuevoCupon = new Cupon({
      nombre,
      descripcion,
      codigo,
      logo, // 👈 AQUÍ
      usados: []
    });

    await nuevoCupon.save();
    res.status(201).json(nuevoCupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear cupón" });
  }
});

// =========================
// EDITAR CUPÓN (CON LOGO)
// =========================
router.put("/:id", async (req, res) => {
  const { nombre, descripcion, codigo, logo } = req.body;

  try {
    const cupon = await Cupon.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, codigo, logo }, // 👈 AQUÍ
      { new: true }
    );

    if (!cupon) return res.status(404).json({ message: "Cupón no encontrado" });
    res.json(cupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar cupón" });
  }
});

// =========================
// ELIMINAR CUPÓN
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const cupon = await Cupon.findByIdAndDelete(req.params.id);
    if (!cupon) return res.status(404).json({ message: "Cupón no encontrado" });
    res.json({ message: "Cupón eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar cupón" });
  }
});

// =========================
// CANJEAR CUPÓN
// =========================
router.post("/canjear", async (req, res) => {
  const { cuponId, celular } = req.body;

  if (!cuponId || !celular) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const cupon = await Cupon.findById(cuponId);
    if (!cupon) return res.status(404).json({ message: "Cupón no encontrado" });

    if (!cupon.usados.includes(celular)) {
      cupon.usados.push(celular);
    }

    await cupon.save();
    res.json({ message: "Cupón canjeado correctamente", cupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al canjear cupón" });
  }
});

module.exports = router;
