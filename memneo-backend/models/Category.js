// Criação do modelo de categoria para o MongoDB usando Mongoose
// Este modelo define a estrutura dos documentos de categoria no banco de dados

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    totalCards: {
        type: Number,
        default: 0,
    },
    totalCorrect: {
        type: Number,
        default: 0,
    },
    totalIncorrect: {
        type: Number,
        default: 0,
    }}, {
    timestamps: true
});

categorySchema.virtual('accuracy').get(function() {
    const total = this.totalCorrect + this.totalIncorrect;
    return total > 0 ? ((this.totalCorrect / total) * 100).tofixed(1) : 0;
});

module.exports = mongoose.model('Category', categorySchema);