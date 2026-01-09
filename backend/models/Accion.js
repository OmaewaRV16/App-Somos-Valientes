const mongoose = require("mongoose");

const AccionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Accion", AccionSchema);
