/**
 * Firestore utility functions for user progress
 */

import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';
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
    const progressRef = doc(db, 'users', userId, 'challenges', challengeId);
    const snap = await getDoc(progressRef);
    return snap.exists() ? snap.data() : null;
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

        await updateDoc(userRef, {
            achievements: arrayUnion(...achievementIds),
            updatedAt: serverTimestamp()
        });

        return newAchievements;
    }

    return [];
}

/**
 * Update user XP and stats after answering a question
 * Returns any newly unlocked achievements
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

    // Check achievements after update
    return await processAchievements(userId);
}

/**
 * Mark a challenge as completed
 * Returns any newly unlocked achievements
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

    // Check achievements after update
    return await processAchievements(userId);
}

/**
 * Update user's streak
 * Returns new streak and any streak-related achievements
 */
export async function updateStreak(userId) {
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
        await updateDoc(userRef, {
            streak: newStreak,
            lastActivityDate: serverTimestamp(),
        });

        // Check achievements specifically for streak update
        // (We need to re-fetch or construct updated user object)
        const updatedUserData = { ...userData, streak: newStreak };
        const newAchievements = checkNewAchievements(updatedUserData);

        if (newAchievements.length > 0) {
            const achievementIds = newAchievements.map(a => a.id);
            await updateDoc(userRef, {
                achievements: arrayUnion(...achievementIds)
            });
            return { streak: newStreak, achievements: newAchievements };
        }
    }

    return { streak: newStreak, achievements: [] };
}

/**
 * Refresh user profile from Firestore
 */
export async function refreshUserProfile(userId) {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}
