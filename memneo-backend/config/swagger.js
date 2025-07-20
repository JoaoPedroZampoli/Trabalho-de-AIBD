const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Memneo API - Sistema de Flashcards',
      version: '1.0.0',
      description: 'API completa para sistema de flashcards com analytics avançados',
      contact: {
        name: 'API Support',
        email: 'support@memneo.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-url.com' 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            curso: { type: 'string' },
            nivel: { type: 'string' },
            accuracy: { type: 'number' },
            streak: { type: 'number' },
            totalCards: { type: 'number' },
            totalCorrect: { type: 'number' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            color: { type: 'string' },
            icon: { type: 'string' },
            totalCards: { type: 'number' },
            totalCorrect: { type: 'number' },
            totalIncorrect: { type: 'number' }
          }
        },
        Flashcard: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            answer: { type: 'string' },
            category: { type: 'string' },
            difficulty: { type: 'string', enum: ['Fácil', 'Médio', 'Difícil'] },
            tags: { type: 'array', items: { type: 'string' } },
            totalAttempts: { type: 'number' },
            correctAttempts: { type: 'number' },
            incorrectAttempts: { type: 'number' }
          }
        },
        StudySession: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string' },
            category: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            totalTime: { type: 'number' },
            totalCorrect: { type: 'number' },
            accuracy: { type: 'number' },
            answers: { type: 'array' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'], // Caminhos para os arquivos que contêm anotações Swagger
};

const specs = swaggerJSDoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Memneo API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  })
};
