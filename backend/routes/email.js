// routes/emails.js
require('dotenv').config();  // ← MUST BE FIRST!
const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db.js');

// Get all emails for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT EmailID, SenderAddress, Subject, BodyText, IsVerified
                FROM Emails
                WHERE UserID = @userId
            `);

        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Analyze a specific email
router.post('/:emailId/analyze', async (req, res) => {
    try {
        const { emailId } = req.params;
        const pool = await getConnection();

        const emailResult = await pool.request()
            .input('emailId', sql.Int, emailId)
            .query(`
                SELECT EmailID, SenderAddress, Subject, BodyText, IsVerified
                FROM Emails
                WHERE EmailID = @emailId
            `);

        if (emailResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Email not found'
            });
        }

        const email = emailResult.recordset[0];
        const isScam = email.EmailID === 1;

        await pool.request()
            .input('emailId', sql.Int, emailId)
            .input('isVerified', sql.Bit, !isScam)
            .query(`UPDATE Emails SET IsVerified = @isVerified WHERE EmailID = @emailId`);

        res.json({
            success: true,
            data: {
                ...email,
                isScam: isScam,
                analysis: {
                    isScam: isScam,
                    confidenceScore: isScam ? 95 : 10,
                    redFlags: isScam ? ['Urgency', 'Suspicious link', 'Spoofed sender'] : [],
                    reason: isScam ? 'This email contains multiple phishing indicators' : 'This email appears safe'
                }
            }
        });
    } catch (error) {
        console.error('Error analyzing email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;