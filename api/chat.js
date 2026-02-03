/**
 * Vercel Serverless Function - AI Interview Proxy
 * 
 * This function securely proxies requests to the Perplexity API,
 * keeping the API key server-side only.
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        console.error('Missing PERPLEXITY_API_KEY environment variable');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { messages, difficulty, topic } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request: messages array required' });
        }

        const systemPrompt = `You are an expert Security Engineer conducting a FAANG-level security interview.
        
        Difficulty: ${difficulty || 'mid'}
        Primary Topic: ${topic || 'General Application Security'}
        
        Guidelines:
        1. Act exactly like a senior interviewer - be professional but encouraging.
        2. Ask one question at a time.
        3. Dig deeper into vague answers with follow-ups.
        4. If the candidate makes a mistake, gently correct them after their answer or lead them to the right path.
        5. Keep responses concise (under 150 words) unless explaining a complex concept.
        
        Your goal is to assess their depth of knowledge in AppSec, Network Security, and Threat Modeling.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.2,
                max_tokens: 1000,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error:', response.status, errorText);
            return res.status(response.status).json({
                error: 'AI service error',
                details: response.status === 429 ? 'Rate limited' : 'Service unavailable'
            });
        }

        const data = await response.json();
        return res.status(200).json(data.choices[0].message);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
