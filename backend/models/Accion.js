const mongoose = require("mongoose");

const AccionSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },

    // 🔥 NUEVO CAMPO ESTADO
    estado: {
      type: String,
      enum: ["en_curso", "finalizada"],
      default: "en_curso",
    },

    // 🔥 QUIÉNES LA REALIZARON
    realizados: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accion", AccionSchema);