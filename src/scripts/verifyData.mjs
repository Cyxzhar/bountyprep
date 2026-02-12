/**
 * Verify Course Data
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');
const serviceAccountPath = join(projectRoot, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
});

const db = getFirestore(app);

async function verify() {
    const doc = await db.collection('courses').doc('intro-to-bug-bounty').get();
    if (doc.exists) {
        console.log('Course Data:', JSON.stringify(doc.data(), null, 2));
    } else {
        console.log('Doc not found');
    }
}

verify().catch(console.error);
