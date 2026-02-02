/**
 * AdminSeeder - Temporary component for seeding Firestore
 * 
 * IMPORTANT: Remove this component after seeding is complete!
 * Access via: /admin-seed (add route temporarily)
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { challenges } from '../data/challenges';
import { seedChallengesFromBrowser } from '../scripts/seedChallenges';

export default function AdminSeeder() {
    const { currentUser } = useAuth();
    const [status, setStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSeed = async () => {
        if (!currentUser) {
            setStatus([{ message: '❌ Must be logged in to seed', type: 'error' }]);
            return;
        }

        setLoading(true);
        setStatus([{ message: '🌱 Starting seed...', type: 'info' }]);

        try {
            const results = await seedChallengesFromBrowser(db, challenges);

            const newStatus = results.map(r => ({
                message: r.success
                    ? `✅ Seeded challenge ${r.id}`
                    : `❌ Failed: ${r.id} - ${r.error}`,
                type: r.success ? 'success' : 'error'
            }));

            setStatus(prev => [...prev, ...newStatus, { message: '✨ Seeding complete!', type: 'info' }]);
            setDone(true);
        } catch (error) {
            setStatus(prev => [...prev, { message: `❌ Fatal error: ${error.message}`, type: 'error' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '2rem',
            background: '#0a0a0f',
            color: '#fff',
            minHeight: '100vh',
            fontFamily: 'monospace'
        }}>
            <h1 style={{ color: '#9fef00' }}>🔧 Admin: Seed Firestore</h1>

            <p style={{ opacity: 0.7, marginBottom: '1rem' }}>
                This will migrate {challenges.length} challenges from local data to Firestore.
            </p>

            {currentUser ? (
                <p style={{ color: '#9fef00' }}>Logged in as: {currentUser.email}</p>
            ) : (
                <p style={{ color: '#ff4444' }}>⚠️ Not logged in - please log in first</p>
            )}

            <button
                onClick={handleSeed}
                disabled={loading || done}
                style={{
                    padding: '1rem 2rem',
                    background: done ? '#333' : '#9fef00',
                    color: done ? '#666' : '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: loading || done ? 'not-allowed' : 'pointer',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}
            >
                {loading ? 'Seeding...' : done ? 'Done ✓' : 'Seed Challenges'}
            </button>

            <div style={{
                background: '#1a1a2e',
                padding: '1rem',
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                {status.map((s, i) => (
                    <p key={i} style={{
                        color: s.type === 'error' ? '#ff4444' : s.type === 'success' ? '#9fef00' : '#888',
                        margin: '0.25rem 0'
                    }}>
                        {s.message}
                    </p>
                ))}
            </div>

            {done && (
                <p style={{ marginTop: '1rem', color: '#9fef00' }}>
                    ✅ Go to Firebase Console → Firestore to verify data
                </p>
            )}
        </div>
    );
}
