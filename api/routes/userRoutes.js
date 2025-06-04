const express = require('express');
const User = require('../models/User'); // Verifique se o caminho está correto
const Procedure = require('../models/Procedure');
const bcrypt = require('bcrypt'); // Para hash de senhas
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword, privilegies } = req.body;

    // Validações simples
    if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, privilegies });
        await newUser.save();

        res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email, privilegies: newUser.privilegies } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar o usuário', error: error.message });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, privilegies: user.privilegies } });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
});

router.get('/procedures', async (req, res) => {
    try {
      const procedures = await Procedure.find(); // Busca todos os procedimentos
      res.status(200).json(procedures); // Retorna os procedimentos como JSON
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar procedimentos', error });
    }
  });

module.exports = router; // Não esqueça de exportar o router