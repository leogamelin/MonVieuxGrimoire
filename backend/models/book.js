// Importation de mongoose
const mongoose = require('mongoose');

// Schémas des livres
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true },
        }
    ],
    // Note moyenne
    averageRating: { type: Number, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
