// src/api/index.ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── BAND AI Dispatcher ───────────────────────────────────────────────────────
const swarmConfig = {
    scam_analyst: { roomId: process.env.EXPO_PUBLIC_BAND_SCAM_ROOM_ID, uuid: process.env.EXPO_PUBLIC_SCAM_ANALYST_UUID },
    fin_auditor: { roomId: process.env.EXPO_PUBLIC_BAND_AUDIT_ROOM_ID, uuid: process.env.EXPO_PUBLIC_FINANCIAL_AUDITOR_UUID },
    loan_officer: { roomId: process.env.EXPO_PUBLIC_BAND_LOAN_ROOM_ID, uuid: process.env.EXPO_PUBLIC_LOAN_OFFICER_UUID },
};

export async function dispatchToAgent(agentTarget: string, taskDescription: string) {
    const target = swarmConfig[agentTarget as keyof typeof swarmConfig];
    const bandApiUrl = process.env.EXPO_PUBLIC_BAND_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_COMMUNICATION_AGENT_API_KEY;

    await fetch(`${bandApiUrl}/agent/chats/${target.roomId}/messages`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey!, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: { content: `TASK_REQUEST: ${taskDescription}`, mentions: [{ id: target.uuid }] }
        })
    });

    for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const res = await fetch(`${bandApiUrl}/agent/chats/${target.roomId}/messages?t=${Date.now()}`, {
            headers: { 'X-API-Key': apiKey!, 'Cache-Control': 'no-cache' }
        });

        const data = await res.json();

        if (data && data.messages && data.messages.length > 0) {
            for (const msg of data.messages) {
                if (msg.sender && msg.sender.id === target.uuid && msg.content) {
                    const jsonMatch = msg.content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        console.log(`✅ SUCCESS on attempt ${i + 1}! Data extracted.`);
                        return JSON.parse(jsonMatch[0]);
                    }
                }
            }
        }
        console.log(`⏳ Waiting for agent... (Attempt ${i + 1}/20)`);
    }

    throw new Error("Agent timed out.");
}

// ─── Emails ──────────────────────────────────────────────────────────────────
export async function getEmails(userId: number) {
    // FAKE DATA 
    return [
        { EmailID: 1, SenderAddress: 'security-alert@mcb-secure-verify.com', Subject: 'URGENT: Your MCB account has been suspended', BodyText: 'Dear Raj, unusual activity detected on account ending in 3456. Verify now or your Rs 45,800 will be frozen: http://mcb-account-verify.net', IsVerified: false },
        { EmailID: 2, SenderAddress: 'no-reply@mcb.mu', Subject: 'Your MCB eStatement for May 2025 is ready', BodyText: 'Dear Raj, your eStatement for May 2025 is available. Log in at https://www.mcb.mu to view it.', IsVerified: true },
        { EmailID: 3, SenderAddress: 'winner-promo@winner-deals.net', Subject: 'You won Rs 50,000!', BodyText: 'Congratulations! Claim your prize now at http://winner-claim-prize.com', IsVerified: false },
        { EmailID: 4, SenderAddress: 'no-reply@myt.mu', Subject: 'Your MyT Bill June 2025', BodyText: 'Dear customer, your MyT bill of Rs 1,299 is due. Pay at https://www.myt.mu', IsVerified: true },
        { EmailID: 5, SenderAddress: 'support@sbm-secure-alert.com', Subject: 'SBM Account Suspended — Act Now', BodyText: 'Verify your SBM account immediately at http://sbm-verify.net or lose access permanently', IsVerified: false },
        { EmailID: 6, SenderAddress: 'noreply@orange.mu', Subject: 'Your Orange Monthly Statement', BodyText: 'Your June statement is ready. View it at https://www.orange.mu', IsVerified: true },
        { EmailID: 7, SenderAddress: 'alert@mcb-security-check.net', Subject: 'Suspicious Login Detected on Your Account', BodyText: 'Someone logged into your MCB account from an unknown device. Confirm it was you: http://mcb-login-check.com', IsVerified: false },
        { EmailID: 8, SenderAddress: 'no-reply@ceb.mu', Subject: 'Your CEB Bill for June 2025', BodyText: 'Dear Mr. Ramdhany, your electricity bill of Rs 3,100 is due by July 15th. Pay at https://www.ceb.mu', IsVerified: true },
    ];

    // REAL FETCH 
    // const response = await fetch(`${BASE_URL}/emails/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch emails');
    // const res = await response.json();
    // return res.data;
}

export async function analyzeEmail(emailId: number, bodyText: string) {
    // Uses BAND AI scam analyst agent
    return dispatchToAgent('scam_analyst', `Analyze this email for scams. EmailID: ${emailId}. Body: ${bodyText}`);
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export async function getTransactions(userId: number) {
    // FAKE DATA
    return [
        { TransactionID: 1, Date: '2025-05-01', Amount: 55000.00, Type: 'Credit', Category: 'Income', Merchant: 'Accenture' },
        { TransactionID: 2, Date: '2025-05-02', Amount: 2850.00, Type: 'Debit', Category: 'Utilities', Merchant: 'CEB' },
        { TransactionID: 3, Date: '2025-05-03', Amount: 1299.00, Type: 'Debit', Category: 'Utilities', Merchant: 'Mauritius Telecom' },
        { TransactionID: 4, Date: '2025-05-04', Amount: 3450.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Bagatelle Mall' },
        { TransactionID: 5, Date: '2025-05-06', Amount: 1800.00, Type: 'Debit', Category: 'Transport', Merchant: 'Shell' },
        { TransactionID: 6, Date: '2025-05-08', Amount: 890.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Dominos Pizza' },
        { TransactionID: 7, Date: '2025-05-09', Amount: 250.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'McDonalds' },
        { TransactionID: 8, Date: '2025-05-10', Amount: 540.00, Type: 'Debit', Category: 'Health', Merchant: 'Pharmacie Centrale' },
        { TransactionID: 9, Date: '2025-05-12', Amount: 599.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Netflix' },
        { TransactionID: 10, Date: '2025-05-14', Amount: 2100.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Winner' },
        { TransactionID: 11, Date: '2025-05-16', Amount: 350.00, Type: 'Debit', Category: 'Transport', Merchant: 'Uber' },
        { TransactionID: 12, Date: '2025-05-17', Amount: 4000.00, Type: 'Debit', Category: 'Gaming', Merchant: 'Steam Games' },
        { TransactionID: 13, Date: '2025-05-18', Amount: 1650.00, Type: 'Debit', Category: 'Shopping', Merchant: 'Jumbo Score' },
        { TransactionID: 14, Date: '2025-05-20', Amount: 800.00, Type: 'Debit', Category: 'Health', Merchant: 'Impact Fitness' },
        { TransactionID: 15, Date: '2025-05-22', Amount: 420.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'KFC' },
        { TransactionID: 16, Date: '2025-05-24', Amount: 5000.00, Type: 'Debit', Category: 'Transfer', Merchant: 'MCB Internal' },
        { TransactionID: 17, Date: '2025-05-26', Amount: 150.00, Type: 'Debit', Category: 'Services', Merchant: 'Mauritius Post' },
        { TransactionID: 18, Date: '2025-05-28', Amount: 1850.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Bhoj' },
        { TransactionID: 19, Date: '2025-05-30', Amount: 2300.00, Type: 'Debit', Category: 'Shopping', Merchant: 'Amazon' },
        { TransactionID: 20, Date: '2025-06-01', Amount: 55000.00, Type: 'Credit', Category: 'Income', Merchant: 'Accenture' },
        { TransactionID: 21, Date: '2025-06-02', Amount: 3100.00, Type: 'Debit', Category: 'Utilities', Merchant: 'CEB' },
        { TransactionID: 22, Date: '2025-06-03', Amount: 750.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Canal+' },
        { TransactionID: 23, Date: '2025-06-04', Amount: 399.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Spotify Premium' },
        { TransactionID: 24, Date: '2025-06-05', Amount: 4200.00, Type: 'Debit', Category: 'Shopping', Merchant: 'H&M Bagatelle' },
        { TransactionID: 25, Date: '2025-06-07', Amount: 1750.00, Type: 'Debit', Category: 'Transport', Merchant: 'Total' },
        { TransactionID: 26, Date: '2025-06-09', Amount: 760.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Pizza Hut' },
        { TransactionID: 27, Date: '2025-06-11', Amount: 1980.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Winner' },
        { TransactionID: 28, Date: '2025-06-13', Amount: 800.00, Type: 'Debit', Category: 'Health', Merchant: 'Impact Fitness' },
        { TransactionID: 29, Date: '2025-06-15', Amount: 599.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Netflix' },
        { TransactionID: 30, Date: '2025-06-17', Amount: 680.00, Type: 'Debit', Category: 'Health', Merchant: 'Pharmacie Nouvelle' },
        { TransactionID: 31, Date: '2025-06-19', Amount: 420.00, Type: 'Debit', Category: 'Transport', Merchant: 'Uber' },
        { TransactionID: 32, Date: '2025-06-21', Amount: 5000.00, Type: 'Debit', Category: 'Transfer', Merchant: 'MCB Internal' },
        { TransactionID: 33, Date: '2025-06-24', Amount: 3000.00, Type: 'Credit', Category: 'Bonus', Merchant: 'Accenture' },
    ];

    // REAL FETCH 
    // const response = await fetch(`${BASE_URL}/transactions/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch transactions');
    // const res = await response.json();
    // return res.data;
}

// ─── Loans ───────────────────────────────────────────────────────────────────
export async function getLoanOffers(userId: number) {
    // FAKE DATA
    return [
        { OfferID: 1, BankName: 'MCB', InterestRate: 10.50, MaxAmount: 500000, RequiredMinimumIncome: 20000, LoanType: 'Personal' },
        { OfferID: 2, BankName: 'MCB', InterestRate: 6.75, MaxAmount: 5000000, RequiredMinimumIncome: 50000, LoanType: 'Home' },
        { OfferID: 3, BankName: 'MCB', InterestRate: 8.25, MaxAmount: 800000, RequiredMinimumIncome: 25000, LoanType: 'Car' },
        { OfferID: 4, BankName: 'SBM', InterestRate: 7.00, MaxAmount: 300000, RequiredMinimumIncome: 15000, LoanType: 'Education' },
        { OfferID: 5, BankName: 'MCB', InterestRate: 9.50, MaxAmount: 2000000, RequiredMinimumIncome: 40000, LoanType: 'Business' },
    ];

    // REAL FETCH
    // const response = await fetch(`${BASE_URL}/loans/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch loan offers');
    // const res = await response.json();
    // return res.data;
}