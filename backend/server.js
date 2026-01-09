require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const routes = require("./routes"); // tus otras rutas
const cuponesRoutes = require("./routes/cupones"); // Rutas de cupones
const accionesRoutes = require("./routes/acciones"); // Rutas de acciones
const comentariosRoutes = require("./routes/comentarios"); // Rutas de comentarios
const userRoutes = require("./routes/userRoutes"); // 🔹 Rutas de usuarios con verificación
const User = require("./models/User"); // modelo de usuarios
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// 🔹 Rutas de usuarios con registro/verificación
app.use("/api", userRoutes);

// Rutas generales
app.use("/api", routes);

// Rutas de cupones
app.use("/api/cupones", cuponesRoutes);

// Rutas de acciones
app.use("/api/acciones", accionesRoutes);

// Rutas de comentarios
app.use("/api/comentarios", comentariosRoutes);

// Crear admin automáticamente si no existe
const crearAdmin = async () => {
  try {
    const existeAdmin = await User.findOne({ rol: "admin" });
    if (!existeAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      const admin = new User({
        nombres: "Administrador",
        apellidoP: "Sistema",
        apellidoM: "",
        celular: "9993292792",
        password: hashedPassword,
        rol: "admin",
        direccion: "",
        fechaNac: "2000-01-01",
        verificado: true // 🔹 Admin siempre verificado
      });

      await admin.save();
      console.log("✅ Admin creado automáticamente");
    } else {
      console.log("ℹ️ Admin ya existe");
    }
  } catch (error) {
    console.error("❌ Error creando admin:", error);
  }
};
crearAdmin();

const PORT = 3000;
app.listen(PORT, "192.168.2.205", () => {
  console.log(`✅ Servidor corriendo en http://192.168.2.205:${PORT}`);
});
