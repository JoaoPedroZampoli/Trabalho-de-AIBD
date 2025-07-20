const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Category = require('./models/Category');
const Flashcard = require('./models/Flashcard');
const User = require('./models/User');

const categories = [
    {
        name: 'Matemática',
        description: 'Conceitos fundamentais de matemática',
        color: '#3B82F6',
        icon: '🧮'
    },
    {
        name: 'Ciências',
        description: 'Conceitos de física, química e biologia',
        color: '#10B981',
        icon: '🔬'
    },
    {
        name: 'História',
        description: 'Eventos históricos importantes',
        color: '#F59E0B',
        icon: '📚'
    },
    {
        name: 'Geografia',
        description: 'Geografia mundial e do Brasil',
        color: '#8B5CF6',
        icon: '🌍'
    },
    {
        name: 'Literatura',
        description: 'Literatura brasileira e mundial',
        color: '#EF4444',
        icon: '📖'
    }
];

const flashcards = [
    // Matemática
    {
        question: 'Qual é o resultado de 2² + 3²?',
        options: ['10', '13', '15', '12'],
        answer: '13',
        difficulty: 'Fácil',
        tags: ['álgebra', 'potências']
    },
    {
        question: 'Qual é a fórmula da área de um círculo?',
        options: ['πr²', '2πr', 'πd', 'r²'],
        answer: 'πr²',
        difficulty: 'Médio',
        tags: ['geometria', 'área']
    },
    
    // Ciências
    {
        question: 'Qual é o símbolo químico do ouro?',
        options: ['Au', 'Ag', 'Fe', 'Cu'],
        answer: 'Au',
        difficulty: 'Fácil',
        tags: ['química', 'elementos']
    },
    {
        question: 'Qual é a velocidade da luz no vácuo?',
        options: ['300.000 km/s', '299.792.458 m/s', '300.000.000 m/s', '250.000 km/s'],
        answer: '299.792.458 m/s',
        difficulty: 'Difícil',
        tags: ['física', 'constantes']
    },
    
    // História
    {
        question: 'Em que ano foi proclamada a Independência do Brasil?',
        options: ['1820', '1821', '1822', '1823'],
        answer: '1822',
        difficulty: 'Fácil',
        tags: ['brasil', 'independência']
    },
    {
        question: 'Quem foi o primeiro presidente do Brasil?',
        options: ['Getúlio Vargas', 'Deodoro da Fonseca', 'Floriano Peixoto', 'Prudente de Morais'],
        answer: 'Deodoro da Fonseca',
        difficulty: 'Médio',
        tags: ['brasil', 'república']
    },
    
    // Geografia
    {
        question: 'Qual é o maior país da América do Sul?',
        options: ['Argentina', 'Brasil', 'Peru', 'Colômbia'],
        answer: 'Brasil',
        difficulty: 'Fácil',
        tags: ['américa do sul', 'países']
    },
    {
        question: 'Qual é a capital da Austrália?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        answer: 'Canberra',
        difficulty: 'Médio',
        tags: ['oceania', 'capitais']
    },
    
    // Literatura
    {
        question: 'Quem escreveu "Dom Casmurro"?',
        options: ['José de Alencar', 'Machado de Assis', 'Clarice Lispector', 'Guimarães Rosa'],
        answer: 'Machado de Assis',
        difficulty: 'Fácil',
        tags: ['literatura brasileira', 'realismo']
    },
    {
        question: 'Qual é o primeiro livro da série Harry Potter?',
        options: ['A Pedra Filosofal', 'A Câmara Secreta', 'O Prisioneiro de Azkaban', 'O Cálice de Fogo'],
        answer: 'A Pedra Filosofal',
        difficulty: 'Fácil',
        tags: ['literatura fantástica', 'harry potter']
    }
];

async function seedDatabase() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado ao MongoDB');

        // Limpar dados existentes (opcional)
        await Category.deleteMany({});
        await Flashcard.deleteMany({});
        await User.deleteMany({});
        console.log('Dados anteriores removidos');

        // Criar usuário padrão para associar aos flashcards
        // O middleware pre('save') do modelo User fará o hash automaticamente
        const defaultUser = new User({
            name: 'Administrador',
            email: 'admin@memneo.com',
            password: 'admin123', // Senha em texto plano - o middleware fará o hash
            curso: 'Administração',
            nivel: 'Superior'
        });
        await defaultUser.save();
        console.log('Usuário padrão criado');

        // Inserir categorias
        const createdCategories = await Category.insertMany(categories);
        console.log('Categorias criadas:', createdCategories.length);

        // Criar um mapa de categorias por nome
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Inserir flashcards com usuário criador
        const flashcardsWithCategories = [
            // Matemática
            { ...flashcards[0], category: categoryMap['Matemática'], createdBy: defaultUser._id },
            { ...flashcards[1], category: categoryMap['Matemática'], createdBy: defaultUser._id },
            
            // Ciências
            { ...flashcards[2], category: categoryMap['Ciências'], createdBy: defaultUser._id },
            { ...flashcards[3], category: categoryMap['Ciências'], createdBy: defaultUser._id },
            
            // História
            { ...flashcards[4], category: categoryMap['História'], createdBy: defaultUser._id },
            { ...flashcards[5], category: categoryMap['História'], createdBy: defaultUser._id },
            
            // Geografia
            { ...flashcards[6], category: categoryMap['Geografia'], createdBy: defaultUser._id },
            { ...flashcards[7], category: categoryMap['Geografia'], createdBy: defaultUser._id },
            
            // Literatura
            { ...flashcards[8], category: categoryMap['Literatura'], createdBy: defaultUser._id },
            { ...flashcards[9], category: categoryMap['Literatura'], createdBy: defaultUser._id }
        ];

        const createdFlashcards = await Flashcard.insertMany(flashcardsWithCategories);
        console.log('Flashcards criados:', createdFlashcards.length);

        // Atualizar contadores de cards nas categorias
        for (const category of createdCategories) {
            const cardCount = flashcardsWithCategories.filter(
                card => card.category.toString() === category._id.toString()
            ).length;
            
            await Category.findByIdAndUpdate(category._id, {
                totalCards: cardCount
            });
        }

        console.log('Database seeded successfully!');
        console.log('✅ Pronto para usar o sistema de flashcards!');
        console.log(`👤 Usuário padrão: admin@memneo.com / admin123`);
        
    } catch (error) {
        console.error('Erro ao popular o banco de dados:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
