const mongoose = require('mongoose');

const recomendacaoSchema = new mongoose.Schema({
  nomeProcedimento: { type: String, required: true },
  data: { type: String, required: true }, // formato YYYY-MM-DD
  horarioRecomendado: { type: String, required: true }
});

module.exports = mongoose.model('Recomendacao', recomendacaoSchema);
