require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const cuponesRoutes = require("./routes/cupones");
const accionesRoutes = require("./routes/acciones");
const comentariosRoutes = require("./routes/comentarios");
const userRoutes = require("./routes/userRoutes");

const User = require("./models/User");
const bcrypt = require("bcrypt");

const app = express();

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ==========================
// CONEXIÓN A MONGODB
// ==========================
connectDB();

// ==========================
// HEALTH CHECK (Railway)
// ==========================
app.get("/ping", (req, res) => {
  res.json({ ok: true, status: "Sociedad Valiente backend activo" });
});

// ==========================
// RUTAS
// ==========================
app.use("/api/cupones", cuponesRoutes);
app.use("/api/acciones", accionesRoutes);
app.use("/api/comentarios", comentariosRoutes);

// 🔥 USUARIOS / AUTH (incluye DELETE /api/users/:id)
app.use("/api", userRoutes);

// ==========================
// CREAR ADMIN AUTOMÁTICO
// ==========================
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

// Espera a DB antes de crear admin
connectDB().then(() => {
  setTimeout(crearAdmin, 1000);
});

// ==========================
// PUERTO
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
