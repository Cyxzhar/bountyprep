/**
 * Check Firestore Data Counts
 * 
 * Usage: node src/scripts/checkData.mjs
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
console.log(`📋 Checking project: ${serviceAccount.project_id}\n`);

const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
});

const db = getFirestore(app);

async function checkCollections() {
    const collections = ['challenges', 'courses', 'achievements'];

    console.log('📊 Database Status:');
    console.log('------------------');

    for (const colName of collections) {
        try {
            const snapshot = await db.collection(colName).count().get();
            console.log(`${colName.padEnd(15)}: ${snapshot.data().count} documents`);
        } catch (error) {
            console.error(`❌ Error checking ${colName}:`, error.message);
        }
    }
    console.log('------------------\n');
}

checkCollections().catch(console.error);
