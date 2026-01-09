const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true }, // celular o correo
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comentario', ComentarioSchema);
