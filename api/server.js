// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Importa o arquivo de rotas

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb+srv://ohskyz123:ozzdwewHGpMbEtod@cluster0.liqth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
  // Usar as rotas de usuário após a conexão com o banco de dados
  app.use('/api/users', userRoutes); // Aqui é onde você define as rotas
})
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});