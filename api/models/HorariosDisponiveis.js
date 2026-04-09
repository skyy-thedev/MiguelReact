const mongoose = require('mongoose');

const horariosDisponiveisSchema = new mongoose.Schema({
  nomeProcedimento: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  horariosDisponiveis: {
    type: [String], 
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('HorariosDisponiveis', horariosDisponiveisSchema);
