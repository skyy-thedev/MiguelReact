// routes/agendamentoRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Agendamento = require('../models/Agendamento');
const HorariosDisponiveis = require('../models/HorariosDisponiveis');
const Procedure = require('../models/Procedure'); 

// Rota para criar um novo agendamento
router.post('/agendamentos', async (req, res) => {
    const { procedimento, date, horario, userName, valor, status } = req.body;

    if (!procedimento || !horario || valor === undefined || !userName) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        const novoAgendamento = new Agendamento({
            procedimento,
            date,
            horario,
            userName,
            valor,
            status,
        });

        await novoAgendamento.save();
        res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message });
    }
});

// Rota para obter todos os agendamentos
router.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find();
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamentos' });
    }
});

router.get('/recomendacoes', async (req, res) => {
  const diasRecomendados = 6; // Próximos 7 dias
  const dataHoje = new Date();

  try {
    const proximosAgendamentos = [];
    for (let i = 0; i < diasRecomendados; i++) {
      const data = new Date(dataHoje);
      data.setDate(dataHoje.getDate() + i);
      const agendamentosDia = await Agendamento.find({
        date: data.toISOString().slice(0, 10),
        status: 'Ativo',
      });

      const todosHorarios = [
        '09:00', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      const horariosOcupados = agendamentosDia.map((ag) => ag.horario);
      const horariosDisponiveis = todosHorarios.filter(
        (horario) => !horariosOcupados.includes(horario)
      );

      if (horariosDisponiveis.length > 0) {
        proximosAgendamentos.push({
          date: data.toISOString().slice(0, 10),
          horarios: horariosDisponiveis,
        });
      }
    }

    res.status(200).json(proximosAgendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar próximos agendamentos' });
  }
});

// Rota para adicionar horários disponíveis a um procedimento
router.post('/horarios-disponiveis', async (req, res) => {
  const { nomeProcedimento, data, horariosDisponiveis } = req.body;
  if (!nomeProcedimento || !data || !Array.isArray(horariosDisponiveis)) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    const existing = await HorariosDisponiveis.findOne({ nomeProcedimento, data });
    if (existing) {
      return res.status(400).json({ message: 'Horários para esse procedimento já estão registrados para esta data.' });
    }

    const horarios = new HorariosDisponiveis({
      nomeProcedimento,
      data,
      horariosDisponiveis
    });

    await horarios.save();
    res.status(201).json({ message: 'Horários disponíveis registrados com sucesso', horarios });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar horários', message: error.message });
  }
});

// Rota para consultar horários disponíveis
router.get('/horarios-disponiveis', async (req, res) => {
    const { date, procedimento } = req.query;

    try {
        const registro = await HorariosDisponiveis.findOne({
            nomeProcedimento: procedimento,
            data: new Date(date).toISOString().slice(0, 10)
        });

        if (registro) {
            res.status(200).json(registro.horariosDisponiveis);
        } else {
            const todosHorarios = [
                '09:00', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', 
            ];
            res.status(200).json(todosHorarios);
        }
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
    }
});

// Rota para deletar um agendamento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAgendamento = await Agendamento.findByIdAndDelete(id);

        if (!deletedAgendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.status(200).json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar agendamento', error });
    }
});

// Rota para atualizar um agendamento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAgendamento = await Agendamento.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAgendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.status(200).json({ message: 'Agendamento atualizado com sucesso!', agendamento: updatedAgendamento });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ message: 'Erro ao atualizar agendamento' });
    }
});

module.exports = router;