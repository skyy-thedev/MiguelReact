// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const proceduresRoutes = require('./routes/procedures');

const app = express();

// Middleware
const allowedOrigins = ['https://miguel-react.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/procedures', proceduresRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});