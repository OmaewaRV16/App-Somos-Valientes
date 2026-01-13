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

app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN DB
connectDB().then(crearAdmin);

// 🔥 HEALTH CHECK
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Backend activo Sociedad Valiente" });
});

// 🔥 RUTAS
app.use("/api/cupones", cuponesRoutes);
app.use("/api/acciones", accionesRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api", userRoutes);

// 🔥 ADMIN
async function crearAdmin() {
  const existeAdmin = await User.findOne({ rol: "admin" });
  if (existeAdmin) return console.log("ℹ️ Admin ya existe");

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await User.create({
    nombres: "Administrador",
    apellidoP: "Sistema",
    celular: "9993292792",
    password: hash,
    rol: "admin",
    verificado: true
  });

  console.log("✅ Admin creado");
}

// 🔥 PUERTO RAILWAY
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor escuchando en ${PORT}`);
});
