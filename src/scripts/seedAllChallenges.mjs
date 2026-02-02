/**
 * Seed All 33 Challenges to Firestore
 * 
 * Usage: node src/scripts/seedAllChallenges.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');

// Check for service account key
const serviceAccountPath = join(projectRoot, 'serviceAccountKey.json');
if (!existsSync(serviceAccountPath)) {
    console.error('❌ serviceAccountKey.json not found in project root');
    console.error('Download from: Firebase Console > Project Settings > Service Accounts');
    process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
console.log(`📋 Using project: ${serviceAccount.project_id}`);

const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
});

const db = getFirestore(app);

// All 33 challenges
const challenges = [
    {
        id: '1',
        title: 'E-commerce Login Bypass',
        description: 'Bypass authentication using SQL payloads',
        type: 'SQL Injection',
        difficulty: 'medium',
        xpReward: 100,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: "You're testing an e-commerce platform's login system.",
                codeBlock: `$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";`,
                codeLanguage: 'php',
                question: 'What type of vulnerability is this code susceptible to?',
                options: ['SQL Injection', 'XSS', 'CSRF', 'IDOR'],
                correctAnswer: 0,
                explanation: 'The code directly concatenates user input into the SQL query.',
                hint: 'Look at the variables in the query string.'
            },
            {
                scenario: 'Exploit the identified vulnerability.',
                question: 'Which payload would bypass this login?',
                options: ["admin' OR '1'='1", "admin'; DROP TABLE--", "<script>alert(1)</script>", "admin' AND '1'='1"],
                correctAnswer: 0,
                explanation: "The payload makes the WHERE clause always true.",
                hint: 'Make the condition always evaluate to true.'
            }
        ]
    },
    {
        id: '2',
        title: 'Stored XSS in Comment Section',
        description: 'Exploit a vulnerable comment system',
        type: 'XSS',
        difficulty: 'easy',
        xpReward: 75,
        isPremium: false,
        estimatedTimeMinutes: 6,
        questions: [
            {
                scenario: 'Comments are displayed without sanitization.',
                question: 'What type of XSS stores malicious script on the server?',
                options: ['Stored XSS', 'Reflected XSS', 'DOM-based XSS', 'Self XSS'],
                correctAnswer: 0,
                explanation: 'Stored XSS is permanently stored on the server.',
                hint: 'The script persists and affects all viewers.'
            }
        ]
    },
    {
        id: '3',
        title: 'IDOR in User Profile API',
        description: 'Access unauthorized user data through IDOR',
        type: 'IDOR',
        difficulty: 'medium',
        xpReward: 90,
        isPremium: false,
        estimatedTimeMinutes: 7,
        questions: [
            {
                scenario: 'API endpoint /api/users/{id} returns user data.',
                question: 'What is wrong with sequential IDs in APIs?',
                options: ['Predictable enumeration', 'Slow performance', 'Database issues', 'XSS risk'],
                correctAnswer: 0,
                explanation: 'Sequential IDs allow easy enumeration.',
                hint: 'What happens when you change the ID?'
            }
        ]
    },
    {
        id: '4',
        title: 'CSRF Token Bypass',
        description: 'Bypass CSRF protection mechanisms',
        type: 'CSRF',
        difficulty: 'hard',
        xpReward: 150,
        isPremium: true,
        estimatedTimeMinutes: 10,
        questions: [
            {
                scenario: 'CSRF tokens are implemented but flawed.',
                question: 'Which bypass exploits missing validation?',
                options: ['Remove token entirely', 'Use different token', 'Encrypt token', 'Hash token'],
                correctAnswer: 0,
                explanation: 'Some apps only validate if token exists.',
                hint: 'What if token is not required?'
            }
        ]
    },
    {
        id: '5',
        title: 'File Upload Bypass',
        description: 'Upload malicious files by bypassing restrictions',
        type: 'File Upload',
        difficulty: 'hard',
        xpReward: 175,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: 'File upload only allows images.',
                question: 'Which bypasses extension validation?',
                options: ['Double extension (file.php.jpg)', 'Change file size', 'Compress file', 'Rename to .txt'],
                correctAnswer: 0,
                explanation: 'Double extensions bypass simple checks.',
                hint: 'How does the server parse extensions?'
            }
        ]
    },
    {
        id: '6',
        title: 'JWT Token Manipulation',
        description: 'Exploit weak JWT implementation',
        type: 'Auth Bypass',
        difficulty: 'medium',
        xpReward: 110,
        isPremium: false,
        estimatedTimeMinutes: 9,
        questions: [
            {
                scenario: 'JWT with algorithm confusion vulnerability.',
                question: 'What if you change RS256 to HS256?',
                options: ['Use public key as secret', 'Token invalid', 'No encryption', 'Nothing'],
                correctAnswer: 0,
                explanation: 'Algorithm confusion uses public key as HMAC secret.',
                hint: 'Asymmetric vs symmetric signing.'
            }
        ]
    },
    {
        id: '7',
        title: 'Path Traversal Attack',
        description: 'Access sensitive files outside web root',
        type: 'Path Traversal',
        difficulty: 'easy',
        xpReward: 60,
        isPremium: false,
        estimatedTimeMinutes: 5,
        questions: [
            {
                scenario: 'File download is vulnerable to traversal.',
                question: 'Which payload accesses /etc/passwd?',
                options: ['../../../etc/passwd', '/etc/passwd', 'etc/passwd', '~etc~passwd'],
                correctAnswer: 0,
                explanation: '../ navigates up directory levels.',
                hint: 'Each ../ moves up one level.'
            }
        ]
    },
    {
        id: '8',
        title: 'Command Injection in Ping Tool',
        description: 'Execute commands through ping utility',
        type: 'Command Injection',
        difficulty: 'medium',
        xpReward: 100,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: 'Network tool allows users to ping hosts.',
                question: 'Which character chains commands?',
                options: ['; (semicolon)', '@ (at)', '# (hash)', '% (percent)'],
                correctAnswer: 0,
                explanation: 'Semicolon terminates and chains commands.',
                hint: 'How do shells chain commands?'
            }
        ]
    },
    // NEW CHALLENGES 9-33
    {
        id: '9',
        title: 'Union-Based SQL Injection',
        description: 'Extract database data using UNION attacks',
        type: 'SQL Injection',
        difficulty: 'medium',
        xpReward: 120,
        isPremium: false,
        estimatedTimeMinutes: 10,
        questions: [
            {
                scenario: "A product search feature is vulnerable to SQL injection.",
                question: 'What must match between original and UNION query?',
                options: ['Number of columns', 'Table names', 'Database type', 'Column names'],
                correctAnswer: 0,
                explanation: 'UNION requires same number of columns with compatible types.',
                hint: 'UNION combines results from two SELECT statements.'
            },
            {
                scenario: "You confirmed 3 columns. Find which display data.",
                codeBlock: `' UNION SELECT 'a','b','c'--`,
                codeLanguage: 'sql',
                question: 'Why use string literals like "a", "b", "c"?',
                options: ['To identify which columns appear in output', 'To cause an error', 'To bypass WAF', 'To crash database'],
                correctAnswer: 0,
                explanation: 'Identifiable values help find displayed columns.',
                hint: 'Which positions appear in the response?'
            },
            {
                scenario: "Column 2 displays. Extract database version.",
                question: 'Which function returns MySQL version?',
                options: ['@@version', 'version()', 'db_version()', 'mysql_version()'],
                correctAnswer: 0,
                explanation: '@@version is a MySQL system variable.',
                hint: 'MySQL uses @@ prefix for system variables.'
            }
        ]
    },
    {
        id: '10',
        title: 'Blind SQL Injection',
        description: 'Extract data using Boolean-based techniques',
        type: 'SQL Injection',
        difficulty: 'hard',
        xpReward: 180,
        isPremium: false,
        estimatedTimeMinutes: 15,
        questions: [
            {
                scenario: "Application shows no SQL errors or query results.",
                question: 'What SQLi type when theres no visible output?',
                options: ['Blind SQL injection', 'Union-based', 'Error-based', 'Stacked queries'],
                correctAnswer: 0,
                explanation: 'Blind SQLi when app doesnt return query data.',
                hint: 'Observe TRUE/FALSE conditions through behavior.'
            },
            {
                scenario: "Extract first character of admin password.",
                codeBlock: `' AND SUBSTRING(password,1,1)='a'--`,
                codeLanguage: 'sql',
                question: 'What does this payload test?',
                options: ['If first character is "a"', 'If password contains "a"', 'If length is 1', 'If username is "a"'],
                correctAnswer: 0,
                explanation: 'SUBSTRING extracts characters for comparison.',
                hint: 'SUBSTRING(string, start, length) extracts part.'
            }
        ]
    },
    {
        id: '11',
        title: 'Second-Order SQL Injection',
        description: 'Exploit SQL injection through stored data',
        type: 'SQL Injection',
        difficulty: 'hard',
        xpReward: 200,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "Registration stores username. Admin panel displays user data.",
                question: 'What makes second-order SQLi different?',
                options: ['Payload stored and triggered later', 'Requires two queries', 'Only works second attempt', 'Needs two databases'],
                correctAnswer: 0,
                explanation: 'Second-order occurs when stored input is used in vulnerable query.',
                hint: 'Injection doesnt trigger immediately.'
            },
            {
                scenario: "Register with username: admin'--",
                question: 'When will the SQL injection trigger?',
                options: ['When stored username used in another query', 'During registration', 'During login', 'Never'],
                correctAnswer: 0,
                explanation: 'Payload executes when app uses malicious stored value.',
                hint: 'When is stored data used in SQL queries?'
            }
        ]
    },
    {
        id: '12',
        title: 'Reflected XSS in Search',
        description: 'Exploit XSS in a search function',
        type: 'XSS',
        difficulty: 'easy',
        xpReward: 65,
        isPremium: false,
        estimatedTimeMinutes: 5,
        questions: [
            {
                scenario: "Search reflects query: 'You searched for: [query]'",
                question: 'What type of XSS is this?',
                options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Mutation XSS'],
                correctAnswer: 0,
                explanation: 'Reflected XSS is immediately returned and displayed.',
                hint: 'Payload is reflected in same request.'
            },
            {
                scenario: "Basic script tags are filtered.",
                question: 'Which payload might bypass <script> filter?',
                options: ['<img src=x onerror=alert(1)>', '<script>alert(1)</script>', '<javascript>alert(1)', '<style>alert(1)</style>'],
                correctAnswer: 0,
                explanation: 'Event handlers execute JS without script tags.',
                hint: 'Many HTML elements support event handlers.'
            }
        ]
    },
    {
        id: '13',
        title: 'DOM-Based XSS',
        description: 'Exploit client-side JavaScript vulnerabilities',
        type: 'XSS',
        difficulty: 'medium',
        xpReward: 100,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: "Page uses: document.write(location.hash.substring(1))",
                question: 'What makes DOM-based XSS different?',
                options: ['Processed entirely on client-side', 'Requires DOM access', 'Browser-specific', 'Server must be vulnerable'],
                correctAnswer: 0,
                explanation: 'DOM-based occurs when JS processes untrusted data.',
                hint: 'Vulnerability is in client-side code.'
            },
            {
                scenario: "Exploit: http://site.com/page#<script>alert(1)</script>",
                question: 'Why use URL fragment (#)?',
                options: ['Fragment isnt sent to server', 'Its faster', 'Bypasses HTTPS', 'Works all browsers'],
                correctAnswer: 0,
                explanation: 'Fragment only processed by browser.',
                hint: 'Can bypass server-side filters completely.'
            }
        ]
    },
    {
        id: '14',
        title: 'XSS Filter Bypass',
        description: 'Bypass common XSS protections',
        type: 'XSS',
        difficulty: 'hard',
        xpReward: 160,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "WAF blocks 'script', 'alert', 'onerror' keywords.",
                question: 'Which technique bypasses keyword filters?',
                options: ['Case variation (ScRiPt)', 'More script tags', 'Longer payload', 'Different browser'],
                correctAnswer: 0,
                explanation: 'Case insensitivity can bypass case-sensitive filters.',
                hint: 'HTML tag parsing is case-insensitive.'
            },
            {
                scenario: "Filter removes 'script' once.",
                codeBlock: `<scrscriptipt>alert(1)</scrscriptipt>`,
                codeLanguage: 'html',
                question: 'What technique is this payload using?',
                options: ['Nested tag injection', 'Unicode encoding', 'HTML entities', 'Base64'],
                correctAnswer: 0,
                explanation: 'After removing "script", remaining forms valid tag.',
                hint: 'What remains after filter removes "script"?'
            }
        ]
    },
    {
        id: '15',
        title: 'Basic CSRF Attack',
        description: 'Understand and exploit CSRF vulnerabilities',
        type: 'CSRF',
        difficulty: 'easy',
        xpReward: 70,
        isPremium: false,
        estimatedTimeMinutes: 6,
        questions: [
            {
                scenario: "Bank allows GET transfers: /transfer?to=user&amount=1000",
                question: 'Why is GET for sensitive actions vulnerable?',
                options: ['GET can be triggered via img tags', 'GET is slower', 'GET cant use tokens', 'GET no HTTPS'],
                correctAnswer: 0,
                explanation: 'An img src triggers GET without user action.',
                hint: 'How browsers automatically load images.'
            },
            {
                scenario: "Create CSRF to transfer $1000 to attacker.",
                question: 'Which HTML silently triggers transfer?',
                options: ['<img src="/transfer?to=attacker&amount=1000">', '<form action="/transfer">', '<a href="/transfer">', '<script src="/transfer">'],
                correctAnswer: 0,
                explanation: 'Hidden imgs auto-make GET requests.',
                hint: 'Attack works without user click.'
            }
        ]
    },
    {
        id: '16',
        title: 'CSRF Against JSON APIs',
        description: 'Exploit CSRF in JSON-based applications',
        type: 'CSRF',
        difficulty: 'hard',
        xpReward: 150,
        isPremium: true,
        estimatedTimeMinutes: 10,
        questions: [
            {
                scenario: "API only accepts Content-Type: application/json.",
                question: 'Why might this seem to prevent CSRF?',
                options: ['Forms cant send JSON Content-Type', 'JSON is encrypted', 'POST prevents CSRF', 'APIs cant be targeted'],
                correctAnswer: 0,
                explanation: 'Standard forms only send specific Content-Types.',
                hint: 'Consider HTML form limitations.'
            },
            {
                scenario: "Need to bypass JSON Content-Type requirement.",
                question: 'Which technique might bypass Content-Type?',
                options: ['Flash CSRF or sendBeacon', 'Using GET', 'Adding headers', 'Base64 encoding'],
                correctAnswer: 0,
                explanation: 'Some browser features allow custom headers.',
                hint: 'Flash and browser APIs allow custom headers.'
            }
        ]
    },
    {
        id: '17',
        title: 'IDOR in File Download',
        description: 'Access other users files through IDOR',
        type: 'IDOR',
        difficulty: 'easy',
        xpReward: 60,
        isPremium: false,
        estimatedTimeMinutes: 5,
        questions: [
            {
                scenario: "Download: /download?file_id=12345 returns your invoice.",
                question: 'What to test first for IDOR?',
                options: ['Change file_id to other values', 'Try SQL injection', 'Upload new file', 'Delete file'],
                correctAnswer: 0,
                explanation: 'Change identifier to access other resources.',
                hint: 'Can you access files not belonging to you?'
            },
            {
                scenario: "file_id 12344 returns another users invoice!",
                question: 'What access control check is missing?',
                options: ['Verifying file ownership', 'Checking file type', 'Validating size', 'Checking date'],
                correctAnswer: 0,
                explanation: 'Server should verify requester owns the file.',
                hint: 'Authorization before returning resources.'
            }
        ]
    },
    {
        id: '18',
        title: 'IDOR with UUID',
        description: 'Find IDOR with non-sequential identifiers',
        type: 'IDOR',
        difficulty: 'medium',
        xpReward: 110,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: "API uses UUIDs: /api/docs/a1b2c3d4-e5f6-7890-abcd",
                question: 'Why might UUIDs seem to prevent IDOR?',
                options: ['UUIDs are hard to guess', 'UUIDs are encrypted', 'UUIDs change each request', 'UUIDs require auth'],
                correctAnswer: 0,
                explanation: 'UUIDs are unpredictable but dont prevent auth bypass.',
                hint: 'Unguessability != authorization.'
            },
            {
                scenario: "User A shares doc link. User B copies UUID.",
                question: 'How can User B exploit IDOR with UUID?',
                options: ['Use leaked UUID to access resource', 'Brute force UUIDs', 'Convert to integer', 'Decode UUID'],
                correctAnswer: 0,
                explanation: 'If UUID leaked, IDOR still possible.',
                hint: 'IDOR exists without additional auth check.'
            }
        ]
    },
    {
        id: '19',
        title: 'Horizontal Privilege Escalation',
        description: 'Access same-level user resources',
        type: 'IDOR',
        difficulty: 'medium',
        xpReward: 120,
        isPremium: false,
        estimatedTimeMinutes: 9,
        questions: [
            {
                scenario: "Alice (ID:100) and Bob (ID:101). Alice views /user/100/orders.",
                question: 'What is horizontal privilege escalation?',
                options: ['Accessing another users resources at same level', 'Becoming admin', 'Escalating to root', 'Gaining write access'],
                correctAnswer: 0,
                explanation: 'Horizontal = accessing peers, not higher privileges.',
                hint: 'Think sideways, not upward.'
            },
            {
                scenario: "Alice changes to /user/101/orders, sees Bobs orders.",
                question: 'What type of vulnerability is this?',
                options: ['IDOR leading to horizontal escalation', 'Vertical escalation', 'SQL injection', 'Auth bypass'],
                correctAnswer: 0,
                explanation: 'IDOR is vulnerability, horizontal escalation is impact.',
                hint: 'Direct object reference lacks authorization.'
            }
        ]
    },
    {
        id: '20',
        title: 'Password Reset Token Bypass',
        description: 'Exploit weak password reset mechanisms',
        type: 'Auth Bypass',
        difficulty: 'medium',
        xpReward: 130,
        isPremium: false,
        estimatedTimeMinutes: 10,
        questions: [
            {
                scenario: "Reset: /reset?token=abc123&user=victim@email.com",
                question: 'Whats vulnerable about including userid in URL?',
                options: ['Attacker can change user with valid token', 'Token expires fast', 'Email visible', 'No HTTPS'],
                correctAnswer: 0,
                explanation: 'If token isnt bound to user, you can change it.',
                hint: 'What if server only validates token exists?'
            },
            {
                scenario: "You modify user=admin@email.com with your token.",
                question: 'What should proper token include?',
                options: ['Token bound to specific user', 'Longer token', 'Encrypted token', 'Token in cookie'],
                correctAnswer: 0,
                explanation: 'Tokens should be cryptographically bound.',
                hint: 'One token should work for one user only.'
            }
        ]
    },
    {
        id: '21',
        title: 'OAuth Misconfiguration',
        description: 'Exploit OAuth implementation flaws',
        type: 'Auth Bypass',
        difficulty: 'hard',
        xpReward: 170,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "OAuth: /callback?code=xxx&redirect_uri=https://app.com/callback",
                question: 'Vulnerability if redirect_uri not validated?',
                options: ['Open redirect to steal auth code', 'XSS attack', 'SQL injection', 'CSRF'],
                correctAnswer: 0,
                explanation: 'Attacker redirects OAuth code to their server.',
                hint: 'What if you change where code is sent?'
            },
            {
                scenario: "Server accepts redirect_uri=https://evil.com/callback",
                question: 'What can attacker do with stolen auth code?',
                options: ['Exchange for access token', 'Direct account access', 'Modify code', 'Delete code'],
                correctAnswer: 0,
                explanation: 'Auth code can be traded for access token.',
                hint: 'OAuth codes are bearer credentials.'
            }
        ]
    },
    {
        id: '22',
        title: 'Session Fixation Attack',
        description: 'Force user to use attacker-controlled session',
        type: 'Auth Bypass',
        difficulty: 'medium',
        xpReward: 100,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: "App accepts session IDs from URL: /login?SESSIONID=abc123",
                question: 'What is session fixation?',
                options: ['Attacker sets victims session before login', 'Breaking session encryption', 'Stealing cookies', 'Brute forcing sessions'],
                correctAnswer: 0,
                explanation: 'Session fixation forces victim to use known session.',
                hint: 'Attacker picks session, waits for authentication.'
            },
            {
                scenario: "Attacker sends: http://bank.com/login?SESSIONID=attackerID",
                question: 'What happens after victim logs in?',
                options: ['Attacker uses same session ID', 'Session invalidated', 'Victim warned', 'Nothing'],
                correctAnswer: 0,
                explanation: 'If session not regenerated, attacker has access.',
                hint: 'Session ID was set before authentication.'
            }
        ]
    },
    {
        id: '23',
        title: 'Image Upload Shell',
        description: 'Upload web shell through image upload',
        type: 'File Upload',
        difficulty: 'medium',
        xpReward: 130,
        isPremium: false,
        estimatedTimeMinutes: 10,
        questions: [
            {
                scenario: "Profile picture allows .jpg, .png only.",
                question: 'What should be checked beyond extension?',
                options: ['File content/magic bytes', 'Upload time', 'Download count', 'Comment'],
                correctAnswer: 0,
                explanation: 'Magic bytes verify actual file type.',
                hint: 'What if content doesnt match extension?'
            },
            {
                scenario: "JPEG header with PHP code appended.",
                codeBlock: `GIF89a<?php system($_GET['cmd']); ?>`,
                codeLanguage: 'php',
                question: 'Why might this polyglot bypass validation?',
                options: ['Valid header passes magic byte check', 'PHP compressed', 'GIF89a encrypted', 'System call hidden'],
                correctAnswer: 0,
                explanation: 'File appears as image but contains code.',
                hint: 'Validators often only check file beginning.'
            }
        ]
    },
    {
        id: '24',
        title: 'Content-Type Manipulation',
        description: 'Bypass using Content-Type header',
        type: 'File Upload',
        difficulty: 'easy',
        xpReward: 75,
        isPremium: false,
        estimatedTimeMinutes: 6,
        questions: [
            {
                scenario: "Upload checks Content-Type for image/jpeg.",
                question: 'Can you control Content-Type header?',
                options: ['Yes, using proxy tools like Burp', 'No, browser sets it', 'Only on mobile', 'Only with HTTPS'],
                correctAnswer: 0,
                explanation: 'HTTP headers can be modified with proxies.',
                hint: 'Interception proxies modify any request part.'
            },
            {
                scenario: "Change Content-Type to image/jpeg while uploading shell.php",
                question: 'What makes this bypass work?',
                options: ['Server trusts client Content-Type', 'JPEG contains PHP', 'Server misconfigured', 'PHP disabled'],
                correctAnswer: 0,
                explanation: 'Trusting client headers is insecure.',
                hint: 'Never trust client input for security.'
            }
        ]
    },
    {
        id: '25',
        title: 'Path Truncation Upload',
        description: 'Bypass extension filters with null bytes',
        type: 'File Upload',
        difficulty: 'hard',
        xpReward: 180,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "Upload adds .jpg: filename becomes filename.jpg",
                question: 'What does null byte (%00) do in older systems?',
                options: ['Terminates string processing', 'Adds space', 'Empty file', 'Causes error'],
                correctAnswer: 0,
                explanation: 'Null bytes terminate strings in some languages.',
                hint: 'C-style strings end at null bytes.'
            },
            {
                scenario: "Upload: shell.php%00.jpg",
                question: 'On vulnerable systems, what filename saved?',
                options: ['shell.php', 'shell.php%00.jpg', 'shell.jpg', '.jpg'],
                correctAnswer: 0,
                explanation: 'Null byte truncates before .jpg added.',
                hint: 'Everything after %00 ignored.'
            }
        ]
    },
    {
        id: '26',
        title: 'Blind Command Injection',
        description: 'Detect command injection without output',
        type: 'Command Injection',
        difficulty: 'hard',
        xpReward: 160,
        isPremium: false,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "PDF generator takes input but shows no output.",
                question: 'How detect blind command injection?',
                options: ['Time-based delays (sleep)', 'Check file changes', 'Look for errors', 'View logs'],
                correctAnswer: 0,
                explanation: 'Sleep causes measurable delays if injection works.',
                hint: 'If sleep 10 delays response by 10s...'
            },
            {
                scenario: "Confirmed with: ; sleep 5 and response delayed.",
                question: 'How exfiltrate data without seeing output?',
                options: ['Out-of-band via DNS/HTTP callback', 'Read response', 'Check errors', 'View source'],
                correctAnswer: 0,
                explanation: 'Out-of-band sends data to attacker server.',
                hint: 'Make server connect to your infrastructure.'
            }
        ]
    },
    {
        id: '27',
        title: 'Command Injection via Filename',
        description: 'Inject commands through file processing',
        type: 'Command Injection',
        difficulty: 'medium',
        xpReward: 120,
        isPremium: false,
        estimatedTimeMinutes: 9,
        questions: [
            {
                scenario: "File conversion: ffmpeg -i [filename] output.mp4",
                question: 'Which filename would inject commands?',
                options: ['video.mp4;whoami', 'video.mp4', '../video.mp4', 'video.mp4.exe'],
                correctAnswer: 0,
                explanation: 'Semicolon terminates and executes next command.',
                hint: 'Shell interprets ; as command separator.'
            },
            {
                scenario: "Some characters filtered. Try alternative.",
                codeBlock: `video.mp4$(whoami)`,
                codeLanguage: 'bash',
                question: 'What does $() do in bash?',
                options: ['Command substitution - executes and returns output', 'Variable declaration', 'String formatting', 'Comment'],
                correctAnswer: 0,
                explanation: '$() executes contents and substitutes output.',
                hint: 'Called command substitution.'
            }
        ]
    },
    {
        id: '28',
        title: 'Path Traversal Filter Bypass',
        description: 'Bypass path traversal protections',
        type: 'Path Traversal',
        difficulty: 'medium',
        xpReward: 110,
        isPremium: false,
        estimatedTimeMinutes: 8,
        questions: [
            {
                scenario: "App filters out '../' from paths.",
                question: 'Which payload bypasses single-pass filter?',
                options: ['....//....//etc/passwd', '..../etc/passwd', '%%2e%%2e/etc/passwd', '..//..//etc/passwd'],
                correctAnswer: 0,
                explanation: "When ../ removed from ....// leaves ../",
                hint: 'Similar to nested XSS tag bypass.'
            },
            {
                scenario: "URL encoding also blocked. Try double encoding.",
                codeBlock: `%252e%252e%252f = ../ (after double decode)`,
                codeLanguage: 'text',
                question: 'Why does double encoding work?',
                options: ['Server decodes twice but filter checks once', 'Compresses path', 'Encrypts path', 'Adds auth'],
                correctAnswer: 0,
                explanation: 'Filter sees encoded, server decodes again.',
                hint: 'Filter runs before final decode.'
            }
        ]
    },
    {
        id: '29',
        title: 'Windows Path Traversal',
        description: 'Exploit path traversal on Windows',
        type: 'Path Traversal',
        difficulty: 'easy',
        xpReward: 65,
        isPremium: false,
        estimatedTimeMinutes: 5,
        questions: [
            {
                scenario: "Windows server: ..\\\\..\\\\windows\\\\system.ini",
                question: 'What is Windows directory separator?',
                options: ['Backslash (\\\\)', 'Forward slash (/)', 'Colon (:)', 'Pipe (|)'],
                correctAnswer: 0,
                explanation: 'Windows traditionally uses backslash.',
                hint: 'Think about Windows file paths.'
            },
            {
                scenario: "Linux traversal doesnt work. Try Windows.",
                question: 'Which file confirms Windows traversal?',
                options: ['C:\\\\Windows\\\\win.ini', '/etc/passwd', '~/.bashrc', '/var/log/auth.log'],
                correctAnswer: 0,
                explanation: 'win.ini exists on all Windows systems.',
                hint: 'Windows has different system files.'
            }
        ]
    },
    {
        id: '30',
        title: 'Server-Side Template Injection',
        description: 'Exploit template engines for code execution',
        type: 'SSTI',
        difficulty: 'hard',
        xpReward: 200,
        isPremium: true,
        estimatedTimeMinutes: 15,
        questions: [
            {
                scenario: "User input in Jinja2: Hello {{name}}!",
                question: 'What payload tests for SSTI?',
                options: ['{{7*7}} to see if 49 appears', '<script>alert(1)</script>', 'OR 1=1--', '../etc/passwd'],
                correctAnswer: 0,
                explanation: 'Math expressions processed by vulnerable templates.',
                hint: 'Template engines evaluate expressions.'
            },
            {
                scenario: "{{7*7}} returns 49! Its vulnerable.",
                question: 'Why is SSTI dangerous?',
                options: ['Can lead to remote code execution', 'Only XSS', 'Only display issues', 'Only DoS'],
                correctAnswer: 0,
                explanation: 'Templates often have access to system functions.',
                hint: 'Templates run on server with server permissions.'
            }
        ]
    },
    {
        id: '31',
        title: 'XML External Entity (XXE)',
        description: 'Exploit XML parsers to read files',
        type: 'XXE',
        difficulty: 'hard',
        xpReward: 180,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "Application parses XML user data.",
                codeBlock: `<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<user>&xxe;</user>`,
                codeLanguage: 'xml',
                question: 'What does this XXE payload attempt?',
                options: ['Read /etc/passwd file', 'Create new entity', 'Validate XML', 'Encrypt data'],
                correctAnswer: 0,
                explanation: 'External entities reference local files or URLs.',
                hint: 'SYSTEM references external resources.'
            },
            {
                scenario: "XXE confirmed. Entity value appears in response.",
                question: 'What else can XXE do besides file reading?',
                options: ['SSRF - server-side request forgery', 'Only file reading', 'Only DOS', 'Only validation'],
                correctAnswer: 0,
                explanation: 'XXE can request internal services.',
                hint: 'External entities can reference URLs.'
            }
        ]
    },
    {
        id: '32',
        title: 'Insecure Deserialization',
        description: 'Exploit unsafe object deserialization',
        type: 'Deserialization',
        difficulty: 'hard',
        xpReward: 220,
        isPremium: true,
        estimatedTimeMinutes: 15,
        questions: [
            {
                scenario: "App deserializes user data without validation.",
                question: 'Why is insecure deserialization dangerous?',
                options: ['Can lead to remote code execution', 'Only data corruption', 'Only performance', 'Only SQL errors'],
                correctAnswer: 0,
                explanation: 'Malicious objects execute code when deserialized.',
                hint: 'Objects can have auto-run methods.'
            },
            {
                scenario: "Cookie looks like serialized data.",
                codeBlock: `O:4:"User":2:{s:4:"name";s:5:"admin";s:4:"role";s:4:"user";}`,
                codeLanguage: 'text',
                question: 'What serialization format is this?',
                options: ['PHP serialization', 'JSON', 'Python pickle', 'Java'],
                correctAnswer: 0,
                explanation: 'O: indicates PHP object serialization.',
                hint: 'Each language has unique format.'
            }
        ]
    },
    {
        id: '33',
        title: 'Race Condition Exploitation',
        description: 'Exploit timing vulnerabilities',
        type: 'Race Condition',
        difficulty: 'hard',
        xpReward: 190,
        isPremium: true,
        estimatedTimeMinutes: 12,
        questions: [
            {
                scenario: "Coupon DISCOUNT50 is single-use, applied at checkout.",
                question: 'What if two requests apply coupon simultaneously?',
                options: ['Both succeed before marked used', 'Both fail', 'Server crashes', 'Coupon doubles'],
                correctAnswer: 0,
                explanation: 'Without locking, both pass valid check.',
                hint: 'Check and use are separate operations.'
            },
            {
                scenario: "Send 50 simultaneous requests applying coupon.",
                question: 'What tool feature is useful for race conditions?',
                options: ['Parallel request sending', 'Fuzzing wordlists', 'Response comparison', 'Session handling'],
                correctAnswer: 0,
                explanation: 'Many concurrent requests maximize race condition.',
                hint: 'Timing is everything in race conditions.'
            }
        ]
    }
];

async function seed() {
    console.log('🌱 Seeding all 33 challenges to Firestore...\n');

    // Test connection
    try {
        const testRef = db.collection('_test').doc('connection');
        await testRef.set({ test: true, timestamp: new Date() });
        await testRef.delete();
        console.log('✅ Firestore connection successful!\n');
    } catch (error) {
        console.error('❌ Firestore connection failed:', error.message);
        process.exit(1);
    }

    let success = 0;
    let failed = 0;

    for (const challenge of challenges) {
        try {
            await db.collection('challenges').doc(challenge.id).set({
                ...challenge,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ [${challenge.id}] ${challenge.title}`);
            success++;
        } catch (error) {
            console.error(`❌ [${challenge.id}] ${error.message}`);
            failed++;
        }
    }

    console.log(`\n✨ Seeding complete! ${success} succeeded, ${failed} failed.`);
}

seed().catch(console.error);
