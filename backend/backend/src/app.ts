import express from 'express';
import mongoose from 'mongoose';
import medicationRoutes from './routes/medication.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ MIDDLEWARE CRUCIAL - À ajouter AVANT les routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ ROUTES - Cette ligne est ESSENTIELLE
app.use('/api/medications', medicationRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medication-db')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;