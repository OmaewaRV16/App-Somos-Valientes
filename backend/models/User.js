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
  codigo: String,       // <- código de verificación
  verificado: { type: Boolean, default: false } // <- estado verificado
});

module.exports = mongoose.model("User", UserSchema);
