// server.js - Main Express Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

// CORS - CRITICAL for Expo app to connect
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const transactionRoutes = require('./routes/transactions');
const emailRoutes = require('./routes/emails');
const loanRoutes = require('./routes/loans');

app.use('/api/transactions', transactionRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/loans', loanRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SmartRupi Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartRupi Backend running on http://0.0.0.0:${PORT}`);
    console.log(`Connect Expo app to: http://[YOUR_IP]:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});