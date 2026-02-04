/**
 * Challenge Type Definitions
 *
 * Defines the structure and configuration for different challenge types
 */

export const CHALLENGE_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    CODING: 'coding',
    LAB: 'lab',
    PRACTICAL: 'practical'
};

export const CHALLENGE_DIFFICULTIES = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    EXPERT: 'expert'
};

export const VULNERABILITY_CATEGORIES = {
    SQL_INJECTION: 'SQL Injection',
    XSS: 'XSS',
    IDOR: 'IDOR',
    CSRF: 'CSRF',
    AUTH_BYPASS: 'Auth Bypass',
    FILE_UPLOAD: 'File Upload',
    COMMAND_INJECTION: 'Command Injection',
    PATH_TRAVERSAL: 'Path Traversal',
    SSRF: 'SSRF',
    XXE: 'XXE',
    SSTI: 'SSTI',
    DESERIALIZATION: 'Deserialization',
    RACE_CONDITION: 'Race Condition',
    AUTHENTICATION: 'Authentication',
    CRYPTOGRAPHY: 'Cryptography'
};

/**
 * Multiple Choice Challenge Structure
 */
export const MultipleChoiceSchema = {
    challengeType: CHALLENGE_TYPES.MULTIPLE_CHOICE,
    id: 'string',
    title: 'string',
    description: 'string',
    type: 'vulnerability category',
    difficulty: 'easy|medium|hard|expert',
    estimatedTime: 'number (minutes)',
    isPremium: 'boolean',
    xpReward: 'number',
    completed: 'boolean',
    questions: [
        {
            scenario: 'string (optional)',
            codeBlock: 'string (optional)',
            codeLanguage: 'string (optional)',
            question: 'string',
            options: ['string array'],
            correctAnswer: 'number (index)',
            explanation: 'string',
            hint: 'string'
        }
    ],
    resources: {
        internal: [{ title: 'string', path: 'string' }],
        external: [{ title: 'string', url: 'string' }]
    }
};

/**
 * Coding Challenge Structure
 */
export const CodingChallengeSchema = {
    challengeType: CHALLENGE_TYPES.CODING,
    id: 'string',
    title: 'string',
    description: 'string',
    type: 'vulnerability category',
    difficulty: 'easy|medium|hard|expert',
    estimatedTime: 'number (minutes)',
    isPremium: 'boolean',
    xpReward: 'number',
    completed: 'boolean',
    language: 'python|javascript|bash|php',
    objective: 'string',
    scenario: 'string',
    starterCode: 'string (optional)',
    hints: ['string array'],
    validation: {
        type: 'pattern|testcase',
        testCases: [
            {
                description: 'string',
                input: 'any',
                expected: 'any',
                hidden: 'boolean (optional)'
            }
        ],
        // OR for pattern-based validation
        mustContain: [
            {
                pattern: 'regex string',
                description: 'what this checks for'
            }
        ],
        mustNotContain: [
            {
                pattern: 'regex string',
                description: 'security issue to avoid'
            }
        ]
    },
    resources: {
        internal: [{ title: 'string', path: 'string' }],
        external: [{ title: 'string', url: 'string' }]
    }
};

/**
 * Lab Challenge Structure (CTF-style)
 */
export const LabChallengeSchema = {
    challengeType: CHALLENGE_TYPES.LAB,
    id: 'string',
    title: 'string',
    description: 'string',
    type: 'vulnerability category',
    difficulty: 'easy|medium|hard|expert',
    estimatedTime: 'number (minutes)',
    isPremium: 'boolean',
    xpReward: 'number',
    completed: 'boolean',
    objective: 'string',
    scenario: 'string',
    labEnvironment: {
        type: 'interactive|sandbox|simulation',
        url: 'string (optional - for iframe embed)',
        mockData: 'object (for simulated environments)',
        tools: ['burp', 'curl', 'sqlmap', 'etc']
    },
    flag: {
        format: 'BUGORA{.*}',
        value: 'string (hashed or encrypted in production)',
        hints: ['progressive hint array']
    },
    steps: [
        {
            title: 'string',
            description: 'string',
            hints: ['string array']
        }
    ],
    resources: {
        internal: [{ title: 'string', path: 'string' }],
        external: [{ title: 'string', url: 'string' }]
    }
};

/**
 * Practical Challenge Structure (Step-by-step guided)
 */
export const PracticalChallengeSchema = {
    challengeType: CHALLENGE_TYPES.PRACTICAL,
    id: 'string',
    title: 'string',
    description: 'string',
    type: 'vulnerability category',
    difficulty: 'easy|medium|hard|expert',
    estimatedTime: 'number (minutes)',
    isPremium: 'boolean',
    xpReward: 'number',
    completed: 'boolean',
    objective: 'string',
    scenario: 'string',
    steps: [
        {
            id: 'string',
            title: 'string',
            description: 'string',
            type: 'text|regex|multiple_choice|command|payload',
            hints: ['string array'],
            validation: {
                // Type-specific validation config
                type: 'text|regex|multiple_choice|command|payload',
                // For text validation
                correctAnswers: ['string array'],
                caseSensitive: 'boolean',
                // For regex validation
                pattern: 'string',
                flags: 'string (optional)',
                // For multiple choice
                options: ['string array'],
                correctAnswer: 'number',
                // For command validation
                mustContain: ['string array'],
                mustNotContain: ['string array'],
                exactMatch: 'string (optional)',
                // For payload validation
                category: 'sqli|xss|command|etc',
                checks: [
                    {
                        type: 'required|forbidden',
                        pattern: 'regex',
                        message: 'string'
                    }
                ],
                // Messages
                successMessage: 'string',
                errorMessage: 'string'
            }
        }
    ],
    resources: {
        internal: [{ title: 'string', path: 'string' }],
        external: [{ title: 'string', url: 'string' }]
    }
};

/**
 * Helper function to create a basic challenge template
 */
export function createChallengeTemplate(type, overrides = {}) {
    const baseChallenge = {
        id: '',
        title: '',
        description: '',
        type: '',
        difficulty: CHALLENGE_DIFFICULTIES.MEDIUM,
        estimatedTime: 10,
        isPremium: false,
        xpReward: 100,
        completed: false,
        resources: {
            internal: [],
            external: []
        }
    };

    return {
        ...baseChallenge,
        challengeType: type,
        ...overrides
    };
}

/**
 * Validate challenge structure
 */
export function validateChallengeStructure(challenge) {
    const errors = [];

    // Required fields
    if (!challenge.id) errors.push('Missing challenge ID');
    if (!challenge.title) errors.push('Missing challenge title');
    if (!challenge.challengeType) errors.push('Missing challenge type');
    if (!challenge.type) errors.push('Missing vulnerability type');

    // Type-specific validation
    switch (challenge.challengeType) {
        case CHALLENGE_TYPES.MULTIPLE_CHOICE:
            if (!challenge.questions || challenge.questions.length === 0) {
                errors.push('Multiple choice challenge must have questions');
            }
            break;

        case CHALLENGE_TYPES.CODING:
            if (!challenge.language) errors.push('Coding challenge must specify language');
            if (!challenge.validation) errors.push('Coding challenge must have validation');
            break;

        case CHALLENGE_TYPES.LAB:
            if (!challenge.flag) errors.push('Lab challenge must have a flag');
            if (!challenge.labEnvironment) errors.push('Lab challenge must have environment config');
            break;

        case CHALLENGE_TYPES.PRACTICAL:
            if (!challenge.steps || challenge.steps.length === 0) {
                errors.push('Practical challenge must have steps');
            }
            break;

        default:
            errors.push('Unknown challenge type');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
