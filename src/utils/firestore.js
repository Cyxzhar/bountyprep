/**
 * Firestore utility functions for user progress
 */

import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, serverTimestamp, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { checkNewAchievements } from './gamification';

/**
 * Save challenge progress to Firestore
 */
export async function saveChallengeProgress(userId, challengeId, data) {
    const progressRef = doc(db, 'users', userId, 'challenges', challengeId);

    await setDoc(progressRef, {
        ...data,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

/**
 * Get challenge progress from Firestore
 */
export async function getChallengeProgress(userId, challengeId) {
    try {
        const progressRef = doc(db, 'users', userId, 'challenges', challengeId);
        const snap = await getDoc(progressRef);
        return snap.exists() ? snap.data() : null;
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            console.warn('Firestore offline, returning null progress');
            return null;
        }
        throw err;
    }
}

/**
 * Check and unlock achievements for a user
 * Private helper function
 */
async function processAchievements(userId, userSnapshot = null) {
    const userRef = doc(db, 'users', userId);

    // If snapshot not provided, fetch it
    let userData;
    if (userSnapshot) {
        userData = userSnapshot.data();
    } else {
        const snap = await getDoc(userRef);
        if (!snap.exists()) return [];
        userData = snap.data();
    }

    // Check for new achievements
    const newAchievements = checkNewAchievements(userData);

    if (newAchievements.length > 0) {
        // Add to user profile
        const achievementIds = newAchievements.map(a => a.id);

        try {
            await updateDoc(userRef, {
                achievements: arrayUnion(...achievementIds),
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            // If updateDoc fails (offline), try setDoc with merge
            await setDoc(userRef, {
                achievements: arrayUnion(...achievementIds),
                updatedAt: serverTimestamp()
            }, { merge: true });
        }

        return newAchievements;
    }

    return [];
}

/**
 * Update user XP and stats after answering a question
 * Returns any newly unlocked achievements
 */
export async function updateUserStats(userId, xpEarned, isCorrect) {
    try {
        const userRef = doc(db, 'users', userId);

        const updates = {
            xp: increment(xpEarned),
            totalQuestionsAnswered: increment(1),
            updatedAt: serverTimestamp(),
        };

        if (isCorrect) {
            updates.totalCorrectAnswers = increment(1);
        }

        await setDoc(userRef, updates, { merge: true });

        // Check achievements after update
        return await processAchievements(userId);
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            console.warn('Firestore offline, skipping stats update');
            return [];
        }
        throw err;
    }
}

/**
 * Mark a challenge as completed
 * Returns any newly unlocked achievements
 */
export async function markChallengeCompleted(userId, challengeId, stats) {
    try {
        const userRef = doc(db, 'users', userId);
        const progressRef = doc(db, 'users', userId, 'challenges', challengeId);

        // Check if already completed to prevent double counting
        const progressSnap = await getDoc(progressRef);
        const isAlreadyCompleted = progressSnap.exists() && progressSnap.data().completed;

        // Update challenge progress
        await setDoc(progressRef, {
            completed: true,
            completedAt: serverTimestamp(),
            ...stats,
        }, { merge: true });

        // Update user stats ONLY if not already completed
        if (!isAlreadyCompleted) {
            await setDoc(userRef, {
                totalCompleted: increment(1),
                updatedAt: serverTimestamp(),
            }, { merge: true });
        }

        // Check achievements after update
        return await processAchievements(userId);
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            console.warn('Firestore offline, skipping completion mark');
            return [];
        }
        throw err;
    }
}

/**
 * Update user's streak
 * Returns new streak and any streak-related achievements
 */
export async function updateStreak(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return { streak: 0, achievements: [] };

        const userData = userSnap.data();
        const lastActivity = userData.lastActivityDate?.toDate?.() || null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let newStreak = userData.streak || 0;
        let updated = false;

        if (lastActivity) {
            const lastDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Same day - streak unchanged
            } else if (daysDiff === 1) {
                // Next day - increment streak
                newStreak += 1;
                updated = true;
            } else {
                // Streak broken - reset to 1
                newStreak = 1;
                updated = true;
            }
        } else {
            // First activity ever
            newStreak = 1;
            updated = true;
        }

        if (updated) {
            // Use setDoc merge=true instead of updateDoc for offline resilience
            // wait for the write (or let it queue)
            await setDoc(userRef, {
                streak: newStreak,
                lastActivityDate: serverTimestamp(),
            }, { merge: true });

            // Check achievements specifically for streak update
            // (We need to re-fetch or construct updated user object)
            const updatedUserData = { ...userData, streak: newStreak };
            const newAchievements = checkNewAchievements(updatedUserData);

            if (newAchievements.length > 0) {
                const achievementIds = newAchievements.map(a => a.id);
                // Queue achievement update
                await setDoc(userRef, {
                    achievements: arrayUnion(...achievementIds)
                }, { merge: true });
                return { streak: newStreak, achievements: newAchievements };
            }
        }

        return { streak: newStreak, achievements: [] };
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            console.warn('Firestore offline, skipping streak update');
            return { streak: 0, achievements: [] }; // Return fallback
        }
        console.error('Streak update failed:', err);
        return { streak: 0, achievements: [] };
    }
}

// ... (existing export)

/**
 * Save interview session to Firestore
 */
/**
 * Save interview session to Firestore
 * Supports multiple sessions via sessionId
 */
export async function saveInterviewSession(userId, messages, elapsedTime, sessionId) {
    try {
        // Use a subcollection 'interview_sessions' instead of single doc 'current'
        const sessionRef = doc(db, 'users', userId, 'interview_sessions', sessionId);

        // Extract topic/summary (naive: first user message)
        const firstUserMsg = messages.find(m => m.role === 'user');
        const topic = firstUserMsg ? firstUserMsg.content.substring(0, 50) + '...' : 'New Session';

        await setDoc(sessionRef, {
            id: sessionId,
            messages,
            elapsedTime,
            topic,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp() // setDoc with merge will keep original creation time if present
        }, { merge: true });
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            return;
        }
        if (err.code === 'permission-denied') {
            return;
        }
        console.error('Failed to save interview session:', err);
    }
}

/**
 * Get all interview sessions for a user
 */
export async function getUserInterviewSessions(userId) {
    try {
        const sessionsRef = collection(db, 'users', userId, 'interview_sessions');
        const q = query(sessionsRef, orderBy('updatedAt', 'desc'), limit(20)); // Limit to last 20
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamps to Date objects for UI
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));
    } catch (err) {
        if (err.code === 'unavailable' || err.message.includes('offline')) {
            return [];
        }
        if (err.code === 'permission-denied') {
            return [];
        }
        console.error('Failed to load sessions:', err);
        return [];
    }
}

/**
 * Get last interview session (Legacy support / Quick resume)
 * Fetches the most recently updated session from the collection
 */
export async function getLastInterviewSession(userId) {
    try {
        const sessions = await getUserInterviewSessions(userId);
        return sessions.length > 0 ? sessions[0] : null;
    } catch (err) {
        return null;
    }
}

/**
 * Refresh user profile from Firestore
 * ... (existing refreshUserProfile)
 */
export async function refreshUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data() : null;
    } catch (err) {
        console.warn('Refresh user profile failed:', err);
        return null; // Return null instead of throwing on refresh failure
    }
}

/**
 * Save lesson progress
 * Tracks completed lessons and updates course progress
 */
export async function saveLessonProgress(userId, courseId, lessonId, xp = 0) {
    try {
        const courseRef = doc(db, 'users', userId, 'courses', courseId);

        // Atomically add lesson to completed array and update timestamp
        await setDoc(courseRef, {
            completedLessons: arrayUnion(lessonId),
            lastLessonId: lessonId,
            lastAccessedAt: serverTimestamp(),
            courseId: courseId // redundancy for queries
        }, { merge: true });

        // If XP provided, update global user stats
        if (xp > 0) {
            await updateUserStats(userId, xp, true); // true = counts as "correct" action (simpler stat tracking)
        }

        return true;
    } catch (err) {
        console.error('Failed to save lesson progress:', err);
        return false;
    }
}

/**
 * Get progress for a specific course
 */
export async function getCourseProgress(userId, courseId) {
    try {
        const courseRef = doc(db, 'users', userId, 'courses', courseId);
        const snap = await getDoc(courseRef);
        return snap.exists() ? snap.data() : null;
    } catch (err) {
        console.warn('Failed to get course progress:', err);
        return null;
    }
}

/**
 * Get all course progress for user
 * Returns map of courseId -> progressData
 */
export async function getAllCoursesProgress(userId) {
    // TODO: Implement using collection query if needed for dashboard
    // For now returning empty object as placeholder or implementing simpler version
    return {};
}
