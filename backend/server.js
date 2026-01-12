require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const routes = require("./routes");
const cuponesRoutes = require("./routes/cupones");
const accionesRoutes = require("./routes/acciones");
const comentariosRoutes = require("./routes/comentarios");
const userRoutes = require("./routes/userRoutes");

const User = require("./models/User");
const bcrypt = require("bcrypt");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB (Atlas)
connectDB();

// 🔹 Endpoint de prueba (OBLIGATORIO para Railway)
app.get("/ping", (req, res) => {
  res.json({ ok: true, status: "Sociedad Valiente backend activo" });
});

// 🔹 Rutas de usuarios (registro / login / verificación)
app.use("/api", userRoutes);

// 🔹 Rutas generales
app.use("/api", routes);

// 🔹 Rutas de cupones
app.use("/api/cupones", cuponesRoutes);

// 🔹 Rutas de acciones
app.use("/api/acciones", accionesRoutes);

// 🔹 Rutas de comentarios
app.use("/api/comentarios", comentariosRoutes);

// 🔹 Crear admin automáticamente si no existe
const crearAdmin = async () => {
  try {
    const existeAdmin = await User.findOne({ rol: "admin" });

    if (!existeAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        salt
      );

      const admin = new User({
        nombres: "Administrador",
        apellidoP: "Sistema",
        apellidoM: "",
        celular: "9993292792",
        password: hashedPassword,
        rol: "admin",
        direccion: "",
        fechaNac: "2000-01-01",
        verificado: true
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

// 🔹 Puerto dinámico para Railway (CLAVE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
