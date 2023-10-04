// Importation des modules 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// Création de l'application Express
const app = express();
app.use(cors());

// Importation des routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middleware pour analyser le corps des requêtes au format JSON
app.use(bodyParser.json());

// Utilisation des routes spécifiques 
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// Servez le contenu du dossier build
app.use(express.static(path.join(__dirname, '../build')));

// On assure que toutes les autres routes renvoient le fichier index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Exportation de l'application Express
module.exports = app;
