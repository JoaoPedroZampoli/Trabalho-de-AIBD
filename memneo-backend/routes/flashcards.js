const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                return res.status(400).json({ error: 'Invalid category' });
            }
        }
        if(difficulty){
            filter.difficulty = difficulty;
        }

        const flashcards = await Flashcard.find(filter).populate('category', 'name').sort({ createdAt: -1 });

        const formattedFlashcards = flashcards.map(flashcard => ({
            id: flashcard._id,
            question: flashcard.question,
            options: flashcard.options,
            answer: flashcard.answer,
            category: flashcard.category.name,
            difficulty: flashcard.difficulty,
            errors: flashcard.incorrectAttempts,
            accuracy: flashcard.accuracy
        }));

        res.json(formattedFlashcards);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { question, options, answer, categoryName, difficulty, tags } = req.body;

        let category = await Category.findOne({ name: categoryName });
        if (!category) {
            category = new Category({ name: categoryName });
            await category.save();
        }

        const flashcard = new Flashcard({
            question,
            options,
            answer,
            category: category._id,
            difficulty,
            tags: tags || [],
            createdBy: req.user._id
        });

        await flashcard.save();
        await flashcard.populate('category', 'name');

        category.totalCards += 1;
        await category.save();

        res.status(201).json(flashcard);
    } catch (error) {
        console.error('Error creating flashcard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id/performance', async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect, timeTaken, userAnswer } = req.body;

        const flashcard = await Flashcard.findById(id);
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        flashcard.totalAttempts += 1;
        if (isCorrect) {
            flashcard.correctAttempts += 1;
        } else {
            flashcard.incorrectAttempts += 1;
        }

        await flashcard.save();
        res.json({message: 'Flashcard performance updated successfully', flashcard });
    } catch (error) {
        console.error('Error updating flashcard performance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;