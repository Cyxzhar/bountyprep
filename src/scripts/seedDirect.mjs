/**
 * Direct Firestore Seeder using Firebase Admin SDK
 * 
 * Usage:
 * 1. Download service account key from Firebase Console
 * 2. Save it as 'serviceAccountKey.json' in project root
 * 3. Run: node src/scripts/seedDirect.mjs
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
    process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
console.log(`📋 Using project: ${serviceAccount.project_id}`);

const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
});

// Get Firestore with explicit database ID
const db = getFirestore(app);

// Challenge data
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
    }
];

async function seed() {
    console.log('🌱 Seeding challenges to Firestore...\n');

    // First, test connection
    try {
        const testRef = db.collection('_test').doc('connection');
        await testRef.set({ test: true, timestamp: new Date() });
        await testRef.delete();
        console.log('✅ Firestore connection successful!\n');
    } catch (error) {
        console.error('❌ Firestore connection failed:', error.message);
        console.error('\nPossible fixes:');
        console.error('1. Enable Firestore API: https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=' + serviceAccount.project_id);
        console.error('2. Create Firestore database in Firebase Console if not done');
        console.error('3. Check service account has Firestore permissions');
        process.exit(1);
    }

    for (const challenge of challenges) {
        try {
            await db.collection('challenges').doc(challenge.id).set({
                ...challenge,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ ${challenge.title}`);
        } catch (error) {
            console.error(`❌ ${challenge.id}: ${error.message}`);
        }
    }

    console.log('\n✨ Seeding complete!');
}

seed().catch(console.error);
