const express = require('express');
const router = express.Router();
const Procedure = require('../models/Procedure'); 

router.post('/', async (req, res) => {
    try {
      const { nome, valor } = req.body;
  
      const newProcedure = new Procedure({
        nome,
        valor,
      });
  
      await newProcedure.save();
      res.status(201).json(newProcedure);
    } catch (error) {
      console.error("Erro ao criar procedimento:", error);
      res.status(500).send("Erro ao criar procedimento.");
    }
  });

  router.get('/', async (req, res) => {
    try {
      const procedures = await Procedure.find(); // Busca todos os procedimentos
      res.status(200).json(procedures); // Retorna os procedimentos como JSON
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar procedimentos', error });
    }
  });

router.delete('/procedures/nome/:nome', async (req, res) => {
    const nome = req.params.nome; // Obtém o nome do procedimento a partir da URL

    try {
        // Busca o procedimento pelo nome
        const procedimento = await Procedure.findOne({ nome });
        
        if (!procedimento) {
            return res.status(404).json({ message: 'Procedimento não encontrado' });
        }

        // Exclui o procedimento
        await Procedure.deleteOne({ nome });

        // Resposta de sucesso
        res.status(200).json({ message: 'Procedimento excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir procedimento:", error);
        res.status(500).json({ message: 'Erro ao excluir procedimento', error });
    }
});

module.exports = router;