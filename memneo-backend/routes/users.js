const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - curso
 *               - nivel
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "senha123"
 *               curso:
 *                 type: string
 *                 example: "Engenharia"
 *               nivel:
 *                 type: string
 *                 example: "Graduação"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação ou usuário já existe
 *       500:
 *         description: Erro interno do servidor
 */

// Registrar usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, curso, nivel } = req.body;

        // Verificar se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe com este email' });
        }

        // Criar usuário (o middleware pre('save') fará o hash da senha automaticamente)
        const user = new User({
            name,
            email,
            password, // Senha em texto plano - o middleware fará o hash
            curso,
            nivel
        });

        await user.save();

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                curso: user.curso,
                nivel: user.nivel
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao criar usuário',
            error: error.message
        });
    }
});

// Login
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentativa de login:', { email, password: '***' });

        // Verificar se o usuário existe
        const user = await User.findOne({ email });
        console.log('Usuário encontrado:', user ? 'Sim' : 'Não');
        
        if (!user) {
            console.log('Usuário não encontrado para email:', email);
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        console.log('Verificando senha...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Senha confere:', isMatch);
        
        if (!isMatch) {
            console.log('Senha incorreta para usuário:', email);
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Atualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Login bem-sucedido para:', email);
        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                curso: user.curso,
                nivel: user.nivel,
                accuracy: user.accuracy,
                streak: user.streak,
                totalCards: user.totalCards
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            message: 'Erro ao fazer login',
            error: error.message
        });
    }
});

// Obter perfil do usuário
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter perfil',
            error: error.message
        });
    }
});

// Atualizar perfil do usuário
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, curso, nivel } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, curso, nivel },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            message: 'Perfil atualizado com sucesso',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar perfil',
            error: error.message
        });
    }
});

// Obter estatísticas do usuário
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            accuracy: user.accuracy,
            streak: user.streak,
            totalCards: user.totalCards,
            totalCorrect: user.totalCorrect,
            studiedToday: user.studiedToday || 0
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter estatísticas',
            error: error.message
        });
    }
});

// Adicionar flashcard aos favoritos
router.post('/favorites/:flashcardId', auth, async (req, res) => {
    try {
        const { flashcardId } = req.params;
        
        // Verificar se o flashcard existe
        const flashcard = await Flashcard.findById(flashcardId);
        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard não encontrado' });
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o flashcard já está nos favoritos
        const isAlreadyFavorite = user.favoriteFlashcards.some(fav => 
            fav.toString() === flashcardId.toString()
        );
        
        if (isAlreadyFavorite) {
            return res.status(400).json({ message: 'Flashcard já está nos favoritos' });
        }

        user.favoriteFlashcards.push(flashcardId);
        await user.save();

        res.json({ 
            message: 'Flashcard adicionado aos favoritos',
            favoriteCount: user.favoriteFlashcards.length
        });
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({
            message: 'Erro ao adicionar favorito',
            error: error.message
        });
    }
});

// Remover flashcard dos favoritos
router.delete('/favorites/:flashcardId', auth, async (req, res) => {
    try {
        const { flashcardId } = req.params;
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const initialCount = user.favoriteFlashcards.length;
        user.favoriteFlashcards = user.favoriteFlashcards.filter(
            fav => fav.toString() !== flashcardId.toString()
        );
        
        if (user.favoriteFlashcards.length === initialCount) {
            return res.status(400).json({ message: 'Flashcard não estava nos favoritos' });
        }
        
        await user.save();

        res.json({ 
            message: 'Flashcard removido dos favoritos',
            favoriteCount: user.favoriteFlashcards.length
        });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({
            message: 'Erro ao remover favorito',
            error: error.message
        });
    }
});

// Obter flashcards favoritos
router.get('/favorites', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate({
                path: 'favoriteFlashcards',
                populate: {
                    path: 'category',
                    select: 'name color'
                }
            });
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const favoriteFlashcards = user.favoriteFlashcards.map(flashcard => ({
            _id: flashcard._id,
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
                : 0,
            isFavorite: true
        }));

        res.json({ flashcards: favoriteFlashcards });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter favoritos',
            error: error.message
        });
    }
});

module.exports = router;
