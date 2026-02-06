/**
 * Perplexity API Client
 * 
 * Uses backend proxy on Vercel, direct API on localhost (dev only)
 */

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Check if we're on localhost (development)
const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export async function generateInterviewResponse(messages, difficulty, topic) {
    const systemPrompt = `You are an expert Security Engineer conducting a FAANG-level security interview.
    
    Difficulty: ${difficulty || 'mid'}
    Primary Topic: ${topic || 'General Application Security'}
    
    Guidelines:
    1. Act exactly like a senior interviewer - be professional but encouraging.
    2. Ask one question at a time.
    3. Dig deeper into vague answers with follow-ups.
    4. If the candidate makes a mistake, gently correct them after their answer or lead them to the right path.
    5. Keep responses concise (under 200 words) and meaningful.
    6. **CRITICAL: Use proper Markdown structure.**
       - Use ### for major sections (e.g., ### Core Concept).
       - Use **bold** for key terms.
       - Use - bullet points for lists.
       - Use > blockquotes for important notes or hints.
       - Use \`code\` for technical terms.
    
    Your goal is to assess their depth of knowledge in AppSec, Network Security, and Threat Modeling.`;

    try {
        let response;

        if (isLocalhost) {
            // Direct API call for localhost development
            const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;

            if (!apiKey) {
                console.warn('Missing VITE_PERPLEXITY_API_KEY in .env');
                return {
                    role: 'assistant',
                    content: "API key not configured. Please add VITE_PERPLEXITY_API_KEY to your .env file."
                };
            }

            // Ensure proper message alternation (System -> User -> Assistant...)
            // Remove initial assistant greeting if it exists to strictly follow System -> User
            let apiMessages = messages.map(m => ({
                role: m.role,
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '')
            }));

            if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
                apiMessages.shift();
            }

            response = await fetch(PERPLEXITY_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'sonar',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...apiMessages
                    ],
                    temperature: 0.2,
                    max_tokens: 1000,
                })
            });
        } else {
            // Use serverless proxy on Vercel
            let apiMessages = [...messages];
            if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
                apiMessages.shift();
            }

            response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    difficulty,
                    topic
                })
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API Error:', response.status, errorText);
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (data.choices) {
            return data.choices[0].message;
        }
        return data;

    } catch (error) {
        console.error('AI Interview Error:', error);
        return {
            role: 'assistant',
            content: "I'm having trouble connecting to the interview server. Please check your connection and try again."
        };
    }
}
