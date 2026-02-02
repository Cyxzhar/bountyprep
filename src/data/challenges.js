import { Lock, Syringe, Link, IdCard, RefreshCw, Upload } from 'lucide-react';

export const challenges = [
    {
        id: '1',
        title: 'E-commerce Login Bypass',
        description: 'Bypass authentication using SQL payloads',
        type: 'SQL Injection',
        difficulty: 'medium',
        estimatedTime: 8,
        isPremium: false,
        xpReward: 100,
        completed: false,
        questions: [
            {
                scenario: "You're testing an e-commerce platform's login system. The application uses the following PHP code to validate credentials:",
                codeBlock: `$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";`,
                codeLanguage: 'php',
                question: 'What type of vulnerability is this code susceptible to?',
                options: ['SQL Injection', 'XSS', 'CSRF', 'IDOR'],
                correctAnswer: 0,
                explanation: 'The code directly concatenates user input into the SQL query without sanitization, making it vulnerable to SQL Injection.',
                hint: 'Look at how the variables are inserted into the query string.'
            },
            {
                scenario: 'Now that you identified the vulnerability, you need to exploit it.',
                question: 'Which SQL injection payload would successfully bypass this login?',
                options: ["admin' OR '1'='1", "admin'; DROP TABLE users--", "<script>alert('XSS')</script>", "admin' AND '1'='1"],
                correctAnswer: 0,
                explanation: "The payload admin' OR '1'='1 works because it makes the WHERE clause always true.",
                hint: 'Think about making the condition always evaluate to true.'
            }
        ]
    },
    {
        id: '2',
        title: 'Stored XSS in Comment Section',
        description: 'Exploit a vulnerable comment system',
        type: 'XSS',
        difficulty: 'easy',
        estimatedTime: 6,
        isPremium: false,
        xpReward: 75,
        completed: true,
        questions: [
            {
                scenario: 'A blog allows users to post comments. The comments are displayed without any sanitization.',
                question: 'What type of XSS attack is possible when malicious script is stored on the server?',
                options: ['Stored XSS', 'Reflected XSS', 'DOM-based XSS', 'Self XSS'],
                correctAnswer: 0,
                explanation: 'Stored XSS occurs when the malicious script is permanently stored on the target server.',
                hint: 'The script persists and affects all users who view the affected page.'
            }
        ]
    },
    {
        id: '3',
        title: 'IDOR in User Profile API',
        description: 'Access unauthorized user data through IDOR',
        type: 'IDOR',
        difficulty: 'medium',
        estimatedTime: 7,
        isPremium: false,
        xpReward: 90,
        completed: false,
        questions: [
            {
                scenario: 'The API endpoint /api/users/{id} returns user profile data.',
                question: 'What is the main issue with using sequential IDs in API endpoints?',
                options: ['Predictable resource enumeration', 'Slow performance', 'Database corruption', 'XSS vulnerability'],
                correctAnswer: 0,
                explanation: 'Sequential IDs make it easy to enumerate and access other users resources.',
                hint: 'Think about what happens when you change the ID parameter.'
            }
        ]
    },
    {
        id: '4',
        title: 'CSRF Token Bypass',
        description: 'Bypass CSRF protection mechanisms',
        type: 'CSRF',
        difficulty: 'hard',
        estimatedTime: 10,
        isPremium: true,
        xpReward: 150,
        completed: false,
        questions: [
            {
                scenario: 'The application implements CSRF tokens but has a flaw in validation.',
                question: 'Which CSRF bypass technique exploits missing token validation?',
                options: ['Remove the token entirely', 'Use a different token', 'Encrypt the token', 'Hash the token'],
                correctAnswer: 0,
                explanation: 'Some applications only validate tokens if they exist, but dont check if theyre missing.',
                hint: 'What if the server doesnt require the token?'
            }
        ]
    },
    {
        id: '5',
        title: 'File Upload Bypass',
        description: 'Upload malicious files by bypassing restrictions',
        type: 'File Upload',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 175,
        completed: false,
        questions: [
            {
                scenario: 'The file upload feature only allows images but can be bypassed.',
                question: 'Which technique bypasses simple extension-based file validation?',
                options: ['Double extension (file.php.jpg)', 'Changing file size', 'Compressing the file', 'Renaming to .txt'],
                correctAnswer: 0,
                explanation: 'Double extensions can bypass simple validation that only checks the end of filename.',
                hint: 'Think about how the server parses file extensions.'
            }
        ]
    },
    {
        id: '6',
        title: 'JWT Token Manipulation',
        description: 'Exploit weak JWT implementation',
        type: 'Auth Bypass',
        difficulty: 'medium',
        estimatedTime: 9,
        isPremium: false,
        xpReward: 110,
        completed: false,
        questions: [
            {
                scenario: 'The application uses JWT tokens with algorithm confusion vulnerability.',
                question: 'What happens if you change JWT algorithm from RS256 to HS256?',
                options: ['Use public key as secret', 'Token becomes invalid', 'Encryption is disabled', 'Nothing changes'],
                correctAnswer: 0,
                explanation: 'Algorithm confusion allows using the public key as HMAC secret.',
                hint: 'Think about asymmetric vs symmetric signing.'
            }
        ]
    },
    {
        id: '7',
        title: 'Path Traversal Attack',
        description: 'Access sensitive files outside web root',
        type: 'Path Traversal',
        difficulty: 'easy',
        estimatedTime: 5,
        isPremium: false,
        xpReward: 60,
        completed: false,
        questions: [
            {
                scenario: 'The file download feature is vulnerable to directory traversal.',
                question: 'Which payload would access /etc/passwd from a vulnerable endpoint?',
                options: ['../../../etc/passwd', '/etc/passwd', 'etc/passwd', '~etc~passwd'],
                correctAnswer: 0,
                explanation: 'Using ../ navigates up directory levels to reach the target file.',
                hint: 'Each ../ moves up one directory level.'
            }
        ]
    },
    {
        id: '8',
        title: 'Command Injection in Ping Tool',
        description: 'Execute arbitrary commands through ping utility',
        type: 'Command Injection',
        difficulty: 'medium',
        estimatedTime: 8,
        isPremium: false,
        xpReward: 100,
        completed: false,
        questions: [
            {
                scenario: 'A network diagnostic tool allows users to ping hosts.',
                question: 'Which character would chain additional commands in a ping injection?',
                options: ['; (semicolon)', '@ (at sign)', '# (hash)', '% (percent)'],
                correctAnswer: 0,
                explanation: 'Semicolon terminates one command and allows another to execute.',
                hint: 'Think about how shells chain multiple commands.'
            }
        ]
    }
];

export const skillModules = [
    { id: 'auth', name: 'Authentication Bypass', iconName: 'Lock', progress: 60, completed: 3, total: 5 },
    { id: 'sqli', name: 'SQL Injection', iconName: 'Syringe', progress: 40, completed: 2, total: 5 },
    { id: 'xss', name: 'XSS Attacks', iconName: 'Link', progress: 20, completed: 1, total: 5 },
    { id: 'idor', name: 'IDOR', iconName: 'IdCard', progress: 0, completed: 0, total: 4 },
    { id: 'csrf', name: 'CSRF', iconName: 'RefreshCw', progress: 0, completed: 0, total: 4 },
    { id: 'upload', name: 'File Upload', iconName: 'Upload', progress: 0, completed: 0, total: 3 }
];

export const skillIcons = {
    Lock,
    Syringe,
    Link,
    IdCard,
    RefreshCw,
    Upload
};

export const achievements = [
    { id: 'streak7', name: '7 Day Streak', icon: '🔥', unlocked: true, rarity: 'common' },
    { id: 'firstblood', name: 'First Blood', icon: '🩸', unlocked: true, rarity: 'common' },
    { id: 'interview', name: 'Interview Master', icon: '🎤', unlocked: false, rarity: 'rare' },
    { id: 'sqli_master', name: 'SQL Ninja', icon: '💉', unlocked: false, rarity: 'epic' },
    { id: 'perfect', name: 'Perfectionist', icon: '💯', unlocked: false, rarity: 'legendary' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '⚔️', unlocked: true, rarity: 'common' }
];
