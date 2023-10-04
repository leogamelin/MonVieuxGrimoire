// On importe les modules
const jsonWebToken = require('jsonwebtoken');
require('dotenv').config();

// Middleware d'authentification
module.exports = (req, res, next) => {
    try {

        // On récupère le token JWT
        const token = req.headers.authorization.split(' ')[1];

        // On vérifie le token avec la clé secrète
        const decodedToken = jsonWebToken.verify(token, process.env.SECRET_KEY);

        // On extrait l'id de utilisateur depuis le token décodé
        const userId = decodedToken.userId;

        // Stockage de l'ID utilisateur dans l'objet req
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }   
};
