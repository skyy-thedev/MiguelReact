require('dotenv').config();
const mongoose = require('mongoose');
const HorariosDisponiveis = require('../models/HorariosDisponiveis');
const Recomendacao = require('../models/Recomendacao');

const MONGO_KEY = process.env.MONGO_URI;
const prioridadeHorarios = [
  '10:00', '09:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

async function gerarRecomendacoes() {
  try {
    await mongoose.connect(MONGO_KEY);
    console.log('🟢 Conectado ao MongoDB');

    // Agrupa por nomeProcedimento
    const todosHorarios = await HorariosDisponiveis.find({});

    const agrupadosPorProcedimento = {};

    for (const item of todosHorarios) {
      const chave = item.nomeProcedimento;

      if (!agrupadosPorProcedimento[chave]) {
        agrupadosPorProcedimento[chave] = [];
      }

      agrupadosPorProcedimento[chave].push(item);
    }

    for (const nomeProcedimento in agrupadosPorProcedimento) {
      const datas = agrupadosPorProcedimento[nomeProcedimento];

      // Ordena por data mais próxima
      datas.sort((a, b) => new Date(a.data) - new Date(b.data));

      for (const dia of datas) {
        const horarioDisponivel = prioridadeHorarios.find(h => dia.horariosDisponiveis.includes(h));
        if (!horarioDisponivel) continue;

        const existe = await Recomendacao.findOne({ nomeProcedimento });

        if (!existe) {
          await Recomendacao.create({
            nomeProcedimento,
            data: dia.data,
            horarioRecomendado: horarioDisponivel
          });
          console.log(`✅ Recomendação criada para ${nomeProcedimento}: ${horarioDisponivel} (${dia.data})`);
        } else {
          console.log(`⚠️ Recomendação já existe para ${nomeProcedimento}, pulando.`);
        }

        break; // Só queremos **uma** recomendação por procedimento
      }
    }
  } catch (err) {
    console.error('❌ Erro ao gerar recomendações:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔴 Desconectado do MongoDB');
  }
}

gerarRecomendacoes();