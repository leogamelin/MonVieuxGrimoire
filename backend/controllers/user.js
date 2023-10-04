const User = require ('../models/User');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    console.log("Début de la fonction d'inscription"); // Log
    console.log("Contenu de req.body:", req.body); // Ajout de cette ligne

    // On commence par valider les données d'inscription.
    if (!req.body.password) { // Vérification du mot de passe
        console.log("Mot de passe manquant"); // Log
        return res.status(400).json({ message: 'Mot de passe manquant' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        console.log("Email déjà existant"); // Log
        return res.status(401).json({ message: 'Cet email existe déjà dans la base de données' });
    }

    // On hache le mot de passe de l'utilisateur pour des raisons de sécurité.
    const hachedPwd = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hachedPwd
    });

    // On crée un nouvel objet User avec ces données et l'enregistre dans la base de données
    await newUser.save();
    console.log("Utilisateur créé avec succès"); // Log
    res.status(201).json({ message: 'Utilisateur créé !' });
  }
  catch(error) {
    console.log("Erreur lors de l'inscription:", error); // Log
    res.status(500).json({ error });
  }
}


exports.login = async (req, res, next) => {
  try {
    console.log("Début de la fonction de connexion"); // Log

    // On commence par vérifier si l'email de l'utilisateur existe dans la base de données.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("Email non trouvé"); // Log
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
    }

    // On compare le mot de passe fourni avec le mot de passe haché stocké dans la base de données
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      console.log("Mot de passe incorrect"); // Log
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
    }

    // Si tout est correct, on génère un token JWT pour l'utilisateur et le renvoie
    console.log("Connexion réussie"); // Log
    res.status(200).json({
      userId: user._id,
      token: jwt.sign(
        {userId:user._id},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
      )
    });             
  }
  catch(error) {
    console.log("Erreur lors de la connexion:", error); // Log
    res.status(500).json({ error });
  } 
}
