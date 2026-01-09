const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // 🔹 bcrypt para encriptar
const User = require('../models/User');

// 🔹 Registro de usuario con código simulado
router.post('/register', async (req, res) => {
  const { apellidoP, apellidoM, nombres, fechaNac, direccion, celular, password, rol } = req.body;

  // Validar campos obligatorios
  if (!apellidoP || !apellidoM || !nombres || !fechaNac || !direccion || !celular || !password || !rol) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Verificar si el número ya existe
    const existingUser = await User.findOne({ celular });
    if (existingUser) {
      return res.status(400).json({ message: "Este número de celular ya está registrado" });
    }

    // 🔹 Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 Generar código simulado de verificación
    const codigoSimulado = Math.floor(100000 + Math.random() * 900000).toString();

    // Crear usuario
    const newUser = new User({
      apellidoP,
      apellidoM,
      nombres,
      fechaNac,
      direccion,
      celular,
      password: hashedPassword,
      rol,
      codigo: codigoSimulado,
      verificado: false
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado con éxito (simulado)',
      codigoSimulado // 🔹 Enviamos el código al frontend para VerificarScreen
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// 🔹 Verificar código de cuenta
router.post('/verificar', async (req, res) => {
  const { celular, codigo } = req.body;

  try {
    const user = await User.findOne({ celular });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.verificado) return res.json({ message: 'Usuario ya verificado' });

    if (user.codigo === codigo) {
      user.verificado = true;
      user.codigo = null;
      await user.save();
      res.json({ message: 'Cuenta verificada correctamente' });
    } else {
      res.status(400).json({ message: 'Código incorrecto' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar' });
  }
});

// 🔹 Login de usuario
router.post('/login', async (req, res) => {
  const { celular, password } = req.body;

  if (!celular || !password) {
    return res.status(400).json({ message: "Número de celular y contraseña son obligatorios" });
  }

  try {
    const user = await User.findOne({ celular });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (!user.verificado) return res.status(403).json({ message: "Cuenta no verificada. Revisa tu código." });

    // 🔹 Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Devolver usuario sin contraseña
    const { password: pw, ...userData } = user.toObject();
    res.json({ message: "Login exitoso", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// 🔹 Obtener todos los usuarios (sin contraseña)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// 🔹 Obtener solo participantes
// ✅ Obtener SOLO usuarios por rol (padrinos, participantes, admin, etc.)
router.get("/users/rol/:rol", async (req, res) => {
  try {
    const { rol } = req.params;

    // Buscar por rol, excluyendo contraseña
    const users = await User.find({ rol }, "-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios con ese rol" });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});


module.exports = router;
