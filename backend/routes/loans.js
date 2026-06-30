// routes/loans.js
require('dotenv').config();  // ← MUST BE FIRST!
const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db.js');

// Get all loan offers
router.get('/offers', async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT OfferID, BankName, InterestRate, MaxAmount, 
                       RequiredMinimumIncome, LoanType
                FROM LoanOffers
                ORDER BY InterestRate ASC
            `);

        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching loan offers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get personalized loan recommendations
router.post('/recommend/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const pool = await getConnection();

        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT UserID, FullName, MonthlyIncome, CurrentBalance, RiskTolerance
                FROM Users
                WHERE UserID = @userId
            `);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = userResult.recordset[0];

        const summaryResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    SUM(CASE WHEN Type = 'Credit' THEN Amount ELSE 0 END) as TotalIncome,
                    SUM(CASE WHEN Type = 'Debit' THEN Amount ELSE 0 END) as TotalExpenses
                FROM Transactions
                WHERE UserID = @userId
            `);

        const summary = summaryResult.recordset[0];
        const monthlySurplus = summary.TotalIncome - summary.TotalExpenses;

        const loanResult = await pool.request()
            .query(`
                SELECT OfferID, BankName, InterestRate, MaxAmount, 
                       RequiredMinimumIncome, LoanType
                FROM LoanOffers
            `);

        const bestMatch = loanResult.recordset.find(loan =>
            loan.RequiredMinimumIncome <= user.MonthlyIncome
        );

        res.json({
            success: true,
            data: {
                user: {
                    name: user.FullName,
                    monthlyIncome: user.MonthlyIncome,
                    monthlySurplus: monthlySurplus,
                    riskTolerance: user.RiskTolerance
                },
                recommendations: {
                    bestMatch: bestMatch ? {
                        bank: bestMatch.BankName,
                        interestRate: bestMatch.InterestRate,
                        maxAmount: bestMatch.MaxAmount,
                        loanType: bestMatch.LoanType,
                        approvalOdds: '95%'
                    } : null,
                    alternatives: loanResult.recordset
                        .filter(l => l.OfferID !== (bestMatch?.OfferID || 0))
                        .slice(0, 2)
                        .map(l => `${l.BankName} (${l.InterestRate}%)`),
                    advice: bestMatch ?
                        `Based on your monthly surplus of Rs ${monthlySurplus.toLocaleString()}, you qualify for the ${bestMatch.BankName} ${bestMatch.LoanType} loan.` :
                        'You may need to increase your income to qualify for a loan.'
                }
            }
        });
    } catch (error) {
        console.error('Error recommending loans:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;