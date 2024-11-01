// routes/agendamentoRoutes.js
const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

// Rota para criar um novo agendamento
router.post('/agendamento', async (req, res) => {
    const { procedimento, date,  horario, userName, valor } = req.body; 

    // Validação dos dados
    if (!procedimento || !horario || valor === undefined || !userName)  { // Use valor === undefined para tratar números
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        // Criação do novo agendamento
        const novoAgendamento = new Agendamento({
            procedimento,
            date,
            horario,
            userName,
            valor,
        });

        // Salva o novo agendamento no banco de dados
        await novoAgendamento.save();

        // Resposta de sucesso
        res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error); // Mostra o erro no console
        res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message }); // Retorna erro detalhado
    }
});

// Rota para obter todos os agendamentos
router.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find(); // ou sua lógica para pegar os agendamentos
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamentos' });
    }
});

router.delete('/agendamentos/:id', async (req, res) => {
  try {
    const { id } = req.params; // Certifique-se de que o ID está sendo capturado corretamente
    const deletedAgendamento = await Agendamento.findByIdAndDelete(id);

    if (!deletedAgendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
});

router.put('/agendamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAgendamento = await Agendamento.findByIdAndUpdate(id, req.body, { new: true }); // Atualizar o agendamento

    if (!updatedAgendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json({ message: 'Agendamento atualizado com sucesso!', agendamento: updatedAgendamento });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ message: 'Erro ao atualizar agendamento' });
  }
});

// Exportar as rotas
module.exports = router;
