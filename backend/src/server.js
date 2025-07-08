const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://emploi-temps-scolaire.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Emploi du Temps Scolaire',
    version: '1.0.0',
    status: 'active'
  });
});

// Routes d'authentification
app.use('/api/auth', require('./routes/auth'));

// Routes admin
app.use('/api/admin', require('./routes/admin'));

// Routes API
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/timetables', require('./routes/timetables'));
app.use('/api/conflicts', require('./routes/conflicts'));

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  
  // Activer la base de données
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log('Base de données synchronisée');
  } catch (error) {
    console.log('Base de données non disponible, mode fichier activé');
  }
});