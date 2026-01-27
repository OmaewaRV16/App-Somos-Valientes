const mongoose = require("mongoose");

const CuponSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,   // nombre del negocio
  },
  descripcion: {
    type: String,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
  },
  logo: {
    type: String,     // URL del logo
  },
  categoria: {
    type: String,     // 👈 NUEVO
    required: true,   // obliga a elegir categoría
  },
  usados: [
    {
      type: String,   // celulares que ya lo canjearon
    }
  ],
});

module.exports = mongoose.model("Cupon", CuponSchema);
