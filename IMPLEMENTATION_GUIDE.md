# Challenge Architecture Implementation Guide

## Quick Start

### 1. Using the New Challenge System

To use the new challenge architecture, update your route to use the new component:

**Option A: Replace existing route (Breaking Change)**

```javascript
// In App.jsx or your router file
import ChallengeDetailNew from './pages/ChallengeDetailNew';

// Replace
<Route path="/challenge/:id" element={<ChallengeDetail />} />

// With
<Route path="/challenge/:id" element={<ChallengeDetailNew />} />
```

**Option B: Add as new route (Safe Migration)**

```javascript
// Keep both versions during migration
<Route path="/challenge/:id" element={<ChallengeDetail />} />
<Route path="/challenge-v2/:id" element={<ChallengeDetailNew />} />
```

### 2. Adding Your First New Challenge

#### Coding Challenge Example

```javascript
// In src/data/challenges.js

{
    id: '100',
    challengeType: 'coding',
    title: 'XSS Filter Bypass',
    description: 'Write JavaScript to detect XSS bypass attempts',
    type: 'XSS',
    difficulty: 'medium',
    estimatedTime: 15,
    isPremium: false,
    xpReward: 180,
    completed: false,
    language: 'javascript',
    objective: 'Create a function that detects common XSS filter bypass techniques',
    scenario: 'Web application has basic XSS filters. Write a detector for bypass attempts.',
    starterCode: `function detectXSSBypass(input) {
    // Your code here

    return false;
}`,
    hints: [
        'Check for HTML entity encoding',
        'Look for case variation in tag names',
        'Check for nested tag patterns'
    ],
    validation: {
        type: 'testcase',
        testCases: [
            {
                description: 'Detect case variation',
                input: '<ScRiPt>alert(1)</sCrIpT>',
                expected: true,
                hidden: false
            },
            {
                description: 'Detect nested tags',
                input: '<scr<script>ipt>alert(1)</scr</script>ipt>',
                expected: true,
                hidden: false
            },
            {
                description: 'Allow normal input',
                input: 'Hello World',
                expected: false,
                hidden: false
            }
        ]
    },
    resources: {
        internal: [
            { title: 'XSS Fundamentals', path: '/learn/xss-basics' }
        ],
        external: [
            { title: 'OWASP XSS Cheat Sheet', url: 'https://owasp.org/www-community/attacks/xss/' }
        ]
    }
}
```

#### Lab Challenge Example

```javascript
{
    id: '101',
    challengeType: 'lab',
    title: 'Command Injection Lab',
    description: 'Exploit command injection to read sensitive files',
    type: 'Command Injection',
    difficulty: 'hard',
    estimatedTime: 35,
    isPremium: true,
    xpReward: 350,
    completed: false,
    objective: 'Find command injection vulnerability and extract the flag from /etc/flag.txt',
    scenario: 'A network diagnostic tool allows you to ping hosts. The input is not properly sanitized.',
    labEnvironment: {
        type: 'simulation',
        mockData: {
            endpoint: '/api/ping?host=',
            vulnerable_param: 'host',
            flag_location: '/etc/flag.txt'
        },
        tools: ['curl', 'Browser DevTools', 'Burp Suite']
    },
    flag: {
        format: 'FLAG{[A-Z0-9_]+}',
        value: 'FLAG{COMMAND_INJECTION_SUCCESS}',
        hints: [
            'Try adding shell metacharacters to the host parameter',
            'Use semicolon (;) or pipe (|) to chain commands',
            'The flag is in /etc/flag.txt',
            'Try: ; cat /etc/flag.txt',
            'Submit the complete flag including FLAG{...}'
        ]
    },
    steps: [
        {
            title: 'Test for Command Injection',
            description: 'Add shell metacharacters to see if command execution occurs',
            hints: ['Try: 127.0.0.1; whoami', 'Look for command output in response']
        },
        {
            title: 'Read the Flag',
            description: 'Use command injection to read /etc/flag.txt',
            hints: ['Use cat command', 'Chain with semicolon or pipe']
        }
    ],
    resources: {
        internal: [
            { title: 'Command Injection Guide', path: '/learn/command-injection' }
        ],
        external: [
            { title: 'PortSwigger OS Command Injection', url: 'https://portswigger.net/web-security/os-command-injection' }
        ]
    }
}
```

#### Practical Challenge Example

```javascript
{
    id: '102',
    challengeType: 'practical',
    title: 'IDOR Exploitation Walkthrough',
    description: 'Learn to identify and exploit IDOR vulnerabilities',
    type: 'IDOR',
    difficulty: 'easy',
    estimatedTime: 20,
    isPremium: false,
    xpReward: 200,
    completed: false,
    objective: 'Complete all steps to understand IDOR exploitation',
    scenario: 'A web application allows users to view their profile at /user/profile?id=123',
    steps: [
        {
            id: 'idor-step-1',
            title: 'What is IDOR?',
            description: 'Select the correct definition of IDOR',
            type: 'multiple_choice',
            hints: ['IDOR stands for Insecure Direct Object Reference'],
            validation: {
                type: 'multiple_choice',
                options: [
                    'A vulnerability where authorization is not checked before accessing objects',
                    'A type of SQL injection',
                    'A cross-site scripting attack',
                    'A denial of service attack'
                ],
                correctAnswer: 0,
                successMessage: 'Correct! IDOR occurs when authorization is missing.',
                errorMessage: 'Not quite. Think about access control.'
            }
        },
        {
            id: 'idor-step-2',
            title: 'Identify the Vulnerable Parameter',
            description: 'What parameter would you test for IDOR?',
            type: 'text',
            hints: ['Look at the URL', 'Which parameter identifies the user?'],
            validation: {
                type: 'text',
                correctAnswers: ['id', 'user id', 'userid'],
                caseSensitive: false,
                successMessage: 'Yes! The id parameter is the direct object reference.',
                errorMessage: 'Look at the URL more carefully.'
            }
        },
        {
            id: 'idor-step-3',
            title: 'Craft Exploitation Request',
            description: 'What value would you try to access another user\'s profile?',
            type: 'text',
            hints: [
                'Try incrementing or decrementing the ID',
                'Start with simple changes like 122 or 124'
            ],
            validation: {
                type: 'regex',
                pattern: '^\\d+$',
                flags: '',
                successMessage: 'Good! You would try different numeric IDs.',
                errorMessage: 'Enter a numeric user ID to test.'
            }
        },
        {
            id: 'idor-step-4',
            title: 'Fix the Vulnerability',
            description: 'How should the application prevent IDOR?',
            type: 'multiple_choice',
            hints: ['Think about authorization checks'],
            validation: {
                type: 'multiple_choice',
                options: [
                    'Verify the requesting user owns the requested resource',
                    'Use longer IDs',
                    'Encrypt the ID parameter',
                    'Use POST instead of GET'
                ],
                correctAnswer: 0,
                successMessage: 'Perfect! Authorization is the key defense.',
                errorMessage: 'Consider what actually prevents unauthorized access.'
            }
        }
    ],
    resources: {
        internal: [
            { title: 'IDOR Testing Guide', path: '/learn/idor' }
        ],
        external: [
            { title: 'OWASP Access Control', url: 'https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control' }
        ]
    }
}
```

## Testing Your Challenges

### 1. Test Multiple Choice

```bash
# Navigate to challenge
http://localhost:3000/challenge/1

# Verify:
- Questions load correctly
- Options are clickable
- Correct/incorrect feedback shows
- XP is awarded properly
- Progress is saved
```

### 2. Test Coding Challenge

```bash
# Navigate to coding challenge
http://localhost:3000/challenge/34

# Verify:
- Code editor loads
- Starter code appears
- Run button works
- Test cases validate
- Results display correctly
- XP calculation includes hint penalty
```

### 3. Test Lab Challenge

```bash
# Navigate to lab challenge
http://localhost:3000/challenge/35

# Verify:
- Lab environment loads
- Steps are navigable
- Flag input validates format
- Flag submission works
- Progressive hints unlock
- Resources display
```

### 4. Test Practical Challenge

```bash
# Navigate to practical challenge
http://localhost:3000/challenge/36

# Verify:
- Step navigation works
- Progress tracker updates
- Input types render correctly
- Validation works per step
- Next step unlocks after completion
- Final completion triggers
```

## Common Customizations

### 1. Add New Validation Pattern

```javascript
// In src/utils/challengeValidation.js

export function validateCustomType(input, config) {
    // Your custom validation logic

    return {
        success: boolean,
        feedback: string,
        details: object // optional
    };
}
```

### 2. Add New Step Type

```javascript
// In PracticalChallenge.jsx

case 'your_new_type':
    return (
        <div className="custom-input">
            {/* Your custom input component */}
        </div>
    );
```

### 3. Add Custom Styling

```css
/* In ChallengeComponents.css */

.your-custom-class {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
}

/* Follow existing patterns:
   - Use CSS variables
   - Dark theme with neon accents
   - Responsive design
   - Touch-friendly sizing
*/
```

### 4. Add Resource Categories

```javascript
// In challengeValidation.js

export function getRecommendedResources(challengeType, userPerformance) {
    const resources = {
        'Your New Type': {
            internal: [
                { title: 'Internal Course', path: '/learn/path' }
            ],
            external: [
                { title: 'External Resource', url: 'https://...' }
            ]
        }
    };

    return resources[challengeType] || defaultResources;
}
```

## Updating Existing Challenges

### Add Resources to Existing Challenges

```javascript
// In challenges.js, add to existing challenges:

{
    id: '1', // existing challenge
    // ... existing fields ...
    resources: {
        internal: [
            { title: 'SQL Injection Basics', path: '/learn/sqli' }
        ],
        external: [
            { title: 'PortSwigger SQL Injection', url: 'https://portswigger.net/web-security/sql-injection' },
            { title: 'OWASP SQL Injection', url: 'https://owasp.org/www-community/attacks/SQL_Injection' }
        ]
    }
}
```

## Migration Checklist

- [ ] All existing challenges have `challengeType: 'multiple_choice'`
- [ ] New challenge types added to challenges.js
- [ ] Validation functions tested
- [ ] UI components render correctly
- [ ] XP calculation works with hints
- [ ] Progress saving works
- [ ] Resources display properly
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation)
- [ ] Error handling in place

## Performance Optimization

### 1. Lazy Load Challenge Components

```javascript
// In ChallengeDetailNew.jsx
const CodingChallenge = lazy(() => import('../components/challenges/CodingChallenge'));
const LabChallenge = lazy(() => import('../components/challenges/LabChallenge'));
// etc...

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
    {renderChallengeComponent()}
</Suspense>
```

### 2. Memoize Heavy Computations

```javascript
import { useMemo } from 'react';

const validationResult = useMemo(() => {
    return validateCode(code, testCases);
}, [code, testCases]);
```

### 3. Debounce Real-time Validation

```javascript
import { debounce } from 'lodash';

const debouncedValidate = useMemo(
    () => debounce((value) => {
        // Validation logic
    }, 500),
    []
);
```

## Deployment

### Pre-deployment Checklist

- [ ] Test all challenge types
- [ ] Verify XP calculations
- [ ] Check Firestore permissions
- [ ] Test on mobile devices
- [ ] Verify external resource links
- [ ] Check flag validation security
- [ ] Test with premium/free accounts
- [ ] Verify replay protection
- [ ] Check hint penalty calculation
- [ ] Test challenge completion flow

### Production Considerations

1. **Security:**
   - Move code execution to backend
   - Hash/encrypt flags
   - Rate limit submissions
   - Sanitize all user input

2. **Performance:**
   - CDN for static assets
   - Lazy load components
   - Cache challenge data
   - Optimize images

3. **Monitoring:**
   - Track completion rates
   - Monitor validation errors
   - Log suspicious activity
   - Analytics on popular challenges

## Support

### Debugging Tips

1. **Challenge won't load:**
   - Check console for errors
   - Verify challenge ID exists
   - Check challengeType field

2. **Validation failing:**
   - Console.log validation input/output
   - Test validation function in isolation
   - Check validation config syntax

3. **XP not calculating:**
   - Verify XP calculation formula
   - Check hint penalty application
   - Confirm user authentication

4. **Components not styling:**
   - Import ChallengeComponents.css
   - Check CSS variable usage
   - Verify class names match

### Getting Help

- Review `CHALLENGE_ARCHITECTURE.md` for detailed documentation
- Check example challenges in `challenges.js`
- Test validation functions directly in browser console
- Review existing challenge component implementations

---

**Ready to build amazing challenges!** 🚀
