// Importation des modules nécessaires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Définition du schéma utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Utilisation d'uniqueValidator sur le schéma pour avoir un seul utilisateur par adresse mail 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);