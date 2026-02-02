import { Lock, Syringe, Link, IdCard, RefreshCw, Upload, Terminal, Shield, Code, Globe } from 'lucide-react';

export const challenges = [
    // ===== EXISTING CHALLENGES (1-8) =====
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
        completed: false,
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
    },

    // ===== NEW CHALLENGES (9-33) =====

    // SQL Injection Challenges
    {
        id: '9',
        title: 'Union-Based SQL Injection',
        description: 'Extract database data using UNION attacks',
        type: 'SQL Injection',
        difficulty: 'medium',
        estimatedTime: 10,
        isPremium: false,
        xpReward: 120,
        completed: false,
        questions: [
            {
                scenario: "A product search feature is vulnerable to SQL injection. The query returns product name and price.",
                question: 'What must match between the original query and UNION query?',
                options: ['Number of columns', 'Table names', 'Database type', 'Column names'],
                correctAnswer: 0,
                explanation: 'UNION requires both queries to have the same number of columns with compatible data types.',
                hint: 'UNION combines results from two SELECT statements.'
            },
            {
                scenario: "You've confirmed 3 columns. Now you need to find which columns display data.",
                codeBlock: `' UNION SELECT 'a','b','c'--`,
                codeLanguage: 'sql',
                question: 'Why do we use string literals like "a", "b", "c" in the UNION payload?',
                options: ['To identify which columns are reflected in output', 'To cause an error', 'To bypass WAF', 'To crash the database'],
                correctAnswer: 0,
                explanation: 'Using identifiable values helps determine which column positions display in the response.',
                hint: 'You need to see where your data appears in the page.'
            },
            {
                scenario: "Column 2 displays on the page. Extract the database version.",
                question: 'Which function returns MySQL version?',
                options: ['@@version', 'version()', 'db_version()', 'mysql_version()'],
                correctAnswer: 0,
                explanation: '@@version is a MySQL system variable that returns the database version.',
                hint: 'MySQL uses @@ prefix for system variables.'
            }
        ]
    },
    {
        id: '10',
        title: 'Blind SQL Injection',
        description: 'Extract data without visible output using Boolean-based techniques',
        type: 'SQL Injection',
        difficulty: 'hard',
        estimatedTime: 15,
        isPremium: false,
        xpReward: 180,
        completed: false,
        questions: [
            {
                scenario: "The application doesn't show SQL errors or query results directly on the page.",
                question: 'What type of SQL injection should you use when theres no visible output?',
                options: ['Blind SQL injection', 'Union-based injection', 'Error-based injection', 'Stacked queries'],
                correctAnswer: 0,
                explanation: 'Blind SQL injection is used when the application doesnt return query data in the response.',
                hint: 'You can only observe TRUE/FALSE conditions through application behavior.'
            },
            {
                scenario: "You need to extract the first character of the admin's password.",
                codeBlock: `' AND SUBSTRING(password,1,1)='a'--`,
                codeLanguage: 'sql',
                question: 'What does this payload test?',
                options: ['If first character of password is "a"', 'If password contains "a"', 'If password length is 1', 'If username is "a"'],
                correctAnswer: 0,
                explanation: 'SUBSTRING extracts characters at specific positions for comparison.',
                hint: 'SUBSTRING(string, start, length) extracts part of a string.'
            }
        ]
    },
    {
        id: '11',
        title: 'Second-Order SQL Injection',
        description: 'Exploit SQL injection through stored data',
        type: 'SQL Injection',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 200,
        completed: false,
        questions: [
            {
                scenario: "User registration stores the username in the database. Later, an admin panel displays user data.",
                question: 'What makes second-order SQL injection different from regular SQLi?',
                options: ['Payload is stored and triggered later', 'It requires two queries', 'It only works on second attempt', 'It needs two databases'],
                correctAnswer: 0,
                explanation: 'Second-order SQLi occurs when malicious input is stored and later used in a vulnerable query.',
                hint: 'The injection doesnt trigger immediately upon input.'
            },
            {
                scenario: "You register with username: admin'--",
                question: 'When will the SQL injection trigger?',
                options: ['When the stored username is used in another query', 'During registration', 'During login', 'Never'],
                correctAnswer: 0,
                explanation: 'The payload executes when the application retrieves and uses the malicious stored value.',
                hint: 'Think about when the stored data gets used in SQL queries.'
            }
        ]
    },

    // XSS Challenges
    {
        id: '12',
        title: 'Reflected XSS in Search',
        description: 'Exploit XSS in a search function',
        type: 'XSS',
        difficulty: 'easy',
        estimatedTime: 5,
        isPremium: false,
        xpReward: 65,
        completed: false,
        questions: [
            {
                scenario: "The search page reflects your search query in the HTML: 'You searched for: [query]'",
                question: 'What type of XSS is this?',
                options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Mutation XSS'],
                correctAnswer: 0,
                explanation: 'Reflected XSS occurs when user input is immediately returned and displayed.',
                hint: 'The payload is reflected back in the same request.'
            },
            {
                scenario: "Basic script tags are filtered out.",
                question: 'Which payload might bypass a simple <script> filter?',
                options: ['<img src=x onerror=alert(1)>', '<script>alert(1)</script>', '<javascript>alert(1)', '<style>alert(1)</style>'],
                correctAnswer: 0,
                explanation: 'Event handlers like onerror can execute JavaScript without script tags.',
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
        estimatedTime: 8,
        isPremium: false,
        xpReward: 100,
        completed: false,
        questions: [
            {
                scenario: "The page uses JavaScript: document.write(location.hash.substring(1))",
                question: 'What makes DOM-based XSS different from other XSS types?',
                options: ['Payload is processed entirely on client-side', 'It requires DOM access', 'It only works in specific browsers', 'Server must be vulnerable'],
                correctAnswer: 0,
                explanation: 'DOM-based XSS occurs when JavaScript processes untrusted data in the browser.',
                hint: 'The vulnerability is in client-side code, not server response.'
            },
            {
                scenario: "To exploit: http://site.com/page#<script>alert(1)</script>",
                question: 'Why use the URL fragment (#) for DOM XSS?',
                options: ['Fragment isnt sent to server', 'Its faster', 'It bypasses HTTPS', 'It works on all browsers'],
                correctAnswer: 0,
                explanation: 'The fragment is only processed by the browser, not sent to the server.',
                hint: 'This can bypass server-side filters completely.'
            }
        ]
    },
    {
        id: '14',
        title: 'XSS Filter Bypass',
        description: 'Bypass common XSS protections',
        type: 'XSS',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 160,
        completed: false,
        questions: [
            {
                scenario: "The WAF blocks 'script', 'alert', 'onerror' keywords.",
                question: 'Which technique can bypass keyword-based filters?',
                options: ['Case variation (ScRiPt)', 'Using more script tags', 'Longer payload', 'Different browser'],
                correctAnswer: 0,
                explanation: 'Case insensitivity in HTML can bypass case-sensitive filters.',
                hint: 'HTML tag parsing is case-insensitive.'
            },
            {
                scenario: "The filter removes the word 'script' once.",
                codeBlock: `<scrscriptipt>alert(1)</scrscriptipt>`,
                codeLanguage: 'html',
                question: 'What technique is this payload using?',
                options: ['Nested tag injection', 'Unicode encoding', 'HTML entities', 'Base64 encoding'],
                correctAnswer: 0,
                explanation: 'When "script" is removed, the remaining characters form a valid script tag.',
                hint: 'Think about what happens after the filter removes "script".'
            }
        ]
    },

    // CSRF Challenges
    {
        id: '15',
        title: 'Basic CSRF Attack',
        description: 'Understand and exploit CSRF vulnerabilities',
        type: 'CSRF',
        difficulty: 'easy',
        estimatedTime: 6,
        isPremium: false,
        xpReward: 70,
        completed: false,
        questions: [
            {
                scenario: "A banking site allows money transfers via GET request: /transfer?to=user&amount=1000",
                question: 'Why is using GET for sensitive actions vulnerable to CSRF?',
                options: ['GET requests can be triggered via img tags', 'GET is slower', 'GET cant use tokens', 'GET doesnt support HTTPS'],
                correctAnswer: 0,
                explanation: 'An img src can trigger GET requests without user interaction.',
                hint: 'Think about how browsers automatically load images.'
            },
            {
                scenario: "Create a CSRF attack to transfer $1000 to attacker.",
                question: 'Which HTML would silently trigger the transfer?',
                options: ['<img src="/transfer?to=attacker&amount=1000">', '<form action="/transfer">', '<a href="/transfer">', '<script src="/transfer">'],
                correctAnswer: 0,
                explanation: 'Hidden img tags automatically make GET requests when loaded.',
                hint: 'The attack should work without user clicking anything.'
            }
        ]
    },
    {
        id: '16',
        title: 'CSRF Against JSON APIs',
        description: 'Exploit CSRF in modern JSON-based applications',
        type: 'CSRF',
        difficulty: 'hard',
        estimatedTime: 10,
        isPremium: true,
        xpReward: 150,
        completed: false,
        questions: [
            {
                scenario: "The API only accepts Content-Type: application/json for POST requests.",
                question: 'Why might this seem to prevent CSRF?',
                options: ['Forms cant send JSON Content-Type', 'JSON is encrypted', 'POST prevents CSRF', 'APIs cant be targeted'],
                correctAnswer: 0,
                explanation: 'Standard HTML forms can only send specific Content-Type headers.',
                hint: 'Consider the limitations of HTML forms.'
            },
            {
                scenario: "You need to bypass the JSON Content-Type requirement.",
                question: 'Which technique might bypass Content-Type validation?',
                options: ['Flash-based CSRF or navigator.sendBeacon', 'Using GET instead', 'Adding more headers', 'Encoding as Base64'],
                correctAnswer: 0,
                explanation: 'Flash and some browser APIs can send custom Content-Type headers cross-origin.',
                hint: 'Some browser features allow custom headers.'
            }
        ]
    },

    // IDOR Challenges  
    {
        id: '17',
        title: 'IDOR in File Download',
        description: 'Access other users files through IDOR',
        type: 'IDOR',
        difficulty: 'easy',
        estimatedTime: 5,
        isPremium: false,
        xpReward: 60,
        completed: false,
        questions: [
            {
                scenario: "Download endpoint: /download?file_id=12345 returns your invoice.",
                question: 'What should you test first for IDOR?',
                options: ['Change file_id to other values', 'Try SQL injection', 'Upload a new file', 'Delete the file'],
                correctAnswer: 0,
                explanation: 'Changing the identifier to access other resources is the primary IDOR test.',
                hint: 'Can you access files that dont belong to you?'
            },
            {
                scenario: "Changing file_id to 12344 returns another users invoice!",
                question: 'What access control check is missing?',
                options: ['Verifying file ownership', 'Checking file type', 'Validating file size', 'Checking file date'],
                correctAnswer: 0,
                explanation: 'The server should verify the requesting user owns the requested file.',
                hint: 'Authorization should be checked before returning any resource.'
            }
        ]
    },
    {
        id: '18',
        title: 'IDOR with UUID',
        description: 'Find IDOR even with non-sequential identifiers',
        type: 'IDOR',
        difficulty: 'medium',
        estimatedTime: 8,
        isPremium: false,
        xpReward: 110,
        completed: false,
        questions: [
            {
                scenario: "The API uses UUIDs: /api/docs/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                question: 'Why might developers think UUIDs prevent IDOR?',
                options: ['UUIDs are hard to guess', 'UUIDs are encrypted', 'UUIDs change each request', 'UUIDs require authentication'],
                correctAnswer: 0,
                explanation: 'UUIDs are meant to be unpredictable, but this doesnt prevent authorization bypass.',
                hint: 'Unguessability is not the same as authorization.'
            },
            {
                scenario: "User A shares a document link with User B. User B copies the UUID.",
                question: 'How can User B still exploit IDOR with the UUID?',
                options: ['Use the leaked UUID to access the resource', 'Brute force other UUIDs', 'Convert UUID to integer', 'Decode the UUID'],
                correctAnswer: 0,
                explanation: 'If UUID is leaked (shared links, logs), IDOR is still possible.',
                hint: 'The IDOR exists if there is no additional authorization check.'
            }
        ]
    },
    {
        id: '19',
        title: 'Horizontal Privilege Escalation',
        description: 'Access resources of users at the same privilege level',
        type: 'IDOR',
        difficulty: 'medium',
        estimatedTime: 9,
        isPremium: false,
        xpReward: 120,
        completed: false,
        questions: [
            {
                scenario: "Two regular users: Alice (ID: 100) and Bob (ID: 101). Alice can view /user/100/orders.",
                question: 'What is horizontal privilege escalation?',
                options: ['Accessing another users resources at same privilege level', 'Becoming admin', 'Escalating to root', 'Gaining write access'],
                correctAnswer: 0,
                explanation: 'Horizontal escalation means accessing peer accounts, not higher privileges.',
                hint: 'Think sideways, not upward.'
            },
            {
                scenario: "Alice changes URL to /user/101/orders and sees Bobs orders.",
                question: 'What type of vulnerability is this?',
                options: ['IDOR leading to horizontal privilege escalation', 'Vertical privilege escalation', 'SQL injection', 'Authentication bypass'],
                correctAnswer: 0,
                explanation: 'IDOR is the vulnerability, horizontal escalation is the impact.',
                hint: 'Theres a direct object reference that lacks authorization.'
            }
        ]
    },

    // Auth Bypass Challenges
    {
        id: '20',
        title: 'Password Reset Token Bypass',
        description: 'Exploit weak password reset mechanisms',
        type: 'Auth Bypass',
        difficulty: 'medium',
        estimatedTime: 10,
        isPremium: false,
        xpReward: 130,
        completed: false,
        questions: [
            {
                scenario: "Password reset creates a token: /reset?token=abc123&user=victim@email.com",
                question: 'What is the vulnerability with including userid in the reset URL?',
                options: ['Attacker can change user parameter with valid token', 'Token expires too fast', 'Email is visible', 'HTTPS is not used'],
                correctAnswer: 0,
                explanation: 'If the token isnt bound to a specific user, you can change the user parameter.',
                hint: 'What if the server only validates the token exists, not who it belongs to?'
            },
            {
                scenario: "You receive reset token for your account. You modify user=admin@email.com",
                question: 'What should proper token implementation include?',
                options: ['Token bound to specific user', 'Longer token', 'Encrypted token', 'Token in cookie'],
                correctAnswer: 0,
                explanation: 'Reset tokens should be cryptographically bound to the target user.',
                hint: 'One token should only work for one user.'
            }
        ]
    },
    {
        id: '21',
        title: 'OAuth Misconfiguration',
        description: 'Exploit OAuth implementation flaws',
        type: 'Auth Bypass',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 170,
        completed: false,
        questions: [
            {
                scenario: "OAuth callback: /callback?code=xxx&redirect_uri=https://app.com/callback",
                question: 'What vulnerability exists if redirect_uri isnt properly validated?',
                options: ['Open redirect to steal authorization code', 'XSS attack', 'SQL injection', 'CSRF'],
                correctAnswer: 0,
                explanation: 'Attacker can redirect the OAuth code to their server.',
                hint: 'What if you could change where the code is sent?'
            },
            {
                scenario: "The server accepts: redirect_uri=https://evil.com/callback",
                question: 'What can the attacker do with the stolen authorization code?',
                options: ['Exchange it for access token at victim app', 'Directly access victim account', 'Modify the code', 'Delete the code'],
                correctAnswer: 0,
                explanation: 'The auth code can be traded for an access token to hijack sessions.',
                hint: 'OAuth codes are bearer credentials.'
            }
        ]
    },
    {
        id: '22',
        title: 'Session Fixation Attack',
        description: 'Force a user to use an attacker-controlled session',
        type: 'Auth Bypass',
        difficulty: 'medium',
        estimatedTime: 8,
        isPremium: false,
        xpReward: 100,
        completed: false,
        questions: [
            {
                scenario: "The application accepts session IDs from URL: /login?SESSIONID=abc123",
                question: 'What is session fixation?',
                options: ['Attacker sets victims session ID before login', 'Breaking session encryption', 'Stealing session cookies', 'Brute forcing sessions'],
                correctAnswer: 0,
                explanation: 'Session fixation forces the victim to use an attacker-known session ID.',
                hint: 'The attacker picks the session, then waits for victim to authenticate.'
            },
            {
                scenario: "Attacker sends victim link: http://bank.com/login?SESSIONID=attackerKnownID",
                question: 'What happens after victim logs in?',
                options: ['Attacker can use same session ID to access account', 'Session is invalidated', 'Victim is warned', 'Nothing happens'],
                correctAnswer: 0,
                explanation: 'If the session ID isnt regenerated, the attacker has access.',
                hint: 'The session ID was set before authentication.'
            }
        ]
    },

    // File Upload Challenges
    {
        id: '23',
        title: 'Image Upload Shell',
        description: 'Upload a web shell through image upload',
        type: 'File Upload',
        difficulty: 'medium',
        estimatedTime: 10,
        isPremium: false,
        xpReward: 130,
        completed: false,
        questions: [
            {
                scenario: "Profile picture upload only allows .jpg, .png files.",
                question: 'What should be checked beyond file extension?',
                options: ['File content/magic bytes', 'File upload time', 'File download count', 'File comment'],
                correctAnswer: 0,
                explanation: 'Magic bytes verify actual file type, not just extension.',
                hint: 'What if the file content doesnt match the extension?'
            },
            {
                scenario: "You create a file with valid JPEG header but PHP code appended.",
                codeBlock: `GIF89a<?php system($_GET['cmd']); ?>`,
                codeLanguage: 'php',
                question: 'Why might this polyglot file bypass validation?',
                options: ['Valid image header passes magic byte check', 'PHP is compressed', 'GIF89a is encrypted', 'System call is hidden'],
                correctAnswer: 0,
                explanation: 'The file appears as valid image but contains executable code.',
                hint: 'Validators often only check the beginning of files.'
            }
        ]
    },
    {
        id: '24',
        title: 'Content-Type Manipulation',
        description: 'Bypass upload filters using Content-Type header',
        type: 'File Upload',
        difficulty: 'easy',
        estimatedTime: 6,
        isPremium: false,
        xpReward: 75,
        completed: false,
        questions: [
            {
                scenario: "Upload form checks Content-Type header for image/jpeg or image/png.",
                question: 'Can you control the Content-Type header in upload requests?',
                options: ['Yes, using proxy tools like Burp Suite', 'No, browser sets it automatically', 'Only on mobile', 'Only with HTTPS'],
                correctAnswer: 0,
                explanation: 'HTTP headers can be modified with proxy tools.',
                hint: 'Interception proxies allow modifying any part of requests.'
            },
            {
                scenario: "You intercept the upload and change Content-Type to image/jpeg while uploading shell.php",
                question: 'What makes this bypass work?',
                options: ['Server trusts client-provided Content-Type', 'JPEG can contain PHP', 'Server is misconfigured', 'PHP is disabled'],
                correctAnswer: 0,
                explanation: 'Trusting client-controlled headers for validation is insecure.',
                hint: 'Never trust client input for security decisions.'
            }
        ]
    },
    {
        id: '25',
        title: 'Path Truncation Upload',
        description: 'Bypass extension filters with null bytes',
        type: 'File Upload',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 180,
        completed: false,
        questions: [
            {
                scenario: "The upload adds .jpg extension: uploaded files become filename.jpg",
                question: 'What does a null byte (%00) do in older systems?',
                options: ['Terminates string processing', 'Adds space character', 'Represents empty file', 'Causes error'],
                correctAnswer: 0,
                explanation: 'Null bytes act as string terminators in some languages.',
                hint: 'C-style strings end at null bytes.'
            },
            {
                scenario: "Upload filename: shell.php%00.jpg",
                question: 'On vulnerable systems, what filename is actually saved?',
                options: ['shell.php', 'shell.php%00.jpg', 'shell.jpg', '.jpg'],
                correctAnswer: 0,
                explanation: 'The null byte truncates the filename before .jpg is added.',
                hint: 'Everything after %00 is ignored.'
            }
        ]
    },

    // Command Injection Challenges
    {
        id: '26',
        title: 'Blind Command Injection',
        description: 'Detect and exploit command injection without output',
        type: 'Command Injection',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: false,
        xpReward: 160,
        completed: false,
        questions: [
            {
                scenario: "A PDF generator takes user input but shows no command output.",
                question: 'How can you detect blind command injection?',
                options: ['Time-based delays (sleep command)', 'Check file changes', 'Look for errors', 'View logs'],
                correctAnswer: 0,
                explanation: 'Using sleep causes measurable delays if injection works.',
                hint: 'If sleep 10 makes the response take 10 seconds longer...'
            },
            {
                scenario: "You confirm injection with: ; sleep 5 and the response is delayed.",
                question: 'How can you exfiltrate data without seeing output?',
                options: ['Out-of-band via DNS or HTTP callback', 'Read the response', 'Check error messages', 'View source code'],
                correctAnswer: 0,
                explanation: 'Out-of-band techniques send data to attacker-controlled servers.',
                hint: 'Make the server connect to your infrastructure.'
            }
        ]
    },
    {
        id: '27',
        title: 'Command Injection via Filename',
        description: 'Inject commands through file processing',
        type: 'Command Injection',
        difficulty: 'medium',
        estimatedTime: 9,
        isPremium: false,
        xpReward: 120,
        completed: false,
        questions: [
            {
                scenario: "File conversion: ffmpeg -i [uploaded_filename] output.mp4",
                question: 'What filename would inject commands?',
                options: ['video.mp4;whoami', 'video.mp4', '../video.mp4', 'video.mp4.exe'],
                correctAnswer: 0,
                explanation: 'Semicolon terminates the first command and executes the second.',
                hint: 'Shell interprets ; as command separator.'
            },
            {
                scenario: "Some characters are filtered. Which alternative might work?",
                codeBlock: `video.mp4$(whoami)`,
                codeLanguage: 'bash',
                question: 'What does $() do in bash?',
                options: ['Command substitution - executes and returns output', 'Variable declaration', 'String formatting', 'Comment'],
                correctAnswer: 0,
                explanation: '$() executes the contents and substitutes the output.',
                hint: 'Its called command substitution.'
            }
        ]
    },

    // Path Traversal Challenges
    {
        id: '28',
        title: 'Path Traversal Filter Bypass',
        description: 'Bypass common path traversal protections',
        type: 'Path Traversal',
        difficulty: 'medium',
        estimatedTime: 8,
        isPremium: false,
        xpReward: 110,
        completed: false,
        questions: [
            {
                scenario: "The application filters out '../' from file paths.",
                question: 'Which payload might bypass single-pass filtering?',
                options: ['....//....//etc/passwd', '..../etc/passwd', '%%2e%%2e/etc/passwd', '..//..//etc/passwd'],
                correctAnswer: 0,
                explanation: 'When ../ is removed from ....// , it leaves ../',
                hint: 'Similar to nested XSS tag bypass.'
            },
            {
                scenario: "URL encoding is also blocked. Try double encoding.",
                codeBlock: `%252e%252e%252f = ../../ (after double decode)`,
                codeLanguage: 'text',
                question: 'Why does double encoding sometimes work?',
                options: ['Server decodes twice but filter only checks once', 'It compresses the path', 'It encrypts the path', 'It adds authentication'],
                correctAnswer: 0,
                explanation: 'The filter sees encoded value, server decodes it again.',
                hint: 'Filter runs before final decode.'
            }
        ]
    },
    {
        id: '29',
        title: 'Windows Path Traversal',
        description: 'Exploit path traversal on Windows systems',
        type: 'Path Traversal',
        difficulty: 'easy',
        estimatedTime: 5,
        isPremium: false,
        xpReward: 65,
        completed: false,
        questions: [
            {
                scenario: "The vulnerable Windows server uses: ..\\..\\windows\\system.ini",
                question: 'What is the Windows directory separator?',
                options: ['Backslash (\\)', 'Forward slash (/)', 'Colon (:)', 'Pipe (|)'],
                correctAnswer: 0,
                explanation: 'Windows traditionally uses backslash for paths.',
                hint: 'Think about how Windows file paths look.'
            },
            {
                scenario: "Linux-style traversal doesnt work. Try Windows specific.",
                question: 'Which file is a good target to confirm Windows path traversal?',
                options: ['C:\\Windows\\win.ini', '/etc/passwd', '~/.bashrc', '/var/log/auth.log'],
                correctAnswer: 0,
                explanation: 'win.ini is a reliable file present on all Windows systems.',
                hint: 'Windows has different system files than Linux.'
            }
        ]
    },

    // Advanced Challenges
    {
        id: '30',
        title: 'Server-Side Template Injection',
        description: 'Exploit template engines for code execution',
        type: 'SSTI',
        difficulty: 'hard',
        estimatedTime: 15,
        isPremium: true,
        xpReward: 200,
        completed: false,
        questions: [
            {
                scenario: "User input is rendered in a Jinja2 template: Hello {{name}}!",
                question: 'What payload would test for SSTI?',
                options: ['{{7*7}} to see if 49 appears', '<script>alert(1)</script>', 'OR 1=1--', '../etc/passwd'],
                correctAnswer: 0,
                explanation: 'Math expressions are processed by template engines if vulnerable.',
                hint: 'Template engines evaluate expressions within their syntax.'
            },
            {
                scenario: "{{7*7}} returns 49! The application is vulnerable.",
                question: 'Why is SSTI dangerous?',
                options: ['Can lead to remote code execution', 'Only causes XSS', 'Only affects display', 'Causes denial of service'],
                correctAnswer: 0,
                explanation: 'Template engines often have access to system functions and code execution.',
                hint: 'Templates run on the server with server permissions.'
            }
        ]
    },
    {
        id: '31',
        title: 'XML External Entity (XXE)',
        description: 'Exploit XML parsers to read files and more',
        type: 'XXE',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 180,
        completed: false,
        questions: [
            {
                scenario: "The application parses XML input for user data.",
                codeBlock: `<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<user>&xxe;</user>`,
                codeLanguage: 'xml',
                question: 'What does this XXE payload attempt to do?',
                options: ['Read /etc/passwd file content', 'Create a new entity', 'Validate XML structure', 'Encrypt the data'],
                correctAnswer: 0,
                explanation: 'External entities can reference local files or URLs.',
                hint: 'SYSTEM allows referencing external resources.'
            },
            {
                scenario: "XXE confirmed. The entity value appears in the response.",
                question: 'What else can XXE be used for besides file reading?',
                options: ['SSRF - server-side request forgery', 'Only file reading', 'Only DOS attacks', 'Only data validation'],
                correctAnswer: 0,
                explanation: 'XXE can make requests to internal services the server can access.',
                hint: 'External entities can reference URLs, not just files.'
            }
        ]
    },
    {
        id: '32',
        title: 'Insecure Deserialization',
        description: 'Exploit unsafe object deserialization',
        type: 'Deserialization',
        difficulty: 'hard',
        estimatedTime: 15,
        isPremium: true,
        xpReward: 220,
        completed: false,
        questions: [
            {
                scenario: "The application deserializes user-provided data without validation.",
                question: 'Why is insecure deserialization dangerous?',
                options: ['Can lead to remote code execution', 'Only causes data corruption', 'Only affects performance', 'Causes SQL errors'],
                correctAnswer: 0,
                explanation: 'Malicious serialized objects can execute code when deserialized.',
                hint: 'Objects can have methods that run automatically.'
            },
            {
                scenario: "You see a cookie that looks like serialized data.",
                codeBlock: `O:4:"User":2:{s:4:"name";s:5:"admin";s:4:"role";s:4:"user";}`,
                codeLanguage: 'text',
                question: 'What serialization format is this?',
                options: ['PHP serialization', 'JSON', 'Python pickle', 'Java serialization'],
                correctAnswer: 0,
                explanation: 'O: indicates PHP object serialization format.',
                hint: 'Each language has its own serialization format.'
            }
        ]
    },
    {
        id: '33',
        title: 'Race Condition Exploitation',
        description: 'Exploit timing vulnerabilities in concurrent operations',
        type: 'Race Condition',
        difficulty: 'hard',
        estimatedTime: 12,
        isPremium: true,
        xpReward: 190,
        completed: false,
        questions: [
            {
                scenario: "Coupon code 'DISCOUNT50' is single-use. Applied in checkout process.",
                question: 'What might happen if two requests apply the coupon simultaneously?',
                options: ['Both might succeed before the code is marked used', 'Both fail', 'Server crashes', 'Coupon value doubles'],
                correctAnswer: 0,
                explanation: 'Without proper locking, both requests can pass the "is valid" check.',
                hint: 'The check and the use are separate operations.'
            },
            {
                scenario: "You use Burp Intruder to send 50 simultaneous requests applying the coupon.",
                question: 'What tool feature is most useful for race conditions?',
                options: ['Parallel/concurrent request sending', 'Fuzzing wordlists', 'Response comparison', 'Session handling'],
                correctAnswer: 0,
                explanation: 'Sending many concurrent requests maximizes chance of race condition.',
                hint: 'Timing is everything in race conditions.'
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
    { id: 'streak7', name: '7 Day Streak', icon: '🔥', unlocked: false, rarity: 'common' },
    { id: 'firstblood', name: 'First Blood', icon: '🩸', unlocked: false, rarity: 'common' },
    { id: 'interview', name: 'Interview Master', icon: '🎤', unlocked: false, rarity: 'rare' },
    { id: 'sqli_master', name: 'SQL Ninja', icon: '💉', unlocked: false, rarity: 'epic' },
    { id: 'perfect', name: 'Perfectionist', icon: '💯', unlocked: false, rarity: 'legendary' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '⚔️', unlocked: false, rarity: 'common' },
    { id: 'xss_hunter', name: 'XSS Hunter', icon: '🎯', unlocked: false, rarity: 'rare' },
    { id: 'auth_master', name: 'Auth Breaker', icon: '🔓', unlocked: false, rarity: 'epic' },
    { id: 'bug_bounty', name: 'Bug Bounty Pro', icon: '🏆', unlocked: false, rarity: 'legendary' },
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', unlocked: false, rarity: 'rare' },
    { id: 'accuracy_ace', name: 'Accuracy Ace', icon: '🎯', unlocked: false, rarity: 'epic' },
    { id: 'all_rounder', name: 'All Rounder', icon: '🌟', unlocked: false, rarity: 'legendary' }
];
