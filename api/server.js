// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes'); // Importa o arquivo de rotas
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const proceduresRoutes = require('./routes/procedures');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
  // Usar as rotas de usuário após a conexão com o banco de dados
  app.use('/api/users', userRoutes); // Aqui é onde você define as rotas
  app.use('/api/agendamentos', agendamentoRoutes);
  app.use('/api/procedures', proceduresRoutes);
  app.use('/api', agendamentoRoutes);

})
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});