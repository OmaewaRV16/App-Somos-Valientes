const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  link: { type: String, required: true },

  // Fecha que el admin decide
  fechaPublicacion: { 
    type: Date, 
    required: true 
  },

  // Fecha real de creación en BD
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Noticia', noticiaSchema);