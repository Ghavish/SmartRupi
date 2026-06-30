// routes/transactions.js
require('dotenv').config();  // ← MUST BE FIRST!
const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db.js');

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📊 Fetching transactions for user: ${userId}`);  // Debug log
        
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT TransactionID, Date, Amount, Type, Category, Merchant
                FROM Transactions
                WHERE UserID = @userId
                ORDER BY Date DESC
            `);
        
        console.log(`✅ Found ${result.recordset.length} transactions`);
        
        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('❌ Error fetching transactions:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get spending summary
router.get('/:userId/summary', async (req, res) => {
    try {
        const { userId } = req.params;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    SUM(CASE WHEN Type = 'Credit' THEN Amount ELSE 0 END) as TotalIncome,
                    SUM(CASE WHEN Type = 'Debit' THEN Amount ELSE 0 END) as TotalExpenses,
                    COUNT(*) as TransactionCount
                FROM Transactions
                WHERE UserID = @userId
            `);
        
        const summary = result.recordset[0];
        const leftover = summary.TotalIncome - summary.TotalExpenses;
        
        res.json({
            success: true,
            data: {
                ...summary,
                leftover: leftover
            }
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;