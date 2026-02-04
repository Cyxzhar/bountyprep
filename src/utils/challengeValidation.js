/**
 * Challenge Validation Utilities
 *
 * Handles validation logic for different challenge types:
 * - Multiple Choice (existing)
 * - Coding Challenges
 * - Lab Challenges (CTF-style flag capture)
 * - Practical Challenges (step-by-step scenarios)
 */

// ============ CODING CHALLENGE VALIDATORS ============

/**
 * Validate Python code challenge
 */
export function validatePythonCode(userCode, testCases) {
    const results = [];

    try {
        // Since we can't execute Python in browser, we'll use pattern matching
        // In production, this would call a sandboxed backend API
        for (const testCase of testCases) {
            const result = validateCodePattern(userCode, testCase);
            results.push(result);
        }

        const passed = results.filter(r => r.passed).length;
        const total = results.length;

        return {
            success: passed === total,
            passed,
            total,
            results,
            feedback: passed === total
                ? 'All test cases passed!'
                : `${passed}/${total} test cases passed`
        };
    } catch (error) {
        return {
            success: false,
            passed: 0,
            total: testCases.length,
            results: [],
            feedback: `Error: ${error.message}`
        };
    }
}

/**
 * Validate JavaScript code challenge
 */
export function validateJavaScriptCode(userCode, testCases) {
    const results = [];

    try {
        // Create a sandboxed function (limited security - production needs backend)
        const userFunction = new Function('input', `
            ${userCode}
            return result;
        `);

        for (const testCase of testCases) {
            try {
                const output = userFunction(testCase.input);
                const passed = JSON.stringify(output) === JSON.stringify(testCase.expected);

                results.push({
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: output,
                    passed,
                    description: testCase.description
                });
            } catch (error) {
                results.push({
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: null,
                    passed: false,
                    description: testCase.description,
                    error: error.message
                });
            }
        }

        const passed = results.filter(r => r.passed).length;
        const total = results.length;

        return {
            success: passed === total,
            passed,
            total,
            results,
            feedback: passed === total
                ? 'All test cases passed!'
                : `${passed}/${total} test cases passed`
        };
    } catch (error) {
        return {
            success: false,
            passed: 0,
            total: testCases.length,
            results: [],
            feedback: `Syntax Error: ${error.message}`
        };
    }
}

/**
 * Validate code pattern (for languages we can't execute client-side)
 */
function validateCodePattern(code, testCase) {
    const { pattern, description, mustContain, mustNotContain } = testCase;
    const issues = [];

    // Check required patterns
    if (mustContain) {
        for (const requirement of mustContain) {
            const regex = new RegExp(requirement.pattern, 'i');
            if (!regex.test(code)) {
                issues.push(`Missing: ${requirement.description}`);
            }
        }
    }

    // Check forbidden patterns (security issues)
    if (mustNotContain) {
        for (const forbidden of mustNotContain) {
            const regex = new RegExp(forbidden.pattern, 'i');
            if (regex.test(code)) {
                issues.push(`Security issue: ${forbidden.description}`);
            }
        }
    }

    const passed = issues.length === 0;

    return {
        passed,
        description,
        issues,
        feedback: passed ? 'Pattern validated successfully' : issues.join(', ')
    };
}

// ============ LAB CHALLENGE VALIDATORS ============

/**
 * Validate CTF flag format and correctness
 */
export function validateFlag(userFlag, correctFlag, format = 'BUGORA{.*}') {
    const trimmedFlag = userFlag.trim();

    // Check format
    const formatRegex = new RegExp(`^${format}$`);
    if (!formatRegex.test(trimmedFlag)) {
        return {
            success: false,
            feedback: `Invalid flag format. Expected format: ${format}`,
            hint: 'Make sure your flag follows the correct format'
        };
    }

    // Check correctness (case-sensitive)
    if (trimmedFlag === correctFlag) {
        return {
            success: true,
            feedback: 'Correct flag! Challenge completed!',
            flagValue: trimmedFlag
        };
    }

    // Check case-insensitive for better feedback
    if (trimmedFlag.toLowerCase() === correctFlag.toLowerCase()) {
        return {
            success: false,
            feedback: 'Flag content is correct but case is wrong',
            hint: 'Flags are case-sensitive. Check your capitalization.'
        };
    }

    return {
        success: false,
        feedback: 'Incorrect flag',
        hint: 'Review the lab environment and try to find the correct flag'
    };
}

/**
 * Validate multi-step lab challenge
 */
export function validateLabSteps(completedSteps, requiredSteps) {
    const missingSteps = requiredSteps.filter(
        step => !completedSteps.includes(step)
    );

    return {
        success: missingSteps.length === 0,
        completed: completedSteps.length,
        total: requiredSteps.length,
        missing: missingSteps,
        feedback: missingSteps.length === 0
            ? 'All steps completed!'
            : `Complete ${missingSteps.length} more step(s)`
    };
}

// ============ PRACTICAL CHALLENGE VALIDATORS ============

/**
 * Validate step-by-step practical challenge
 */
export function validatePracticalStep(stepId, userAnswer, stepConfig) {
    const { type, validation } = stepConfig;

    switch (type) {
        case 'text':
            return validateTextAnswer(userAnswer, validation);

        case 'regex':
            return validateRegexAnswer(userAnswer, validation);

        case 'multiple_choice':
            return validateMultipleChoice(userAnswer, validation);

        case 'command':
            return validateCommand(userAnswer, validation);

        case 'payload':
            return validatePayload(userAnswer, validation);

        default:
            return {
                success: false,
                feedback: 'Unknown step type'
            };
    }
}

function validateTextAnswer(answer, validation) {
    const { correctAnswers, caseSensitive = false } = validation;

    const userAnswer = caseSensitive ? answer.trim() : answer.trim().toLowerCase();
    const correct = correctAnswers.some(correct => {
        const expected = caseSensitive ? correct : correct.toLowerCase();
        return userAnswer === expected;
    });

    return {
        success: correct,
        feedback: correct
            ? validation.successMessage || 'Correct!'
            : validation.errorMessage || 'Incorrect answer'
    };
}

function validateRegexAnswer(answer, validation) {
    const { pattern, flags = '' } = validation;
    const regex = new RegExp(pattern, flags);
    const match = regex.test(answer);

    return {
        success: match,
        feedback: match
            ? validation.successMessage || 'Correct pattern!'
            : validation.errorMessage || 'Pattern does not match expected format'
    };
}

function validateMultipleChoice(answer, validation) {
    const { correctAnswer } = validation;
    const correct = parseInt(answer) === correctAnswer;

    return {
        success: correct,
        feedback: correct
            ? validation.successMessage || 'Correct!'
            : validation.errorMessage || 'Incorrect answer'
    };
}

function validateCommand(command, validation) {
    const { mustContain, mustNotContain, exactMatch } = validation;

    if (exactMatch && command.trim() !== exactMatch) {
        return {
            success: false,
            feedback: validation.errorMessage || 'Command does not match expected syntax'
        };
    }

    if (mustContain) {
        for (const required of mustContain) {
            if (!command.includes(required)) {
                return {
                    success: false,
                    feedback: `Command must contain: ${required}`
                };
            }
        }
    }

    if (mustNotContain) {
        for (const forbidden of mustNotContain) {
            if (command.includes(forbidden)) {
                return {
                    success: false,
                    feedback: `Command should not contain: ${forbidden}`
                };
            }
        }
    }

    return {
        success: true,
        feedback: validation.successMessage || 'Command validated successfully!'
    };
}

function validatePayload(payload, validation) {
    const { category, checks } = validation;
    const issues = [];

    for (const check of checks) {
        const { type, pattern, message } = check;
        const regex = new RegExp(pattern);

        if (type === 'required' && !regex.test(payload)) {
            issues.push(message || `Missing required pattern: ${pattern}`);
        } else if (type === 'forbidden' && regex.test(payload)) {
            issues.push(message || `Contains forbidden pattern: ${pattern}`);
        }
    }

    return {
        success: issues.length === 0,
        feedback: issues.length === 0
            ? validation.successMessage || 'Payload validated!'
            : issues.join('; '),
        issues
    };
}

// ============ LEARNING RESOURCES ============

/**
 * Get recommended resources based on challenge type and user performance
 */
export function getRecommendedResources(challengeType, userPerformance = 'failed') {
    const resources = {
        'SQL Injection': {
            internal: [
                { title: 'SQL Injection Fundamentals', path: '/learn/sql-injection-basics' },
                { title: 'Advanced SQL Injection', path: '/learn/sql-injection-advanced' }
            ],
            external: [
                { title: 'PortSwigger SQL Injection', url: 'https://portswigger.net/web-security/sql-injection' },
                { title: 'OWASP SQL Injection Guide', url: 'https://owasp.org/www-community/attacks/SQL_Injection' },
                { title: 'SQLMap Documentation', url: 'https://github.com/sqlmapproject/sqlmap/wiki' }
            ]
        },
        'XSS': {
            internal: [
                { title: 'XSS Attack Basics', path: '/learn/xss-fundamentals' },
                { title: 'XSS Filter Bypass Techniques', path: '/learn/xss-bypass' }
            ],
            external: [
                { title: 'PortSwigger XSS Guide', url: 'https://portswigger.net/web-security/cross-site-scripting' },
                { title: 'OWASP XSS Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
                { title: 'XSS Game by Google', url: 'https://xss-game.appspot.com/' }
            ]
        },
        'IDOR': {
            internal: [
                { title: 'Access Control Vulnerabilities', path: '/learn/access-control' },
                { title: 'IDOR Exploitation', path: '/learn/idor-exploitation' }
            ],
            external: [
                { title: 'PortSwigger Access Control', url: 'https://portswigger.net/web-security/access-control' },
                { title: 'OWASP Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/' },
                { title: 'HackerOne IDOR Reports', url: 'https://www.hackerone.com/vulnerability-management/what-idor-insecure-direct-object-reference' }
            ]
        },
        'CSRF': {
            internal: [
                { title: 'CSRF Fundamentals', path: '/learn/csrf-basics' },
                { title: 'CSRF Token Bypass', path: '/learn/csrf-bypass' }
            ],
            external: [
                { title: 'PortSwigger CSRF', url: 'https://portswigger.net/web-security/csrf' },
                { title: 'OWASP CSRF Guide', url: 'https://owasp.org/www-community/attacks/csrf' }
            ]
        },
        'Command Injection': {
            internal: [
                { title: 'Command Injection Basics', path: '/learn/command-injection' },
                { title: 'OS Command Injection Advanced', path: '/learn/command-injection-advanced' }
            ],
            external: [
                { title: 'PortSwigger OS Command Injection', url: 'https://portswigger.net/web-security/os-command-injection' },
                { title: 'OWASP Command Injection', url: 'https://owasp.org/www-community/attacks/Command_Injection' },
                { title: 'PayloadsAllTheThings', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Command%20Injection' }
            ]
        }
    };

    return resources[challengeType] || {
        internal: [],
        external: [
            { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
            { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security' }
        ]
    };
}

// ============ HINT SYSTEM ============

/**
 * Get progressive hints based on attempts
 */
export function getProgressiveHint(hintLevel, hints) {
    if (hintLevel >= hints.length) {
        return hints[hints.length - 1]; // Return last hint if exceeded
    }
    return hints[hintLevel];
}

/**
 * Calculate XP penalty for using hints
 */
export function calculateHintPenalty(hintsUsed, maxHints) {
    const penaltyPerHint = 0.15; // 15% penalty per hint
    const totalPenalty = Math.min(hintsUsed * penaltyPerHint, 0.5); // Max 50% penalty
    return 1 - totalPenalty;
}
