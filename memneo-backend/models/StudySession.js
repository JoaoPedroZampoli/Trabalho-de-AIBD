const mongoose = require('mongoose');

const sessionAnswerSchema = new mongoose.Schema({
    flashcard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard',
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true,
        default: 0 // Tempo em segundos
    },
    userAnswer: {
        type: String,
        required: true
    }
});

const studySessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    answers: [sessionAnswerSchema],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    totalTime: {
        type: Number
    },
    totalCorrect: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    flashcardsStudied: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

studySessionSchema.pre('save', function(next) {
    if (this.answers.length > 0) {
        this.totalCards = this.answers.length;
        this.flashcardsStudied = this.answers.length;
        this.totalCorrect = this.answers.filter(answer => answer.isCorrect).length;
        this.accuracy = this.totalCards > 0 ? ((this.totalCorrect / this.totalCards) * 100).toFixed(1) : 0; // Calcula a precisão, usa toFixed para limitar a 1 casa decimal
    }

    if (this.startTime && this.endTime) {
        this.totalTime = Math.floor((this.endTime - this.startTime) / 1000); // Calcula o tempo total em segundos
    }

    next();
});

module.exports = mongoose.model('StudySession', studySessionSchema);