const mongoose = require("mongoose");

const CuponSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  codigo: String,
  usados: [{ type: String }]   // lista de celulares que ya lo usaron
});

module.exports = mongoose.model("Cupon", CuponSchema);
