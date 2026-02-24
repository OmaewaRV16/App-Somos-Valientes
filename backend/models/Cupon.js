const mongoose = require("mongoose");

const CuponSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
    },

    codigo: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
      default: "",
    },

    categoria: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔵 REDES DEFINITIVAS
    facebookSergio: {
      type: String,
      trim: true,
      default: "",
    },

    instagramSergio: {
      type: String,
      trim: true,
      default: "",
    },

    facebookNegocio: {
      type: String,
      trim: true,
      default: "",
    },

    usados: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cupon", CuponSchema);