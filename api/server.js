const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar rotas
const userRoutes = require('./routes/userRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const proceduresRoutes = require('./routes/procedures');
const horarioRoutes = require('./routes/horarioRoutes');
const recomendacaoRoutes = require('./routes/recomendacaoRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
const allowedOrigins = ['https://miguel-react.vercel.app', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/procedures', proceduresRoutes);
app.use('/api/horariosdisponiveis', horarioRoutes);
app.use('/api/recomendacoes', recomendacaoRoutes);

// Start
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});