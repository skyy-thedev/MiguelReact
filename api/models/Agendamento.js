const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
    procedimento: { type: String, required: true },
    horario: { type: String, required: true },
    date: { type: Date, required: true},
    userName: { type: String, required: false},
    valor: { type: Number, required: true }, // Ajuste para int se necessário
}, {
    timestamps: true // Isso cria os campos createdAt e updatedAt automaticamente
});

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);

module.exports = Agendamento;