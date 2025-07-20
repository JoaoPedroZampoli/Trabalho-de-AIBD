const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');

// Obter todos os flashcards com filtros
router.get('/', async (req, res) => {
    try {
        const { category, difficulty, page = 1, limit = 10, search } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                return res.status(400).json({ error: 'Categoria inválida' });
            }
        }
        
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (search) {
            filter.$or = [
                { question: { $regex: search, $options: 'i' } },
                { answer: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const flashcards = await Flashcard.find(filter)
            .populate('category', 'name color')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Flashcard.countDocuments(filter);

        const formattedFlashcards = flashcards.map(flashcard => ({
            id: flashcard._id,
            question: flashcard.question,
            options: flashcard.options,
            answer: flashcard.answer,
            category: flashcard.category.name,
            categoryColor: flashcard.category.color,
            difficulty: flashcard.difficulty,
            tags: flashcard.tags,
            totalAttempts: flashcard.totalAttempts,
            correctAttempts: flashcard.correctAttempts,
            incorrectAttempts: flashcard.incorrectAttempts,
            accuracy: flashcard.totalAttempts > 0 
                ? ((flashcard.correctAttempts / flashcard.totalAttempts) * 100).toFixed(1)
                : 0
        }));

        res.json({
            flashcards: formattedFlashcards,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Erro ao buscar flashcards:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter flashcard por ID
router.get('/:id', async (req, res) => {
    try {
        const flashcard = await Flashcard.findById(req.params.id)
            .populate('category', 'name color');
        
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard não encontrado' });
        }

        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar novo flashcard
router.post('/', auth, async (req, res) => {
    try {
        const { question, options, answer, categoryId, difficulty, tags } = req.body;

        // Verificar se a categoria existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Categoria não encontrada' });
        }

        const flashcard = new Flashcard({
            question,
            options,
            answer,
            category: categoryId,
            difficulty,
            tags: tags || []
        });

        await flashcard.save();
        await flashcard.populate('category', 'name color');

        // Atualizar contador de cards na categoria
        category.totalCards += 1;
        await category.save();

        res.status(201).json({
            message: 'Flashcard criado com sucesso',
            flashcard
        });
    } catch (error) {
        console.error('Erro ao criar flashcard:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar flashcard
router.put('/:id', auth, async (req, res) => {
    try {
        const { question, options, answer, categoryId, difficulty, tags } = req.body;
        
        const flashcard = await Flashcard.findByIdAndUpdate(
            req.params.id,
            { question, options, answer, category: categoryId, difficulty, tags },
            { new: true }
        ).populate('category', 'name color');

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard não encontrado' });
        }

        res.json({
            message: 'Flashcard atualizado com sucesso',
            flashcard
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar flashcard
router.delete('/:id', auth, async (req, res) => {
    try {
        const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
        
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard não encontrado' });
        }

        // Atualizar contador de cards na categoria
        await Category.findByIdAndUpdate(
            flashcard.category,
            { $inc: { totalCards: -1 } }
        );

        res.json({ message: 'Flashcard deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar performance do flashcard
router.patch('/:id/performance', async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect, timeTaken, userAnswer } = req.body;

        const flashcard = await Flashcard.findById(id);
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard não encontrado' });
        }

        flashcard.totalAttempts += 1;
        if (isCorrect) {
            flashcard.correctAttempts += 1;
            
            // Atualizar categoria
            await Category.findByIdAndUpdate(
                flashcard.category,
                { $inc: { totalCorrect: 1 } }
            );
        } else {
            flashcard.incorrectAttempts += 1;
            
            // Atualizar categoria
            await Category.findByIdAndUpdate(
                flashcard.category,
                { $inc: { totalIncorrect: 1 } }
            );
        }

        await flashcard.save();
        
        res.json({
            message: 'Performance do flashcard atualizada com sucesso',
            flashcard: {
                id: flashcard._id,
                totalAttempts: flashcard.totalAttempts,
                correctAttempts: flashcard.correctAttempts,
                incorrectAttempts: flashcard.incorrectAttempts,
                accuracy: flashcard.totalAttempts > 0 
                    ? ((flashcard.correctAttempts / flashcard.totalAttempts) * 100).toFixed(1)
                    : 0
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar performance do flashcard:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter flashcards aleatórios para estudo
router.get('/study/random', async (req, res) => {
    try {
        const { category, difficulty, limit = 10 } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const flashcards = await Flashcard.aggregate([
            { $match: filter },
            { $sample: { size: parseInt(limit) } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' }
        ]);

        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;