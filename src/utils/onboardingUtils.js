/**
 * Calculation heuristics for the dynamic personalized plan.
 * Values are based on goal, experience, and commitment.
 */

const GOAL_BASE_DAYS = {
    'bounty': 90,
    'hired': 120,
    'interview': 60,
    'skills': 45
};

const EXPERIENCE_MULTIPLIER = {
    'beginner': 1.5,
    'intermediate': 1.0,
    'advanced': 0.7
};

const COMMITMENT_MULTIPLIER = {
    '5': 1.6,
    '10': 1.0,
    '15': 0.7
};

export const calculatePersonalizedPlan = (goal, experience, commitment) => {
    // Fallbacks
    const baseDays = GOAL_BASE_DAYS[goal] || 90;
    const expMult = EXPERIENCE_MULTIPLIER[experience] || 1.2;
    const commMult = COMMITMENT_MULTIPLIER[commitment] || 1.1;

    const days = Math.round(baseDays * expMult * commMult);

    // Heuristics for other stats
    const challenges = Math.round(days * 0.55);
    const skills = Math.min(Math.round(days * 0.12), 15);

    // Rank logic
    let rank = 'Top 15%';
    if (commitment === '15' && experience !== 'beginner') rank = 'Top 5%';
    else if (commitment === '10') rank = 'Top 10%';

    return {
        days,
        challenges,
        skills,
        rank,
        subtitle: goal === 'skills' ? 'Until you master your first track' : 'Until your first $500 bounty'
    };
};

export const getMilestones = (goal) => {
    const defaultMilestones = [
        { id: 1, title: 'Foundation', desc: 'Master OWASP Top 10 basics', icon: 'BookOpen', status: 'completed' },
        { id: 2, title: 'Exploitation', desc: 'Practice SQLi & XSS Labs', icon: 'Target', status: 'current' },
        { id: 3, title: 'Recon Pro', desc: 'Master subdomain discovery', icon: 'Zap', status: 'locked' },
        { id: 4, title: 'Bounty Ready', desc: 'Submit your first report', icon: 'Trophy', status: 'locked' }
    ];

    const milestones = {
        'bounty': [
            { id: 1, title: 'Recon Phase', desc: 'Find hidden endpoints', icon: 'Search', status: 'completed' },
            { id: 2, title: 'Initial Access', desc: 'Bypass authentication', icon: 'Lock', status: 'current' },
            { id: 3, title: 'Escalation', desc: 'Gain admin privileges', icon: 'Shield', status: 'locked' },
            { id: 4, title: 'Submission', desc: 'Draft a P1 report', icon: 'FileText', status: 'locked' }
        ],
        'hired': [
            { id: 1, title: 'Skills Audit', desc: 'Assess your weak spots', icon: 'Clipboard', status: 'completed' },
            { id: 2, title: 'Tech Stack', desc: 'Master security tooling', icon: 'Cpu', status: 'current' },
            { id: 3, title: 'Mock Interviews', desc: 'Practice with AI Coach', icon: 'MessageSquare', status: 'locked' },
            { id: 4, title: 'Dream Job', desc: 'Review offer letters', icon: 'Briefcase', status: 'locked' }
        ],
        'interview': [
            { id: 1, title: 'Algo Mastery', desc: 'Data structures for security', icon: 'Binary', status: 'completed' },
            { id: 2, title: 'System Design', desc: 'Secure architecture 101', icon: 'Layout', status: 'current' },
            { id: 3, title: 'Behavioral', desc: 'Master the STAR method', icon: 'UserCheck', status: 'locked' },
            { id: 4, title: 'The Boardroom', desc: 'Pass the final round', icon: 'Award', status: 'locked' }
        ],
        'skills': [
            { id: 1, title: 'Bronze Path', desc: 'Complete 10 easy labs', icon: 'Award', status: 'completed' },
            { id: 2, title: 'Silver Path', desc: 'Master automated scanning', icon: 'Zap', status: 'current' },
            { id: 3, title: 'Gold Path', desc: 'Complete 5 hard challenges', icon: 'Star', status: 'locked' },
            { id: 4, title: 'Elite Status', desc: 'Top 1% of the leaderboard', icon: 'Crown', status: 'locked' }
        ]
    };

    return milestones[goal] || defaultMilestones;
};
