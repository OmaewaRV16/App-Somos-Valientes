const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); // 🔹 Importar bcrypt

// POST /api/login
router.post("/login", async (req, res) => {
  const { celular, password } = req.body;

  try {
    const user = await User.findOne({ celular });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // 🔹 Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
});

module.exports = router;
