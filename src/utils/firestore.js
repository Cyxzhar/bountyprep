/**
 * Firestore utility functions for user progress
 */

import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    const progressRef = doc(db, 'users', userId, 'challenges', challengeId);
    const snap = await getDoc(progressRef);
    return snap.exists() ? snap.data() : null;
}

/**
 * Update user XP and stats after answering a question
 */
export async function updateUserStats(userId, xpEarned, isCorrect) {
    const userRef = doc(db, 'users', userId);

    const updates = {
        xp: increment(xpEarned),
        totalQuestionsAnswered: increment(1),
        updatedAt: serverTimestamp(),
    };

    if (isCorrect) {
        updates.totalCorrectAnswers = increment(1);
    }

    await updateDoc(userRef, updates);
}

/**
 * Mark a challenge as completed
 */
export async function markChallengeCompleted(userId, challengeId, stats) {
    const userRef = doc(db, 'users', userId);
    const progressRef = doc(db, 'users', userId, 'challenges', challengeId);

    // Update challenge progress
    await setDoc(progressRef, {
        completed: true,
        completedAt: serverTimestamp(),
        ...stats,
    }, { merge: true });

    // Update user stats
    await updateDoc(userRef, {
        totalCompleted: increment(1),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update user's streak
 */
export async function updateStreak(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { streak: 0 };

    const userData = userSnap.data();
    const lastActivity = userData.lastActivityDate?.toDate?.() || null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let newStreak = userData.streak || 0;

    if (lastActivity) {
        const lastDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            // Same day - streak unchanged
        } else if (daysDiff === 1) {
            // Next day - increment streak
            newStreak += 1;
        } else {
            // Streak broken - reset to 1
            newStreak = 1;
        }
    } else {
        // First activity ever
        newStreak = 1;
    }

    await updateDoc(userRef, {
        streak: newStreak,
        lastActivityDate: serverTimestamp(),
    });

    return { streak: newStreak };
}

/**
 * Refresh user profile from Firestore
 */
export async function refreshUserProfile(userId) {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}
