const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false,
  },
  valor: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Procedure', procedureSchema);