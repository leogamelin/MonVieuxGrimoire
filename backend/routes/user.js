// Importation du module express et création d'un router
const express = require("express");
const router = express.Router();

// Importation de userCtrl
const userCtrl = require("../controllers/user");

// Route POST pour l'inscription et la connexion d'un utilisateur
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

router.get("/", (req, res) => {
    res.send();
});

// On exporte le router
module.exports = router;