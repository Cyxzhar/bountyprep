/**
 * Perplexity API Client
 * 
 * SECURITY: All requests route through the /api/chat server proxy.
 * The API key is NEVER exposed to the client bundle.
 */

import { auth } from './firebase';

export async function generateInterviewResponse(messages, difficulty, topic) {
    try {
        // Sanitize messages before sending
        let apiMessages = [...messages];
        if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
            apiMessages.shift();
        }

        // Get Firebase auth token for server-side verification
        let authToken = '';
        try {
            const user = auth.currentUser;
            if (user) {
                authToken = await user.getIdToken();
            }
        } catch {
            // Continue without token — server will reject if required
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            },
            body: JSON.stringify({
                messages: apiMessages,
                difficulty,
                topic
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 429) {
                return {
                    role: 'assistant',
                    content: "You've reached your daily interview limit. Please try again tomorrow or upgrade for more sessions."
                };
            }
            if (response.status === 401) {
                return {
                    role: 'assistant',
                    content: "Your session has expired. Please refresh the page and sign in again."
                };
            }
            throw new Error(errorData.error || `Request failed: ${response.status}`);
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

