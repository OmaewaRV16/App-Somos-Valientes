const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  apellidoP: String,
  apellidoM: String,
  nombres: String,
  fechaNac: String,
  direccion: String,
  celular: { type: String, unique: true },
  password: String,
  rol: String,
  codigo: String,
  verificado: { type: Boolean, default: false },

  // 🔥 NUEVO CAMPO
  foto: {
    type: String,
    default: null
  }

});

module.exports = mongoose.model("User", UserSchema);