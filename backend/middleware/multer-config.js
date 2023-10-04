// Importation des packages nécessaires
const multer = require('multer');
const sharp = require ('sharp');
const fs = require('fs');

// Définition des types MIME pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({

    // On spécifie le dossier de destination pour les images téléchargées
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    // On définit le nom du fichier pour s'assurer qu'il est unique
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exportation de la configuration multer pour gérer un seul fichier image à la fois
module.exports = multer({ storage }).single('image');

// Fonction pour convertir les images en format webp
const convertToWebp = (req, res, next) => {

    // On vérifie si une image a été téléchargée
    if (req.file && req.file.path) {
        const originalImagePath = req.file.path;
        const outputPath = req.file.path.replace(/\.[^.]+$/, '.webp');
        
        // On utilise sharp pour convertir l'image en webp et la redimensionner
        sharp(originalImagePath)
            .toFormat('webp')
            .resize({
                width: 800,
                height: 800,
                fit: 'contain'
            })
            .toFile(outputPath)
            .then(() => {

                // On supprime l'image originale après la conversion et met à jour le chemin du fichier
                if (fs.existsSync(originalImagePath)) {
                    fs.unlinkSync(originalImagePath);
                }
                req.file.path = outputPath.replace('images\\', '');
                next();
            })
            .catch(error => {
                console.error('Error converting image to webp:', error);
                next();
            });
    } else {

        // Si aucune image n'a été téléchargée, passe au middleware suivant
        next();
    }
};

module.exports.convertToWebp = convertToWebp;