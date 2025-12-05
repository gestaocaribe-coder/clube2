const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const consultantsRoutes = require('./routes/consultants');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/auth', authRoutes);
app.use('/consultants', consultantsRoutes);

// Rota de Healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'API Portal Master Online', timestamp: new Date() });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});