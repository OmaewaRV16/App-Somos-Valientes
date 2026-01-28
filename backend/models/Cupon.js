const mongoose = require("mongoose");

const CuponSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,      // Nombre del negocio
      trim: true,
    },

    descripcion: {
      type: String,
      required: true,      // Descripción del cupón
      trim: true,
    },

    codigo: {
      type: String,
      required: true,      // Código del cupón
      trim: true,
    },

    logo: {
      type: String,        // URL del logo (opcional)
      trim: true,
      default: "",
    },

    categoria: {
      type: String,        // Categoría del cupón
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,        // 👈 OPCIONAL: número o link de WhatsApp
      trim: true,
      default: "",
    },

    usados: [
      {
        type: String,      // Celulares que ya canjearon el cupón
        trim: true,
      },
    ],
  },
  {
    timestamps: true,      // createdAt / updatedAt
  }
);

module.exports = mongoose.model("Cupon", CuponSchema);
