/**
 * Perplexity API Client (via Backend Proxy)
 * 
 * Calls our secure serverless function instead of Perplexity directly.
 * This keeps the API key server-side only.
 */

const API_ENDPOINT = '/api/chat';

export async function generateInterviewResponse(messages, difficulty, topic) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                difficulty,
                topic
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('AI Interview Error:', error);
        return {
            role: 'assistant',
            content: "I'm having trouble connecting to the interview server. Please try again in a moment."
        };
    }
}
