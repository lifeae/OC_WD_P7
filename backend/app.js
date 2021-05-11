// Dépendances
const express = require('express');
const app = express();
const authentificationRoutes = require('./routes/authentification');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dbConnection = require('./dbConnection');

// Securité
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500 // limit each IP to 500 requests per windowMs
});
//app.use(limiter);
app.use(helmet());

// Gestion des chemins pour la gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Autorisation des requêtes de toutes origines
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Permet de transformer du texte en JSON et inversement
app.use(bodyParser.json());

// Redirige vers d'autres fichiers
app.use('/auth', authentificationRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);


// Enregistre tout sur l'app
module.exports = app;