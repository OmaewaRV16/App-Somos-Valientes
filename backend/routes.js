const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Cupon = require("./models/Cupon")
// Ruta de registro
// Ruta de registro
router.post("/register", async (req, res) => {
    const { apellidoP, apellidoM, nombres, fechaNac, direccion, celular, password, rol } = req.body;

    if (!apellidoP || !apellidoM || !nombres || !fechaNac || !direccion || !celular || !password || !rol) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
    const existingUser = await User.findOne({ celular });
    if (existingUser) {
        return res.status(400).json({ message: "Este número de celular ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const codigo = Math.floor(100000 + Math.random() * 900000); // código de 6 dígitos

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

    res.status(201).json({ 
        message: "Usuario registrado. Falta verificar cuenta.", 
      codigo // ← por ahora lo regresamos para que puedas probar
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
    }
});


// ✅ Verificar código de cuenta
router.post('/verificar', async (req, res) => {
    const { celular, codigo } = req.body;

    try {
    const user = await User.findOne({ celular });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.verificado) return res.json({ message: 'Usuario ya verificado' });

    if (user.codigo == codigo) {
        user.verificado = true;
        user.codigo = null;
        await user.save();
        res.json({ message: 'Cuenta verificada correctamente' });
    } else {
        res.status(400).json({ message: 'Código incorrecto' });
    }
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al verificar' });
    }
});


// Ruta de login
router.post("/login", async (req, res) => {
    const { celular, password } = req.body;

    if (!celular || !password) {
    return res.status(400).json({ message: "Número de celular y contraseña son obligatorios" });
    }

    try {
    const user = await User.findOne({ celular });
    if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (!user.verificado) {
    return res.status(403).json({ message: "Cuenta no verificada. Revisa tu código." });
    }


    // Devolver los datos sin la contraseña
    const { password: pw, ...userData } = user.toObject();
    res.json({ message: "Login exitoso", user: userData });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

// Ruta para obtener todos los usuarios
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // excluye la contraseña
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});



// Obtener cupones
router.get("/cupones", async (req, res) => {
  try {
    const cupones = await Cupon.find();
    res.json(cupones);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener cupones" });
  }
});

module.exports = router;