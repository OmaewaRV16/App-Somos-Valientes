const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ============================
// REGISTRO
// ============================
router.post('/register', async (req, res) => {
  const { apellidoP, apellidoM, nombres, fechaNac, direccion, celular, password, rol } = req.body;

  if (!apellidoP || !apellidoM || !nombres || !fechaNac || !direccion || !celular || !password || !rol) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const existingUser = await User.findOne({ celular });
    if (existingUser) {
      return res.status(400).json({ message: "Este número de celular ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const codigoSimulado = Math.floor(100000 + Math.random() * 900000).toString();

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
      message: 'Usuario registrado con éxito',
      codigoSimulado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// ============================
// VERIFICAR CUENTA
// ============================
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

// ============================
// LOGIN
// ============================
router.post('/login', async (req, res) => {
  const { celular, password } = req.body;

  if (!celular || !password) {
    return res.status(400).json({ message: "Número de celular y contraseña son obligatorios" });
  }

  try {
    const user = await User.findOne({ celular });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (!user.verificado) {
      return res.status(403).json({ message: "Cuenta no verificada" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const { password: pw, ...userData } = user.toObject();
    res.json({ message: "Login exitoso", user: userData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// ============================
// OBTENER USUARIOS
// ============================
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/users/rol/:rol', async (req, res) => {
  try {
    const users = await User.find({ rol: req.params.rol }, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================
// 🔥 ELIMINAR CUENTA (LO QUE FALTABA)
// ============================
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.deleteOne();

    res.json({ message: 'Cuenta eliminada correctamente' });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error al eliminar cuenta' });
  }
});

module.exports = router;
