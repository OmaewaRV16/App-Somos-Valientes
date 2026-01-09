const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ajusta según tu modelo

// Crear admin si no existe
router.post('/crear-admin', async (req, res) => {
  try {
    let admin = await User.findOne({ rol: 'admin' });

    if (!admin) {
      admin = new User({
        nombres: 'Administrador',
        apellidoP: 'Sistema',
        apellidoM: '',
        celular: '9993292792',
        password: 'admin123', // ⚠️ considera encriptar con bcrypt
        rol: 'admin',
        direccion: '',
        fechaNac: '2000-01-01'
      });
      await admin.save();
      return res.status(201).json({ message: 'Admin creado', admin });
    }

    res.json({ message: 'Admin ya existe', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear admin' });
  }
});

module.exports = router;
