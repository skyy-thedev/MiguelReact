// models/HorariosDisponiveis.js
const mongoose = require('mongoose');

const HorarioDisponivelSchema = new mongoose.Schema({
  nomeProcedimento: { type: String, required: true, unique: true },
  data: { type: Date, required: true },
  horariosDisponiveis: { type: [String], required: true },
});

module.exports = mongoose.model('HorariosDisponiveis', HorarioDisponivelSchema);