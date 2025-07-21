// Criação do modelo de usuário para o MongoDB usando Mongoose
// Este modelo define a estrutura dos documentos de usuário no banco de dados
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    curso:{
        type: String,
        required: true,
        trim: true,
    },
    nivel:{
        type: String,
        required: true,
        trim: true,
    },
    favoriteFlashcards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard'
    }],
    accuracy: {
        type: Number,
        default: 0,
    },
    streak: {
        type: Number,
        default: 0,
    },
    totalCards:{
        type: Number,
        default: 0,
    },
    totalCorrect:{
        type: Number,
        default: 0,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    lastStudyDate: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);