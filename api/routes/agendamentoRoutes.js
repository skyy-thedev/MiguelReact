const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Agendamento = require('../models/Agendamento');
const HorariosDisponiveis = require('../models/HorariosDisponiveis');
const Procedure = require('../models/Procedure');

// ROTA: Criar novo agendamento
router.post('/agendamentos', async (req, res) => {
  const { procedimento, date, horario, userName, valor, status = 'Ativo' } = req.body;

  if (!procedimento || !horario || valor === undefined || !userName || !date) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  const dataFormatada = new Date(date).toISOString().slice(0, 10);

  try {
    const jaExiste = await Agendamento.findOne({
      procedimento,
      date: dataFormatada,
      horario,
      status: 'Ativo',
    });

    if (jaExiste) {
      return res.status(400).json({ message: 'Horário já agendado para este procedimento' });
    }

    const novoAgendamento = new Agendamento({
      procedimento,
      date: dataFormatada,
      horario,
      userName,
      valor,
      status,
    });

    await novoAgendamento.save();
    res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno', error: error.message });
  }
});

// ROTA: Obter todos os agendamentos
router.get('/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: error.message });
  }
});

// ROTA: Deletar um agendamento
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Agendamento.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar agendamento', error: error.message });
  }
});

// ROTA: Atualizar um agendamento
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Agendamento.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!atualizado) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json({ message: 'Agendamento atualizado com sucesso!', agendamento: atualizado });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ message: 'Erro ao atualizar agendamento', error: error.message });
  }
});

module.exports = router;