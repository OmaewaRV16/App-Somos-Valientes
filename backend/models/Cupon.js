const mongoose = require("mongoose");

const CuponSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  codigo: String,
  logo: String,               // 👈 AGREGA ESTO
  usados: [{ type: String }]
});

module.exports = mongoose.model("Cupon", CuponSchema);
