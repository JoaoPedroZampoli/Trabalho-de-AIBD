const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const swagger = require('./config/swagger');

const userRoutes = require('./routes/users');
const flashcardRoutes = require('./routes/flashcards');
const categoryRoutes = require('./routes/categories');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Memneo API - Sistema de Flashcards',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            users: '/api/users',
            flashcards: '/api/flashcards', 
            categories: '/api/categories',
            sessions: '/api/sessions',
            analytics: '/api/analytics'
        }
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});