const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

const upload = multer({ storage: multer.memoryStorage() });

// ============================
// REGISTRO
// ============================
router.post('/register', async (req, res) => {
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
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ celular });
    if (existingUser) {
      return res.status(400).json({ message: 'Este número de celular ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      apellidoP,
      apellidoM,
      nombres,
      fechaNac,
      direccion,
      celular,
      password: hashedPassword,
      rol,
      codigo,
      verificado: false,
      foto: null
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      codigo
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// ============================
// SUBIR FOTO DE PERFIL 🔥
// ============================
router.put('/users/:id/foto', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió imagen' });
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'sociedad-valiente' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { foto: result.secure_url },
      { new: true }
    );

    res.json(updatedUser);

  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({ message: 'Error subiendo imagen' });
  }
});

// ============================
// LOGIN
// ============================
router.post('/login', async (req, res) => {
  const { celular, password } = req.body;

  if (!celular || !password) {
    return res.status(400).json({ message: 'Número de celular y contraseña son obligatorios' });
  }

  try {
    const user = await User.findOne({ celular });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (!user.verificado) {
      return res.status(403).json({ message: 'Cuenta no verificada' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const { password: pw, codigo, ...userData } = user.toObject();
    res.json({ message: 'Login exitoso', user: userData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================
// ELIMINAR CUENTA
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