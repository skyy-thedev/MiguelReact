// ROTA: Recomendação de horários disponíveis nos próximos dias
router.get('/recomendacoes', async (req, res) => {
  const diasRecomendados = 6;
  const hoje = new Date();

  try {
    const proximos = [];

    for (let i = 0; i < diasRecomendados; i++) {const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

// Recomendação de horários (base simples: horários menos ocupados do dia atual)
router.get('/', async (req, res) => {
  const { procedimento } = req.query;

  if (!procedimento) {
    return res.status(400).json({ message: 'Procedimento é obrigatório' });
  }

  try {
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = await Agendamento.find({ data: hoje, procedimento });

    const todosHorarios = [
      '09:00', '10:00', '11:00',
      '13:00', '14:00', '15:00',
      '16:00', '17:00'
    ];

    const contagem = {};
    todosHorarios.forEach(h => contagem[h] = 0);
    agendamentosHoje.forEach(a => contagem[a.horario]++);

    const recomendados = todosHorarios
      .sort((a, b) => contagem[a] - contagem[b])
      .slice(0, 3);

    res.json(recomendados);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter recomendações', error: err });
  }
});

module.exports = router;

      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dataFormatada = data.toISOString().slice(0, 10);

      const agendados = await Agendamento.find({ date: dataFormatada, status: 'Ativo' });

      const registro = await HorariosDisponiveis.findOne({ data: dataFormatada });
      const todosHorarios = registro?.horariosDisponiveis || [
        '09:00', '10:00', '10:30', '11:00', '11:30', '12:00',
        '12:30', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00',
      ];

      const ocupados = agendados.map(a => a.horario);
      const disponiveis = todosHorarios.filter(h => !ocupados.includes(h));

      if (disponiveis.length > 0) {
        proximos.push({ date: dataFormatada, horarios: disponiveis });
      }
    }

    res.status(200).json(proximos);
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    res.status(500).json({ message: 'Erro ao buscar recomendações', error: error.message });
  }
});