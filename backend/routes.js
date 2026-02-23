const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// =====================
// REGISTRO
// =====================
router.post("/register", async (req, res) => {
  const {
    apellidoP,
    apellidoM,
    nombres,
    fechaNac,
    direccion,
    celular,
    password,
    rol
  } = req.body;

  if (
    !apellidoP ||
    !apellidoM ||
    !nombres ||
    !fechaNac ||
    !direccion ||
    !celular ||
    !password ||
    !rol
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // 🔍 Verificar si ya existe
    const existingUser = await User.findOne({ celular });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este número de celular ya está registrado" });
    }

    // 🔐 Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 Generar código OTP
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // 👤 Crear usuario
    const newUser = new User({
      apellidoP,
      apellidoM,
      nombres,
      fechaNac,
      direccion,
      celular,
      password: hashedPassword,
      rol,
      verificado: false,
      codigo
    });

    await newUser.save();

    // 🔥 DEVOLVEMOS EL CÓDIGO AL FRONTEND (MODO DESARROLLO)
    res.status(201).json({
      message: "Usuario registrado correctamente",
      codigo
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// =====================
// VERIFICAR CUENTA
// =====================
router.post("/verificar", async (req, res) => {
  const { celular, codigo } = req.body;

  if (!celular || !codigo) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const user = await User.findOne({ celular });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.verificado)
      return res.json({ message: "Usuario ya verificado" });

    if (user.codigo === codigo) {
      user.verificado = true;
      user.codigo = null;
      await user.save();

      return res.json({ message: "Cuenta verificada correctamente" });
    }

    return res.status(400).json({ message: "Código incorrecto" });

  } catch (error) {
    console.error("❌ Verificar error:", error);
    res.status(500).json({ message: "Error al verificar" });
  }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
  const { celular, password } = req.body;

  if (!celular || !password) {
    return res
      .status(400)
      .json({ message: "Celular y contraseña obligatorios" });
  }

  try {
    const user = await User.findOne({ celular });

    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    if (!user.verificado)
      return res
        .status(403)
        .json({ message: "Cuenta no verificada" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const { password: pw, codigo, ...userData } = user.toObject();

    res.json({ message: "Login exitoso", user: userData });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// =====================
// USUARIOS (ADMIN / DEBUG)
// =====================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password -codigo");
    res.json(users);
  } catch (error) {
    console.error("❌ Users error:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;