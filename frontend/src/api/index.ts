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

    // 1. Send the task
    await fetch(`${bandApiUrl}/agent/chats/${target.roomId}/messages`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey!, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: { content: `TASK_REQUEST: ${taskDescription}`, mentions: [{ id: target.uuid }] }
        })
    });

    // 2. Poll for the reply
    for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const res = await fetch(`${bandApiUrl}/agent/chats/${target.roomId}/messages?t=${Date.now()}`, {
            headers: { 'X-API-Key': apiKey!, 'Cache-Control': 'no-cache' }
        });

        const data = await res.json();

        // THE FIX: Only evaluate the strictly NEWEST message in the room
        if (data && data.messages && data.messages.length > 0) {
            
            // Assuming the API returns newest messages first (index 0)
            const latestMessage = data.messages[0]; 

            // If the absolute newest message in the room is from our agent, it's the fresh reply!
            if (latestMessage.sender && latestMessage.sender.id === target.uuid && latestMessage.content) {
                const jsonMatch = latestMessage.content.match(/\{[\s\S]*\}/);
                
                if (jsonMatch) {
                    console.log(`✅ SUCCESS on attempt ${i + 1}! Data extracted.`);
                    return JSON.parse(jsonMatch[0]);
                }
            }
        }
        console.log(`⏳ Waiting for agent... (Attempt ${i + 1}/20)`);
    }

    throw new Error("Agent timed out.");
}

// ─── Emails ──────────────────────────────────────────────────────────────────
export async function getEmails(userId: number) {
    const response = await fetch(`${BASE_URL}/emails/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch emails');
    const res = await response.json();
    return res.data;
}

export async function analyzeEmail(emailId: number, bodyText: string) {
    // Uses BAND AI scam analyst agent
    return dispatchToAgent('scam_analyst', `Analyze this email for scams. EmailID: ${emailId}. Body: ${bodyText}`);
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export async function getTransactions(userId: number) {
    const response = await fetch(`${BASE_URL}/transactions/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const res = await response.json();
    return res.data;
}

// ─── Loans ───────────────────────────────────────────────────────────────────
export async function getLoanOffers(userId: number) {
    const response = await fetch(`${BASE_URL}/loans/offers`);
    if (!response.ok) throw new Error('Failed to fetch loan offers');
    const res = await response.json();
    return res.data;
}