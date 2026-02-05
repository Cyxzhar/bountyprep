/**
 * AdminSeeder - Temporary component for seeding Firestore
 * 
 * IMPORTANT: Remove this component after seeding is complete!
 * Access via: /admin-seed
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { challenges } from '../data/challenges';
import { courses } from '../data/courses';

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
            // Seed Courses
            setStatus(prev => [...prev, { message: '📚 Seeding Courses...', type: 'info' }]);
            for (const course of courses) {
                try {
                    // Create a deep copy and sanitize non-serializable fields (like React components)
                    const courseData = { ...course };
                    delete courseData.icon; // Remove icon component

                    await setDoc(doc(db, 'courses', course.id), courseData, { merge: true });
                    setStatus(prev => [...prev, {
                        message: `✅ Seeded Course: ${course.title}`,
                        type: 'success'
                    }]);
                } catch (error) {
                    setStatus(prev => [...prev, {
                        message: `❌ Failed Course: ${course.id} - ${error.message}`,
                        type: 'error'
                    }]);
                }
            }

            // Seed Challenges
            setStatus(prev => [...prev, { message: '🏆 Seeding Challenges...', type: 'info' }]);
            for (const challenge of challenges) {
                try {
                    // Create copy and sanitize
                    const challengeData = { ...challenge };
                    delete challengeData.icon; // Remove icon if present (just in case)

                    await setDoc(doc(db, 'challenges', challenge.id.toString()), {
                        id: challenge.id.toString(),
                        title: challenge.title,
                        description: challenge.description,
                        type: challenge.type,
                        difficulty: challenge.difficulty,
                        xpReward: challenge.xpReward,
                        isPremium: challenge.isPremium || false,
                        estimatedTimeMinutes: challenge.estimatedTime || 10,
                        questions: challenge.questions || [],
                        steps: challenge.steps || [],
                        flag: challenge.flag || null,
                        labEnvironment: challenge.labEnvironment || null,
                        resources: challenge.resources || null,
                        // Ensure all fields are included for new challenge types
                        objective: challenge.objective || null,
                        scenario: challenge.scenario || null,
                        initialCode: challenge.initialCode || null,
                        validationCode: challenge.validationCode || null,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    });

                    setStatus(prev => [...prev, {
                        message: `✅ Seeded Challenge: ${challenge.title}`,
                        type: 'success'
                    }]);
                } catch (error) {
                    setStatus(prev => [...prev, {
                        message: `❌ Failed Challenge: ${challenge.id} - ${error.message}`,
                        type: 'error'
                    }]);
                }
            }

            setStatus(prev => [...prev, { message: '✨ Seeding complete!', type: 'info' }]);
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
                This will migrate {courses.length} courses and {challenges.length} challenges to Firestore.
            </p>

            {currentUser ? (
                <p style={{ color: '#9fef00' }}>✅ Logged in as: {currentUser.email}</p>
            ) : (
                <p style={{ color: '#ff4444' }}>⚠️ Not logged in - please log in first at /auth/login</p>
            )}

            <button
                onClick={handleSeed}
                disabled={loading || done || !currentUser}
                style={{
                    padding: '1rem 2rem',
                    background: done ? '#333' : (!currentUser ? '#555' : '#9fef00'),
                    color: done || !currentUser ? '#666' : '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: loading || done || !currentUser ? 'not-allowed' : 'pointer',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}
            >
                {loading ? 'Seeding...' : done ? 'Done ✓' : 'Seed Database'}
            </button>

            <div style={{
                background: '#1a1a2e',
                padding: '1rem',
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                {status.length === 0 ? (
                    <p style={{ color: '#666' }}>Click "Seed Database" to begin...</p>
                ) : (
                    status.map((s, i) => (
                        <p key={i} style={{
                            color: s.type === 'error' ? '#ff4444' : s.type === 'success' ? '#9fef00' : '#888',
                            margin: '0.25rem 0'
                        }}>
                            {s.message}
                        </p>
                    ))
                )}
            </div>

            {done && (
                <p style={{ marginTop: '1rem', color: '#9fef00' }}>
                    ✅ Go to Firebase Console → Firestore to verify data, then navigate to /home
                </p>
            )}
        </div>
    );
}
