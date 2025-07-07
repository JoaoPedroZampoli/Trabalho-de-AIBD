const mongoose = require('mongoose');
const { create } = require('./User');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options:{
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                // Verifica se há pelo menos 2 opções
                return v.length >= 2;
            }
            , message: 'Deve haver pelo menos 2 opções.'
        }
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Fácil', 'Médio', 'Difícil'],
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    correctAttempts: {
        type: Number,
        default: 0
    },
    incorrectAttempts: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

flashcardSchema.virtual('accuracy').get(function() {
    const total = this.correctAttempts + this.incorrectAttempts;
    return total > 0 ? ((this.correctAttempts / total) * 100).toFixed(1) : 0;
});

flashcardSchema.index({ category: 1, difficulty: 1 }); // Index para otimizar consultas por categoria e dificuldade
flashcardSchema.index({ createdBy: 1 }); // Index para otimizar consultas por usuário criador
flashcardSchema.index({ incorrectAttempts: -1, totalAttempts: -1 }); // Index para otimizar consultas por tentativas incorretas e totais

module.exports = mongoose.model('Flashcard', flashcardSchema);