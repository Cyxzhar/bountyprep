/**
 * Express Route Handler - AI Interview Proxy
 * 
 * SECURITY:
 * - Firebase auth token verification (H2)
 * - Restricted CORS origins (H3)
 * - Input sanitization / prompt injection prevention (M2)
 * - Server-side quota enforcement (H4)
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin (singleton)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const ALLOWED_ORIGINS = [
    'https://bugora.app',
    'https://www.bugora.app',
    'http://localhost:5173',
    'http://localhost:8080',
];

const FREE_DAILY_LIMIT = 10;
const PREMIUM_DAILY_LIMIT = 50;

export default async function handler(req, res) {
    // CORS: Restrict to allowed origins
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── AUTH: Verify Firebase ID token ──────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    let uid;
    try {
        const token = authHeader.split('Bearer ')[1];
        const decoded = await admin.auth().verifyIdToken(token);
        uid = decoded.uid;
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // ── QUOTA: Server-side rate limiting ────────────────────────
    const today = new Date().toISOString().split('T')[0];
    const quotaRef = admin.firestore().doc(`users/${uid}/quota/${today}`);

    try {
        const quotaSnap = await quotaRef.get();
        const quotaData = quotaSnap.exists ? quotaSnap.data() : { used: 0 };
        const limit = FREE_DAILY_LIMIT; // TODO: check user.isPremium for PREMIUM_DAILY_LIMIT

        if (quotaData.used >= limit) {
            return res.status(429).json({
                error: 'Daily quota exceeded',
                remaining: 0,
                resetAt: `${today}T23:59:59Z`
            });
        }

        // Increment quota
        await quotaRef.set({ used: (quotaData.used || 0) + 1, date: today }, { merge: true });
    } catch (err) {
        console.error('Quota check failed:', err);
        // Fail open for now — don't block users if quota check fails
    }

    // ── API KEY ─────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Missing GEMINI_API_KEY environment variable');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { messages, difficulty, topic } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request: messages array required' });
        }

        // ── INPUT SANITIZATION: Prevent prompt injection ───────
        const sanitizedMessages = messages
            .filter(m => m.role !== 'system') // Block client-sent system prompts
            .slice(-20) // Limit conversation length
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(m.content || '').slice(0, 2000) }] // Limit message length
            }));

        const systemPrompt = `You are an expert Security Engineer conducting a FAANG-level security interview.
        
        Difficulty: ${String(difficulty || 'mid').slice(0, 20)}
        Primary Topic: ${String(topic || 'General Application Security').slice(0, 100)}
        
        Guidelines:
        1. Act exactly like a senior interviewer - be professional but encouraging.
        2. Ask one question at a time.
        3. Dig deeper into vague answers with follow-ups.
        4. If the candidate makes a mistake, gently correct them after their answer or lead them to the right path.
        5. Keep responses concise (under 150 words) unless explaining a complex concept.
        
        Your goal is to assess their depth of knowledge in AppSec, Network Security, and Threat Modeling.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: sanitizedMessages,
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            return res.status(response.status).json({
                error: 'AI service error',
                details: response.status === 429 ? 'Rate limited' : 'Service unavailable'
            });
        }

        const data = await response.json();
        const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        return res.status(200).json({
            role: 'assistant',
            content: geminiResponseText
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
