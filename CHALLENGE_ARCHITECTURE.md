# Bugora Challenge Architecture Documentation

## Overview

This document describes the completely redesigned challenge architecture for Bugora, a cybersecurity learning platform. The new system supports multiple challenge types beyond simple multiple-choice quizzes, enabling a richer learning experience.

## Challenge Types

### 1. Multiple Choice (Existing)
Traditional quiz-style challenges with multiple-choice questions.

**Use Case:** Knowledge verification, concept understanding, quick assessments

**Structure:**
```javascript
{
    challengeType: 'multiple_choice',
    id: 'unique-id',
    title: 'Challenge Title',
    description: 'Brief description',
    type: 'SQL Injection', // Vulnerability category
    difficulty: 'easy|medium|hard|expert',
    estimatedTime: 10, // minutes
    isPremium: false,
    xpReward: 100,
    completed: false,
    questions: [
        {
            scenario: 'Context for the question',
            codeBlock: 'vulnerable code snippet (optional)',
            codeLanguage: 'php',
            question: 'The actual question',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0, // index of correct option
            explanation: 'Why this answer is correct',
            hint: 'Progressive hint for learners'
        }
    ],
    resources: {
        internal: [{ title: 'Course Name', path: '/learn/path' }],
        external: [{ title: 'External Resource', url: 'https://...' }]
    }
}
```

### 2. Coding Challenges
Write and submit code to solve security problems with automated validation.

**Use Case:** Building security tools, implementing defenses, writing exploits

**Structure:**
```javascript
{
    challengeType: 'coding',
    id: 'unique-id',
    title: 'Build a SQL Injection Detector',
    description: 'Implement input validation',
    type: 'SQL Injection',
    difficulty: 'medium',
    estimatedTime: 20,
    isPremium: false,
    xpReward: 200,
    completed: false,
    language: 'javascript|python|bash|php',
    objective: 'Clear goal statement',
    scenario: 'Contextual background',
    starterCode: '// Your starting code template',
    hints: [
        'First hint',
        'Second hint',
        'Third hint'
    ],
    validation: {
        type: 'pattern|testcase',
        // For pattern-based validation
        mustContain: [
            {
                pattern: 'regex pattern',
                description: 'What this checks'
            }
        ],
        mustNotContain: [
            {
                pattern: 'regex pattern',
                description: 'Security issues to avoid'
            }
        ],
        // For test case validation
        testCases: [
            {
                description: 'Test case name',
                input: 'test input',
                expected: 'expected output',
                hidden: false // Hide from user?
            }
        ]
    },
    resources: { /* same as above */ }
}
```

**Supported Languages:**
- **JavaScript:** Client-side execution with sandboxed Function()
- **Python:** Pattern-based validation (no client execution)
- **Bash:** Pattern-based validation
- **PHP:** Pattern-based validation

### 3. Lab Challenges (CTF-Style)
Interactive sandboxed environments where users exploit vulnerabilities and capture flags.

**Use Case:** Hands-on exploitation, realistic scenarios, flag capture

**Structure:**
```javascript
{
    challengeType: 'lab',
    id: 'unique-id',
    title: 'E-Commerce SQL Injection Lab',
    description: 'Extract admin credentials',
    type: 'SQL Injection',
    difficulty: 'medium',
    estimatedTime: 30,
    isPremium: true,
    xpReward: 300,
    completed: false,
    objective: 'Clear objective with flag submission',
    scenario: 'Detailed scenario description',
    labEnvironment: {
        type: 'interactive|sandbox|simulation',
        url: 'https://lab.url/iframe', // Optional iframe embed
        mockData: {
            // Simulated environment data
            endpoint: '/api/vulnerable',
            hints: 'environment hints'
        },
        tools: ['Burp Suite', 'curl', 'Browser DevTools']
    },
    flag: {
        format: 'BUGORA{.*}', // Regex format
        value: 'BUGORA{5f4dcc3b5aa765d61d8327deb882cf99}',
        hints: [
            'Progressive hint 1',
            'Progressive hint 2',
            'Progressive hint 3'
        ]
    },
    steps: [
        {
            title: 'Step 1: Identify Injection Point',
            description: 'How to find the vulnerability',
            hints: ['Hint for this step']
        }
    ],
    resources: { /* same as above */ }
}
```

**Flag Format:**
- Standard: `BUGORA{...}`
- Custom regex patterns supported
- Case-sensitive validation
- Format validation before correctness check

### 4. Practical Challenges
Step-by-step guided challenges with progressive learning and validation at each step.

**Use Case:** Guided exploitation, learning paths, skill building

**Structure:**
```javascript
{
    challengeType: 'practical',
    id: 'unique-id',
    title: 'XSS Attack Chain',
    description: 'Learn XSS from discovery to exploitation',
    type: 'XSS',
    difficulty: 'medium',
    estimatedTime: 25,
    isPremium: false,
    xpReward: 250,
    completed: false,
    objective: 'Complete all exploitation steps',
    scenario: 'Challenge context',
    steps: [
        {
            id: 'step-1',
            title: 'Identify Vulnerability Type',
            description: 'What kind of XSS is this?',
            type: 'multiple_choice|text|regex|command|payload',
            hints: ['Hint 1', 'Hint 2'],
            validation: {
                // Type-specific validation
                type: 'multiple_choice',
                options: ['Option A', 'Option B'],
                correctAnswer: 0,
                successMessage: 'Great! That\'s correct.',
                errorMessage: 'Not quite. Try again.'
            }
        },
        {
            id: 'step-2',
            title: 'Craft Payload',
            description: 'Create an XSS payload',
            type: 'payload',
            hints: ['Use event handlers', 'Try img or svg tags'],
            validation: {
                type: 'payload',
                category: 'xss',
                checks: [
                    {
                        type: 'required|forbidden',
                        pattern: 'regex',
                        message: 'Check description'
                    }
                ],
                successMessage: 'Payload validated!',
                errorMessage: 'Payload issues found.'
            }
        }
    ],
    resources: { /* same as above */ }
}
```

**Step Types:**
- `multiple_choice`: Select from options
- `text`: Free text input with exact match
- `regex`: Pattern-based answer validation
- `command`: Shell command validation
- `payload`: Security payload validation

## Validation System

### File: `/src/utils/challengeValidation.js`

#### Coding Challenge Validation

```javascript
// JavaScript validation (executes client-side)
validateJavaScriptCode(userCode, testCases)
// Returns: { success, passed, total, results, feedback }

// Python validation (pattern-based)
validatePythonCode(userCode, testCases)
// Returns: { success, passed, total, results, feedback }
```

#### Lab Challenge Validation

```javascript
// Flag validation
validateFlag(userFlag, correctFlag, format)
// Returns: { success, feedback, hint, flagValue }

// Multi-step lab validation
validateLabSteps(completedSteps, requiredSteps)
// Returns: { success, completed, total, missing, feedback }
```

#### Practical Challenge Validation

```javascript
// Step validation (routes to type-specific validator)
validatePracticalStep(stepId, userAnswer, stepConfig)
// Returns: { success, feedback, issues }

// Available validators:
- validateTextAnswer(answer, validation)
- validateRegexAnswer(answer, validation)
- validateMultipleChoice(answer, validation)
- validateCommand(command, validation)
- validatePayload(payload, validation)
```

## Resource Recommendation System

### Automatic Resource Linking

The system automatically provides learning resources based on challenge type and performance:

```javascript
getRecommendedResources(challengeType, userPerformance)
// Returns: { internal: [...], external: [...] }
```

**Supported Categories:**
- SQL Injection
- XSS
- IDOR
- CSRF
- Command Injection
- (Extensible for all vulnerability types)

**Resource Types:**
- **Internal:** Links to Bugora courses and tutorials
- **External:** Links to PortSwigger, OWASP, HackTheBox, etc.

## Hints System

### Progressive Hints

Hints are provided progressively with XP penalties:

```javascript
// Single hint penalty: -15% XP
// Max penalty: -50% XP (capped)

calculateHintPenalty(hintsUsed, maxHints)
// Returns: multiplier (0.5 to 1.0)
```

### Hint Levels

1. **Level 1:** Conceptual guidance
2. **Level 2:** Technical direction
3. **Level 3:** Specific approach
4. **Level 4:** Partial solution
5. **Level 5:** Nearly complete solution

## XP Calculation

### Base XP Formula

```javascript
// Multiple Choice
xpPerQuestion = challengeXpReward / totalQuestions
finalXp = xpPerQuestion * hintMultiplier

// Coding/Lab/Practical
baseXp = challengeXpReward
finalXp = baseXp * hintMultiplier

// Hint multiplier
hintMultiplier = Math.max(1 - (hintsUsed * 0.15), 0.5)
```

### Replay Protection

Challenges that are replayed award 0 XP to prevent farming:

```javascript
if (isReplay || alreadyCompleted) {
    xpEarned = 0;
}
```

## Component Structure

### File Organization

```
src/
├── components/
│   └── challenges/
│       ├── MultipleChoiceChallenge.jsx
│       ├── CodingChallenge.jsx
│       ├── LabChallenge.jsx
│       ├── PracticalChallenge.jsx
│       └── ChallengeComponents.css
├── pages/
│   ├── ChallengeDetail.jsx (original)
│   └── ChallengeDetailNew.jsx (new router)
├── utils/
│   ├── challengeValidation.js
│   ├── challengeTypes.js
│   └── xp.js
└── data/
    └── challenges.js
```

### Component Props

All challenge components receive:

```javascript
{
    challenge: Object,      // Challenge data
    onComplete: Function   // Completion callback
}

// onComplete receives:
{
    success: Boolean,
    xpEarned: Number,
    hintsUsed: Number,
    ...additionalData
}
```

## Styling System

All challenge components use the existing dark theme with lime green accents:

**CSS Variables Used:**
- `--neon-green`: Primary accent (#9FEF00)
- `--neon-pink`: Error state (#FF0055)
- `--neon-orange`: Warning/hints (#FF5E00)
- `--bg-card`: Card backgrounds
- `--border-color`: Subtle borders
- `--text-primary`: Main text
- `--text-secondary`: Secondary text

## Adding New Challenge Types

### Step 1: Define Challenge Structure

Add to `/src/utils/challengeTypes.js`:

```javascript
export const NewChallengeSchema = {
    challengeType: 'new_type',
    // ... your structure
};
```

### Step 2: Create Validation Logic

Add to `/src/utils/challengeValidation.js`:

```javascript
export function validateNewType(data, config) {
    // Validation logic
    return { success, feedback };
}
```

### Step 3: Create Component

Create `/src/components/challenges/NewTypeChallenge.jsx`:

```javascript
export default function NewTypeChallenge({ challenge, onComplete }) {
    // Your component logic
}
```

### Step 4: Register in Router

Add to `/src/pages/ChallengeDetailNew.jsx`:

```javascript
case 'new_type':
    return <NewTypeChallenge challenge={challenge} onComplete={handleComplete} />;
```

### Step 5: Create Example Challenge

Add to `/src/data/challenges.js`:

```javascript
{
    id: 'new-1',
    challengeType: 'new_type',
    // ... your challenge data
}
```

## Best Practices

### 1. Challenge Design

- **Clear Objectives:** Every challenge should have a specific, measurable goal
- **Progressive Difficulty:** Start simple, build complexity
- **Realistic Scenarios:** Base challenges on real-world vulnerabilities
- **Educational Value:** Every challenge should teach something new

### 2. Validation Design

- **Secure:** Never trust client-side validation alone
- **Helpful Feedback:** Give actionable error messages
- **Fair:** Don't penalize creative solutions
- **Comprehensive:** Test edge cases

### 3. Resource Curation

- **Quality over Quantity:** Link to high-quality resources
- **Up-to-date:** Regularly review external links
- **Varied Sources:** Mix official docs, tutorials, and practical exercises
- **Progressive:** Link basic resources for beginners, advanced for experts

### 4. Performance

- **Lazy Loading:** Load challenge data on demand
- **Efficient Validation:** Run validation client-side when safe
- **Caching:** Cache resources and static content
- **Optimized Assets:** Compress and optimize all assets

## Security Considerations

### Client-Side Code Execution

**JavaScript Challenges:**
- Use `new Function()` with limited scope
- No access to global objects
- Timeout after 5 seconds
- Memory limits enforced

**Warning:** For production, move code execution to sandboxed backend.

### Flag Storage

Flags are currently stored in plaintext in challenges.js. For production:

```javascript
// Hash flags server-side
const flagHash = sha256(userFlag);
validateFlagHash(flagHash, storedHash);

// Or encrypt
const encryptedFlag = encrypt(flag, secret);
```

### Input Validation

All user input must be validated:
- Sanitize before display
- Validate length limits
- Check for malicious patterns
- Rate limit submissions

## Future Enhancements

### Planned Features

1. **Interactive Labs:** Full VM integration for real exploitation
2. **Team Challenges:** Collaborative multi-player challenges
3. **Dynamic Challenges:** Procedurally generated variations
4. **Video Walkthroughs:** Step-by-step video guides
5. **AI Hints:** GPT-powered contextual hints
6. **Leaderboards:** Competition and ranking
7. **Badge System:** Visual achievement collection
8. **Challenge Creator:** User-generated challenges

### API Integration

Future backend API structure:

```javascript
// Submit code for validation
POST /api/challenges/:id/validate
{
    type: 'coding',
    language: 'python',
    code: 'user code'
}

// Submit flag
POST /api/challenges/:id/flag
{
    flag: 'BUGORA{...}'
}

// Get lab environment
GET /api/challenges/:id/lab
Response: { url, token, expires }
```

## Troubleshooting

### Common Issues

**Challenge won't load:**
- Check challenge ID in URL
- Verify challenge exists in challenges.js
- Check browser console for errors

**Validation not working:**
- Verify validation config is correct
- Check validation function exists
- Test with simple inputs first

**XP not awarded:**
- Confirm user is authenticated
- Check if challenge already completed
- Verify Firestore permissions

**Resources not showing:**
- Check resources object structure
- Verify URLs are accessible
- Check component prop drilling

## Examples

See `/src/data/challenges.js` for complete examples of each challenge type:

- Challenge #34: Coding (JavaScript validator)
- Challenge #35: Lab (SQL injection flag capture)
- Challenge #36: Practical (XSS step-by-step)
- Challenge #37: Coding (Python pattern validation)
- Challenge #38: Lab (IDOR simulation)

## Support

For questions or contributions:
- Review existing challenge implementations
- Check validation utility functions
- Test thoroughly before deploying
- Document any new patterns or features

---

**Last Updated:** 2026-02-05
**Version:** 2.0.0
**Architecture:** Multi-Type Challenge System
