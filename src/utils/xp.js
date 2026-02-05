/**
 * XP and Level Calculation Utilities
 * 
 * Level formula: Each level requires progressively more XP
 * Level 1: 0-999 XP
 * Level 2: 1000-2499 XP (1000 to level up)
 * Level 3: 2500-4499 XP (1500 to level up)
 * Level 4: 4500-6999 XP (2000 to level up)
 * etc.
 */

// XP required to reach each level (cumulative)
const LEVEL_THRESHOLDS = [
    0,      // Level 1 starts at 0
    1000,   // Level 2
    2500,   // Level 3
    4500,   // Level 4
    7000,   // Level 5
    10000,  // Level 6
    14000,  // Level 7
    19000,  // Level 8
    25000,  // Level 9
    32000,  // Level 10
    40000,  // Level 11
    50000,  // Level 12
    62000,  // Level 13
    76000,  // Level 14
    92000,  // Level 15
    110000, // Level 16
    130000, // Level 17
    155000, // Level 18
    185000, // Level 19
    220000, // Level 20 (max displayed, but can go higher)
];

const LEVEL_TITLES = [
    'Beginner',           // 1
    'Script Kiddie',      // 2
    'Bug Hunter',         // 3
    'Security Analyst',   // 4
    'Penetration Tester', // 5
    'Exploit Developer',  // 6
    'Red Team Operator',  // 7
    'Security Engineer',  // 8
    'Senior Pentester',   // 9
    'Security Architect', // 10
    'Threat Hunter',      // 11
    'APT Specialist',     // 12
    'Zero-Day Hunter',    // 13
    'Elite Hacker',       // 14
    'Bug Bounty Legend',  // 15
    'CISO Material',      // 16
    'Cyber Ninja',        // 17
    'Master Hacker',      // 18
    'Digital Ghost',      // 19
    'Legendary',          // 20+
];

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXp >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

/**
 * Get XP needed to reach next level
 */
export function getXpToNextLevel(totalXp) {
    const currentLevel = calculateLevel(totalXp);
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        // Max level - show high number
        return 999999;
    }
    return LEVEL_THRESHOLDS[currentLevel] - totalXp;
}

/**
 * Get XP progress within current level (0-100%)
 */
export function getLevelProgress(totalXp) {
    const level = calculateLevel(totalXp);
    if (level >= LEVEL_THRESHOLDS.length) return 100;

    const currentLevelXp = LEVEL_THRESHOLDS[level - 1];
    const nextLevelXp = LEVEL_THRESHOLDS[level];
    const xpInLevel = totalXp - currentLevelXp;
    const xpNeeded = nextLevelXp - currentLevelXp;

    return Math.round((xpInLevel / xpNeeded) * 100);
}

/**
 * Get title for a level
 */
export function getLevelTitle(level) {
    const index = Math.min(level - 1, LEVEL_TITLES.length - 1);
    return LEVEL_TITLES[index];
}

/**
 * Calculate XP earned for a question
 */
export function calculateQuestionXp(challengeXpReward, totalQuestions, isCorrect, hintsUsedCount = 0) {
    if (!isCorrect) return 0;

    const baseQuestionXp = Math.round(challengeXpReward / totalQuestions);
    const hintPenalty = (typeof hintsUsedCount === 'number' ? hintsUsedCount : (hintsUsedCount ? 1 : 0)) * 0.15;
    const xpMultiplier = Math.max(1 - hintPenalty, 0.5);

    return Math.round(baseQuestionXp * xpMultiplier);
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(previousXp, newXp) {
    const previousLevel = calculateLevel(previousXp);
    const newLevel = calculateLevel(newXp);

    if (newLevel > previousLevel) {
        return {
            leveledUp: true,
            newLevel,
            newTitle: getLevelTitle(newLevel),
        };
    }
    return { leveledUp: false };
}

/**
 * Format XP display (e.g., 1500 -> "1.5K")
 */
export function formatXp(xp) {
    if (xp >= 1000000) {
        return `${(xp / 1000000).toFixed(1)}M`;
    }
    if (xp >= 1000) {
        return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
}
