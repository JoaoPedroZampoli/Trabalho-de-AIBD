const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    totalCards: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    studyTime:{
        type: Number,
        default: 0 // in minutes
    },
    categories: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        accuracy: Number,
        cardsStudied: Number
    }],
}, {
    timestamps: true
});

performanceSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Performance', performanceSchema);