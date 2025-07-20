const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Flashcard = require('../models/Flashcard');
const { auth } = require('../middleware/auth');

// Obter todas as categorias
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar categorias',
            error: error.message
        });
    }
});

// Obter categoria por ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar categoria',
            error: error.message
        });
    }
});

// Criar nova categoria
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        // Verificar se já existe uma categoria com o mesmo nome
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Já existe uma categoria com este nome' });
        }

        const category = new Category({
            name,
            description,
            color,
            icon
        });

        await category.save();
        res.status(201).json({
            message: 'Categoria criada com sucesso',
            category
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao criar categoria',
            error: error.message
        });
    }
});

// Atualizar categoria
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;
        
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, color, icon },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        res.json({
            message: 'Categoria atualizada com sucesso',
            category
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar categoria',
            error: error.message
        });
    }
});

// Deletar categoria
router.delete('/:id', auth, async (req, res) => {
    try {
        // Verificar se existem flashcards usando esta categoria
        const flashcardsCount = await Flashcard.countDocuments({ category: req.params.id });
        if (flashcardsCount > 0) {
            return res.status(400).json({
                message: 'Não é possível deletar categoria que possui flashcards associados'
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao deletar categoria',
            error: error.message
        });
    }
});

// Obter estatísticas da categoria
router.get('/:id/stats', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        const flashcardsCount = await Flashcard.countDocuments({ category: req.params.id });
        const accuracy = category.totalCorrect + category.totalIncorrect > 0 
            ? ((category.totalCorrect / (category.totalCorrect + category.totalIncorrect)) * 100).toFixed(1)
            : 0;

        res.json({
            name: category.name,
            totalCards: flashcardsCount,
            totalCorrect: category.totalCorrect,
            totalIncorrect: category.totalIncorrect,
            accuracy: parseFloat(accuracy)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter estatísticas da categoria',
            error: error.message
        });
    }
});

// Obter flashcards de uma categoria
router.get('/:id/flashcards', async (req, res) => {
    try {
        const { page = 1, limit = 10, difficulty } = req.query;
        
        let filter = { category: req.params.id };
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const flashcards = await Flashcard.find(filter)
            .populate('category', 'name color')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Flashcard.countDocuments(filter);

        res.json({
            flashcards,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar flashcards da categoria',
            error: error.message
        });
    }
});

module.exports = router;
