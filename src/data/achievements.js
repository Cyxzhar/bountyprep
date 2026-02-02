/**
 * BountyPrep Achievements Data
 * 
 * Categories:
 * - General: Basic usage, simple milestones
 * - Streak: Daily activity streaks
 * - Mastery: Skill-specific mastery (SQLi, XSS, etc.)
 * - Accuracy: Perfect scores, high accuracy
 * - Speed: Fast completions (future use)
 */

export const achievements = [
    // General / Milestones
    {
        id: 'first_blood',
        title: 'First Blood',
        description: 'Complete your first challenge',
        icon: '⚔️', // Using emojis for now, can map to Lucide icons later
        xpReward: 50,
        category: 'milestone',
        condition: (user) => user.totalCompleted >= 1
    },
    {
        id: 'script_kiddie',
        title: 'Script Kiddie',
        description: 'Reach Level 2',
        icon: '👶',
        xpReward: 100,
        category: 'milestone',
        condition: (user) => user.level >= 2
    },
    {
        id: 'serious_hacker',
        title: 'Serious Hacker',
        description: 'Reach Level 5',
        icon: '💻',
        xpReward: 500,
        category: 'milestone',
        condition: (user) => user.level >= 5
    },
    {
        id: 'century_club',
        title: 'Century Club',
        description: 'Earn 1,000 Total XP',
        icon: '💯',
        xpReward: 200,
        category: 'milestone',
        condition: (user) => user.xp >= 1000
    },

    // Streaks
    {
        id: 'streak_week',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        xpReward: 300,
        category: 'streak',
        condition: (user) => user.streak >= 7
    },
    {
        id: 'streak_month',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '📅',
        xpReward: 1000,
        category: 'streak',
        condition: (user) => user.streak >= 30
    },

    // Mastery (Type-specific - requires tracking stats by type)
    {
        id: 'sql_ninja',
        title: 'SQL Ninja',
        description: 'Complete 5 SQL Injection challenges',
        icon: '💉',
        xpReward: 250,
        category: 'mastery',
        condition: (user) => (user.stats?.byType?.['SQL Injection'] || 0) >= 5
    },
    {
        id: 'xss_terminator',
        title: 'XSS Terminator',
        description: 'Complete 5 XSS challenges',
        icon: '🛡️',
        xpReward: 250,
        category: 'mastery',
        condition: (user) => (user.stats?.byType?.['XSS'] || 0) >= 5
    },
    {
        id: 'auth_breaker',
        title: 'Auth Breaker',
        description: 'Complete 5 Auth Bypass challenges',
        icon: '🔓',
        xpReward: 250,
        category: 'mastery',
        condition: (user) => (user.stats?.byType?.['Auth Bypass'] || 0) >= 5
    },

    // Accuracy
    {
        id: 'sharpshooter',
        title: 'Sharpshooter',
        description: 'Maintain 90%+ accuracy after 10 questions',
        icon: '🎯',
        xpReward: 200,
        category: 'accuracy',
        condition: (user) => user.totalQuestionsAnswered >= 10 && (user.totalCorrectAnswers / user.totalQuestionsAnswered) >= 0.9
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete a challenge with 100% accuracy',
        icon: '✨',
        xpReward: 100,
        category: 'accuracy',
        // Note: This needs to be checked per-challenge event, slightly different trigger
        condition: (user, context) => context?.challengeAccuracy === 100
    }
];

export function getAchievementById(id) {
    return achievements.find(a => a.id === id);
}
