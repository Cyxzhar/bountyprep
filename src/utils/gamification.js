import { achievements } from '../data/achievements';
import { Timestamp } from 'firebase/firestore';

/**
 * Calculate updated streak based on last activity date
 * 
 * Rules:
 * - If last activity was today: Streak stays same
 * - If last activity was yesterday: Streak + 1
 * - If last activity was older than yesterday: Streak resets to 1
 * 
 * @param {Timestamp|Date} lastActivityDate Firestore Timestamp or Date object
 * @param {number} currentStreak Current streak count
 * @returns {number} New streak count
 */
export function calculateStreak(lastActivityDate, currentStreak = 0) {
    if (!lastActivityDate) return 1;

    const now = new Date();
    const lastDate = lastActivityDate.toDate ? lastActivityDate.toDate() : new Date(lastActivityDate);

    // Normalize to start of day for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return currentStreak; // Already active today, no change
    } else if (diffDays === 1) {
        return currentStreak + 1; // Consecutive day
    } else {
        return 1; // Streak broken, reset to 1 (active today)
    }
}

/**
 * Check for newly unlocked achievements
 * 
 * @param {Object} userData Current user profile data
 * @param {Object} context Additional context (e.g. current challenge stats)
 * @returns {Array} List of newly unlocked achievement objects
 */
export function checkNewAchievements(userData, context = {}) {
    const unlocked = [];
    const currentAchievements = new Set(userData.achievements || []);

    achievements.forEach(achievement => {
        // Skip if already unlocked
        if (currentAchievements.has(achievement.id)) return;

        // Check condition
        try {
            if (achievement.condition(userData, context)) {
                unlocked.push(achievement);
            }
        } catch (err) {
            console.error(`Error checking achievement ${achievement.id}:`, err);
        }
    });

    return unlocked;
}

/**
 * Update stats helper
 * Calculates new stats after a question/challenge
 */
export function calculateNewStats(currentStats, { isCorrect, xpEarned, challengeType }) {
    const newStats = { ...currentStats };

    newStats.totalQuestionsAnswered = (newStats.totalQuestionsAnswered || 0) + 1;
    if (isCorrect) {
        newStats.totalCorrectAnswers = (newStats.totalCorrectAnswers || 0) + 1;
    }

    // Update accuracy
    newStats.accuracyRate = Math.round(
        (newStats.totalCorrectAnswers / newStats.totalQuestionsAnswered) * 100
    );

    // Update type stats if provided
    if (challengeType && isCorrect) { // Only count towards mastery if question correct? Or just participation? 
        // For mastery achievements like "Complete 5 SQLi", we typically track completed CHALLENGES, not questions.
        // We might need to handle this at the challenge-completion level, not question-level.
        // For now, let's assume specific logic in the caller handles stats.byType updates
    }

    return newStats;
}
