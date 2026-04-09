require('dotenv').config();
const mongoose = require('mongoose');
const Procedure = require('../models/Procedure');
const HorariosDisponiveis = require('../models/HorariosDisponiveis');

const MONGO_KEY = process.env.MONGO_URI; 
const diasParaGerar = 15;

const todosHorarios = [
  '09:00', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

async function gerarHorarios() {
  try {
    await mongoose.connect(MONGO_KEY);
    console.log('🟢 Conectado ao MongoDB');

    const procedimentos = await Procedure.find({});
    if (!procedimentos.length) {
      console.log('⚠️ Nenhum procedimento encontrado na collection "procedures".');
      return;
    }

    const hoje = new Date();

    for (let i = 0; i < diasParaGerar; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dataFormatada = data.toISOString().slice(0, 10);

      for (const procedimento of procedimentos) {
        const nomeProcedimento = procedimento.nome || procedimento.name || procedimento.titulo;

        if (!nomeProcedimento) continue;

        const existe = await HorariosDisponiveis.findOne({ nomeProcedimento, data: dataFormatada });

        if (!existe) {
          await HorariosDisponiveis.create({
            nomeProcedimento,
            data: dataFormatada,
            horariosDisponiveis: todosHorarios
          });
          console.log(`✅ Horários criados para ${nomeProcedimento} em ${dataFormatada}`);
        } else {
          console.log(`⚠️ Já existem horários para ${nomeProcedimento} em ${dataFormatada}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Erro ao gerar horários:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔴 Desconectado do MongoDB');
  }
}

gerarHorarios();