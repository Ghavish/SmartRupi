// src/api/index.ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── BAND AI Dispatcher ───────────────────────────────────────────────────────
const swarmConfig = {
    scam_analyst: { roomId: process.env.EXPO_PUBLIC_BAND_SCAM_ROOM_ID, uuid: process.env.EXPO_PUBLIC_SCAM_ANALYST_UUID },
    fin_auditor: { roomId: process.env.EXPO_PUBLIC_BAND_AUDIT_ROOM_ID, uuid: process.env.EXPO_PUBLIC_FINANCIAL_AUDITOR_UUID },
    loan_officer: { roomId: process.env.EXPO_PUBLIC_BAND_LOAN_ROOM_ID, uuid: process.env.EXPO_PUBLIC_LOAN_OFFICER_UUID },
};

// Helper to generate a unique, URL-safe ID without crypto
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export async function dispatchToAgent(agentTarget: string, taskDescription: string) {
    const target = swarmConfig[agentTarget as keyof typeof swarmConfig];
    const bandApiUrl = process.env.EXPO_PUBLIC_BAND_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_COMMUNICATION_AGENT_API_KEY;
    const localApiBase = process.env.EXPO_PUBLIC_API_URL_FAST_API; // Ensure this matches FastAPI port

    // 1. Generate unique request ID
    const requestId = generateUniqueId();

    // 2. Send task request with embedded ID for the agent to parse
    await fetch(`${bandApiUrl}/agent/chats/${target.roomId}/messages`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey!, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: { 
                content: `ID: ${requestId} | TASK_REQUEST: ${taskDescription}`, 
                mentions: [{ id: target.uuid }] 
            }
        })
    });

    // 3. Poll your FastAPI server
     for (let i = 0; i < 10; i++) {
        try {
            const res = await fetch(`${localApiBase}/api/get-log?request_id=${"85a8942f-ea69-48c8-9429-6a5098cb2ac6"}`);
            
            // Log the raw response status
            console.log(`Polling status: ${res.status}`);
            
            const data = await res.json();
            console.log("Polling Data:", data); // Is this actually printing 'message'?

            // If the database returns a message that is NOT "Pending"
            if (data && data.message && data.message !== "Pending") {
                console.log(`✅ Final alert captured for ${"85a8942f-ea69-48c8-9429-6a5098cb2ac6"}`);
                return data.message;
            }
        } catch (e) {
            console.error("Polling fetch error:", e);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error("Agent timed out: No log entry found in database.");
}

// ===================== USERS =====================
export async function getUsers() {
  // PRESET DATA
  return [
    { UserID: 1, FullName: 'Raj Patel', Email: 'rajpatel@gmail.com', MonthlyIncome: 55000.00, CurrentBalance: 45800.00, RiskTolerance: 'Medium' },
    { UserID: 2, FullName: 'Sira Sharma', Email: 'sirasharma@gmail.com', MonthlyIncome: 70000.00, CurrentBalance: 40000.00, RiskTolerance: 'High' },
  ];
 
  // REAL FETCH
  // const response = await fetch(`${BASE_URL}/users`);
  // if (!response.ok) throw new Error('Failed to fetch users');
  // const res = await response.json();
  // return res.data;
}

// ===================== EMAILS =====================
export async function getEmails(userId: number) {
    // PRESET DATA 
    return [
       {

        UserID: 1,

        EmailID: 1,

        SenderAddress: 'security-alert@mcb-secure-verify.com',

        Subject: 'URGENT: Your MCB account has been suspended',

        BodyText: 'Dear Raj, unusual activity detected on account ending in 3456. Verify now or your Rs 45,800 will be frozen: http://mcb-account-verify.net',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 2,

        SenderAddress: 'no-reply@mcb.mu',

        Subject: 'Your MCB eStatement for May 2025 is ready',

        BodyText: 'Dear Raj, your eStatement for May 2025 is available. Log in at https://www.mcb.mu to view it.',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 3,

        SenderAddress: 'winner-promo@winner-deals.net',

        Subject: 'You won Rs 50,000!',

        BodyText: 'Congratulations! Claim your prize now at http://winner-claim-prize.com',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 4,

        SenderAddress: 'no-reply@myt.mu',

        Subject: 'Your MyT Bill June 2025',

        BodyText: 'Dear customer, your MyT bill of Rs 1,299 is due. Pay at https://www.myt.mu',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 5,

        SenderAddress: 'support@sbm-secure-alert.com',

        Subject: 'SBM Account Suspended - Act Now',

        BodyText: 'Verify your SBM account immediately at http://sbm-verify.net or lose access permanently',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 6,

        SenderAddress: 'noreply@orange.mu',

        Subject: 'Your Orange Monthly Statement',

        BodyText: 'Your June statement is ready. View it at https://www.orange.mu',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 7,

        SenderAddress: 'alert@mcb-security-check.net',

        Subject: 'Suspicious Login Detected on Your Account',

        BodyText: 'Someone logged into your MCB account from an unknown device. Confirm it was you: http://mcb-login-check.com',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 8,

        SenderAddress: 'no-reply@ceb.mu',

        Subject: 'Your CEB Bill for June 2025',

        BodyText: 'Dear Mr. Patel, your electricity bill of Rs 3,100 is due by July 15th. Pay at https://www.ceb.mu',

        IsVerified: 1

        },



        // === FRENCH REAL EMAILS (Legitimate) — 5 rows ===

        {

        UserID: 1,

        EmailID: 9,

        SenderAddress: 'noreply@ceb.mu',

        Subject: 'Votre facture CEB pour juin 2025',

        BodyText: 'Bonjour Monsieur Patel,\n\nVotre facture d\'électricité pour le mois de juin 2025 est disponible.\nMontant dû: Rs 3,100\nDate d\'échéance: 15 juillet 2025\n\nVeuillez vous connecter à votre espace client sur https://www.ceb.mu pour consulter votre facture en détail.\n\nMerci de votre confiance,\nCEB',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 10,

        SenderAddress: 'no-reply@mcb.mu',

        Subject: 'Votre eStatement MCB pour mai 2025',

        BodyText: 'Cher client,\n\nVotre relevé bancaire pour le mois de mai 2025 est disponible sur MCB Juice.\n\nConnectez-vous à l\'application MCB Juice ou à https://www.mcb.mu pour le consulter.\n\nCordialement,\nMCB',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 11,

        SenderAddress: 'service-client@myt.mu',

        Subject: 'Votre facture MyT pour juin 2025',

        BodyText: 'Bonjour,\n\nVotre facture MyT de Rs 1,299 est disponible.\nPayez avant le 30 juin 2025 sur https://www.myt.mu\n\nMerci,\nService client MyT',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 12,

        SenderAddress: 'noreply@orange.mu',

        Subject: 'Votre relevé Orange pour juin 2025',

        BodyText: 'Bonjour,\n\nVotre relevé mensuel Orange est disponible.\nConsultez-le sur https://www.orange.mu\n\nMerci de votre confiance,\nOrange',

        IsVerified: 1

        },

        {

        UserID: 1,

        EmailID: 13,

        SenderAddress: 'info@bagatelle.mu',

        Subject: 'Soldes d\'été chez Bagatelle Mall!',

        BodyText: 'Profitez des soldes d\'été chez Bagatelle Mall!\n\nJusqu\'à 50% de réduction sur les vêtements, chaussures et accessoires.\n\nOffre valable jusqu\'au 31 juillet 2025.\n\nL\'équipe de Bagatelle Mall',

        IsVerified: 1

        },



        // === FRENCH SCAM EMAILS (Phishing) — 5 rows ===

        {

        UserID: 1,

        EmailID: 14,

        SenderAddress: 'securite@mcb-verification.net',

        Subject: 'URGENT: Votre compte MCB a été bloqué',

        BodyText: 'Bonjour,\n\nNous avons détecté une activité suspecte sur votre compte MCB.\nPour des raisons de sécurité, votre compte a été temporairement bloqué.\n\nCliquez sur le lien ci-dessous pour vérifier votre identité et débloquer votre compte:\nhttp://mcb-verification.net/verifier\n\nSi vous ne le faites pas dans les 48 heures, votre compte sera définitivement fermé.\n\nCordialement,\nL\'équipe de sécurité MCB',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 15,

        SenderAddress: 'support@sbm-securite.com',

        Subject: 'Alerte: Accès à votre compte SBM suspendu',

        BodyText: 'Cher client,\n\nNous avons remarqué des tentatives de connexion suspectes sur votre compte SBM.\nVotre accès a été suspendu pour votre protection.\n\nVeuillez confirmer votre identité ici:\nhttp://sbm-securite.com/confirmer\n\nCordialement,\nSupport SBM',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 16,

        SenderAddress: 'service@myt-facture.fr',

        Subject: 'Votre facture MyT est impayée - Action immédiate',

        BodyText: 'Bonjour,\n\nVotre facture MyT de Rs 1,299 n\'a pas été payée.\nSi vous ne payez pas dans les 24 heures, votre ligne sera coupée.\n\nPayez maintenant:\nhttp://myt-facture.fr/payer\n\nMerci,\nService client MyT',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 17,

        SenderAddress: 'securite@banque-mcb.net',

        Subject: 'ALERTE: Votre compte MCB va être fermé',

        BodyText: 'Monsieur Patel,\n\nNous avons détecté des transactions non autorisées sur votre compte MCB.\nPour éviter la fermeture définitive de votre compte, veuillez confirmer vos coordonnées bancaires immédiatement:\n\nhttp://banque-mcb.net/confirmer\n\nNous vous prions de régulariser votre situation sous 24 heures.\n\nService Sécurité MCB',

        IsVerified: 0

        },

        {

        UserID: 1,

        EmailID: 18,

        SenderAddress: 'info@promo-express.com',

        Subject: 'Gagnez Rs 100,000! Offre exclusive',

        BodyText: 'Félicitations!\n\nVous avez été sélectionné pour gagner Rs 100,000!\nPour réclamer votre prix, cliquez sur le lien ci-dessous et entrez vos coordonnées bancaires:\n\nhttp://promo-express.com/gagner\n\nOffre valable 48 heures seulement!\nNe manquez pas cette chance unique!',

        IsVerified: 0

        }

];

    // REAL FETCH 
    // const response = await fetch(`${BASE_URL}/emails/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch emails');
    // const res = await response.json();
    // return res.data;
}


// ===================== TRANSACTIONS =====================
export async function getTransactions(userId: number) {
    // PRESET DATA
    return [
        { TransactionID: 1, UserID: 1, Date: '2025-05-01', Amount: 55000.00, Type: 'Credit', Category: 'Income', Merchant: 'Accenture' },
        { TransactionID: 2, UserID: 1, Date: '2025-05-02', Amount: 2850.00, Type: 'Debit', Category: 'Utilities', Merchant: 'CEB' },
        { TransactionID: 3, UserID: 1, Date: '2025-05-03', Amount: 1299.00, Type: 'Debit', Category: 'Utilities', Merchant: 'Mauritius Telecom' },
        { TransactionID: 4, UserID: 1, Date: '2025-05-04', Amount: 3450.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Bagatelle mall' },
        { TransactionID: 5, UserID: 1, Date: '2025-05-06', Amount: 1800.00, Type: 'Debit', Category: 'Transport', Merchant: 'Shell' },
        { TransactionID: 6, UserID: 1, Date: '2025-05-08', Amount: 890.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Dominos Pizza' },
        { TransactionID: 7, UserID: 1, Date: '2025-05-09', Amount: 250.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'McDonalds' },
        { TransactionID: 8, UserID: 1, Date: '2025-05-10', Amount: 540.00, Type: 'Debit', Category: 'Health', Merchant: 'Pharmacie Centrale' },
        { TransactionID: 9, UserID: 1, Date: '2025-05-12', Amount: 599.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Netflix' },
        { TransactionID: 10, UserID: 1, Date: '2025-05-14', Amount: 2100.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Winner' },
        { TransactionID: 11, UserID: 1, Date: '2025-05-16', Amount: 350.00, Type: 'Debit', Category: 'Transport', Merchant: 'Uber' },
        { TransactionID: 12, UserID: 1, Date: '2025-05-17', Amount: 4000.00, Type: 'Debit', Category: 'Gaming', Merchant: 'Steam Games' },
        { TransactionID: 13, UserID: 1, Date: '2025-05-18', Amount: 1650.00, Type: 'Debit', Category: 'Shopping', Merchant: 'Jumbo Score' },
        { TransactionID: 14, UserID: 1, Date: '2025-05-20', Amount: 800.00, Type: 'Debit', Category: 'Health', Merchant: 'Impact Fitness' },
        { TransactionID: 15, UserID: 1, Date: '2025-05-22', Amount: 420.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'KFC' },
        { TransactionID: 16, UserID: 1, Date: '2025-05-24', Amount: 5000.00, Type: 'Debit', Category: 'Transfer', Merchant: 'MCB Internal' },
        { TransactionID: 17, UserID: 1, Date: '2025-05-26', Amount: 150.00, Type: 'Debit', Category: 'Services', Merchant: 'Mauritius Post' },
        { TransactionID: 18, UserID: 1, Date: '2025-05-28', Amount: 1850.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Bhoj' },
        { TransactionID: 19, UserID: 1, Date: '2025-05-30', Amount: 2300.00, Type: 'Debit', Category: 'Shopping', Merchant: 'Amazon' },
        { TransactionID: 20, UserID: 1, Date: '2025-06-01', Amount: 55000.00, Type: 'Credit', Category: 'Income', Merchant: 'Accenture' },
        { TransactionID: 21, UserID: 1, Date: '2025-06-02', Amount: 3100.00, Type: 'Debit', Category: 'Utilities', Merchant: 'CEB' },
        { TransactionID: 22, UserID: 1, Date: '2025-06-03', Amount: 750.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Canal+' },
        { TransactionID: 23, UserID: 1, Date: '2025-06-04', Amount: 399.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Spotify Premium' },
        { TransactionID: 24, UserID: 1, Date: '2025-06-05', Amount: 4200.00, Type: 'Debit', Category: 'Shopping', Merchant: 'H&M Bagatelle' },
        { TransactionID: 25, UserID: 1, Date: '2025-06-07', Amount: 1750.00, Type: 'Debit', Category: 'Transport', Merchant: 'Total' },
        { TransactionID: 26, UserID: 1, Date: '2025-06-09', Amount: 760.00, Type: 'Debit', Category: 'Food & Dining', Merchant: 'Pizza Hut' },
        { TransactionID: 27, UserID: 1, Date: '2025-06-11', Amount: 1980.00, Type: 'Debit', Category: 'Groceries', Merchant: 'Winner' },
        { TransactionID: 28, UserID: 1, Date: '2025-06-13', Amount: 800.00, Type: 'Debit', Category: 'Health', Merchant: 'Impact Fitness' },
        { TransactionID: 29, UserID: 1, Date: '2025-06-15', Amount: 599.00, Type: 'Debit', Category: 'Entertainment', Merchant: 'Netflix' },
        { TransactionID: 30, UserID: 1, Date: '2025-06-17', Amount: 680.00, Type: 'Debit', Category: 'Health', Merchant: 'Pharmacie Nouvelle' },
        { TransactionID: 31, UserID: 1, Date: '2025-06-19', Amount: 420.00, Type: 'Debit', Category: 'Transport', Merchant: 'Uber' },
        { TransactionID: 32, UserID: 1, Date: '2025-06-21', Amount: 5000.00, Type: 'Debit', Category: 'Transfer', Merchant: 'MCB Internal' },
        { TransactionID: 33, UserID: 1, Date: '2025-06-24', Amount: 3000.00, Type: 'Credit', Category: 'Bonus', Merchant: 'Accenture' },
  ];

    // REAL FETCH 
    // const response = await fetch(`${BASE_URL}/transactions/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch transactions');
    // const res = await response.json();
    // return res.data;
}
// ===================== LOAN OFFERS =====================
export async function getLoanOffers(userId: number) {
    // PRESET DATA
    return [
        { OfferID: 1, BankName: 'MCB', InterestRate: 10.50, MaxAmount: 500000.00, RequiredMinimumIncome: 20000.00, LoanType: 'Personal' },
        { OfferID: 2, BankName: 'MCB', InterestRate: 6.75, MaxAmount: 5000000.00, RequiredMinimumIncome: 50000.00, LoanType: 'Home' },
        { OfferID: 3, BankName: 'MCB', InterestRate: 8.25, MaxAmount: 800000.00, RequiredMinimumIncome: 25000.00, LoanType: 'Car' },
        { OfferID: 4, BankName: 'SBM', InterestRate: 7.00, MaxAmount: 300000.00, RequiredMinimumIncome: 15000.00, LoanType: 'Education' },
        { OfferID: 5, BankName: 'MCB', InterestRate: 9.50, MaxAmount: 2000000.00, RequiredMinimumIncome: 40000.00, LoanType: 'Business' },
    ];

    // REAL FETCH
    // const response = await fetch(`${BASE_URL}/loans/${userId}`);
    // if (!response.ok) throw new Error('Failed to fetch loan offers');
    // const res = await response.json();
    // return res.data;
}

// ===================== DEALS =====================
export async function getDeals() {
  // PRESET DATA
  return [
    { DealID: 1, Item: 'AirPods Pro 2nd Gen', StoreName: 'Courts Mammouth Online', Price: 14200.0, OriginalPrice: 18500.0, DiscountPercent: 23.0, IsBestDeal: 1 },
    { DealID: 2, Item: 'AirPods Pro 2nd Gen', StoreName: 'Galaxy Mauritius', Price: 16500.0, OriginalPrice: 18500.0, DiscountPercent: 11.0, IsBestDeal: 0 },
    { DealID: 3, Item: 'AirPods Pro 2nd Gen', StoreName: '361 Degree', Price: 17800.0, OriginalPrice: 18500.0, DiscountPercent: 4.0, IsBestDeal: 0 },
    { DealID: 4, Item: 'Samsung Galaxy Watch 6', StoreName: 'Galaxy Mauritius', Price: 9500.0, OriginalPrice: 12000.0, DiscountPercent: 21.0, IsBestDeal: 1 },
    { DealID: 5, Item: 'Samsung Galaxy Watch 6', StoreName: 'Jumbo Score', Price: 10800.0, OriginalPrice: 12000.0, DiscountPercent: 10.0, IsBestDeal: 0 },
    { DealID: 6, Item: 'Samsung Galaxy Watch 6', StoreName: 'Amazon.mu', Price: 11200.0, OriginalPrice: 12000.0, DiscountPercent: 7.0, IsBestDeal: 0 },
    { DealID: 7, Item: 'PS5 Controller (DualSense)', StoreName: '361 Degree', Price: 3999.0, OriginalPrice: 5500.0, DiscountPercent: 27.0, IsBestDeal: 1 },
    { DealID: 8, Item: 'PS5 Controller (DualSense)', StoreName: 'Courts Mammouth', Price: 4800.00, OriginalPrice: 5500.0, DiscountPercent: 13.0, IsBestDeal: 0 },
    { DealID: 9, Item: 'PS5 Controller (DualSense)', StoreName: 'Galaxy Mauritius', Price: 5200.00, OriginalPrice: 5500.0, DiscountPercent: 5.0, IsBestDeal: 0 },
    { DealID: 10, Item: 'Logitech MX Master 3 Mouse', StoreName: 'Jumbo Score', Price: 4800.00, OriginalPrice: 6200.0, DiscountPercent: 23.0, IsBestDeal: 1 },
    { DealID: 11, Item: 'Logitech MX Master 3 Mouse', StoreName: 'Amazon.mu', Price: 5400.00, OriginalPrice: 6200.0, DiscountPercent: 13.0, IsBestDeal: 0 },
    { DealID: 12, Item: 'Logitech MX Master 3 Mouse', StoreName: 'Courts Mammouth', Price: 5900.00, OriginalPrice: 6200.0, DiscountPercent: 5.0, IsBestDeal: 0 },
    { DealID: 13, Item: 'JBL Flip 6 Bluetooth Speaker', StoreName: 'Amazon.mu', Price: 5350.00, OriginalPrice: 7000.0, DiscountPercent: 24.0, IsBestDeal: 1 },
    { DealID: 14, Item: 'JBL Flip 6 Bluetooth Speaker', StoreName: '361 Degree', Price: 6100.00, OriginalPrice: 7000.0, DiscountPercent: 13.0, IsBestDeal: 0 },
    { DealID: 15, Item: 'JBL Flip 6 Bluetooth Speaker', StoreName: 'Galaxy Mauritius', Price: 6500.00, OriginalPrice: 7000.0, DiscountPercent: 7.0, IsBestDeal: 0 },
    { DealID: 16, Item: 'Laptop - Dell Inspiron 15', StoreName: 'Courts Mammouth', Price: 22500.00, OriginalPrice: 28000.0, DiscountPercent: 20.0, IsBestDeal: 1 },
    { DealID: 17, Item: 'Laptop - Dell Inspiron 15', StoreName: 'Galaxy Mauritius', Price: 25200.00, OriginalPrice: 28000.0, DiscountPercent: 10.0, IsBestDeal: 0 },
    { DealID: 18, Item: 'Laptop - Dell Inspiron 15', StoreName: 'Jumbo Score', Price: 26800.0, OriginalPrice: 28000.0, DiscountPercent: 4.0, IsBestDeal: 0 },
    { DealID: 19, Item: 'PlayStation 5', StoreName: '361 Degree', Price: 16500.0, OriginalPrice: 19500.0, DiscountPercent: 15.0, IsBestDeal: 1 },
    { DealID: 20, Item: 'PlayStation 5', StoreName: 'Courts Mammouth', Price: 17800.0, OriginalPrice: 19500.0, DiscountPercent: 9.0, IsBestDeal: 0 },
    { DealID: 21, Item: 'PlayStation 5', StoreName: 'Galaxy Mauritius', Price: 18900.0, OriginalPrice: 19500.0, DiscountPercent: 3.0, IsBestDeal: 0 },
  ];
 
  // REAL FETCH
  // const response = await fetch(`${BASE_URL}/deals`);
  // if (!response.ok) throw new Error('Failed to fetch deals');
  // const res = await response.json();
  // return res.data;
}