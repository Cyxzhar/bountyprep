/**
 * Sync Local Data to Firestore
 * 
 * Usage: node src/scripts/syncData.mjs
 * 
 * This script reads the source of truth data from src/data/*.js
 * and updates the corresponding collections in Firestore.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import local data
import { challenges } from '../data/challenges.js';
import { courses } from '../data/courses.js';
import { achievements } from '../data/achievements.js';

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
console.log(`📋 Syncing data to project: ${serviceAccount.project_id}\n`);

const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
});

const db = getFirestore(app);

async function syncCollection(collectionName, data, idField = 'id') {
    console.log(`\n🔄 Syncing ${collectionName} (${data.length} items)...`);
    let updated = 0;
    let errors = 0;

    const batchSize = 500; // Firestore batch limit
    // Ensure we handle batches if data exceeds 500 items (unlikely for now but good practice)

    // For simplicity in this script, we'll do individual writes to allow specific error logging
    // In production with large datasets, use batch()

    // Icon Mapping for Courses (since React components don't serialize)
    const COURSE_ICONS = {
        'intro-to-bug-bounty': 'Trophy',
        'web-hacking-fundamentals': 'Shield',
        'burp-suite-mastery': 'Search',
        'network-security': 'Globe',
        'linux-privilege-escalation': 'Terminal'
    };

    for (const item of data) {
        if (!item[idField]) {
            console.warn(`⚠️ Skipping item without validation ID in ${collectionName}`);
            continue;
        }

        try {
            // Clean undefined values which Firestore rejects
            const cleanItem = JSON.parse(JSON.stringify(item));

            // Inject iconName for courses if available in mapping
            if (collectionName === 'courses' && COURSE_ICONS[item[idField]]) {
                cleanItem.iconName = COURSE_ICONS[item[idField]];
                // Verify icon is removed (it should be undefined after JSON.stringify)
                delete cleanItem.icon;
            }

            // Add metadata
            const docData = {
                ...cleanItem,
                lastSyncedAt: new Date()
            };

            await db.collection(collectionName).doc(item[idField]).set(docData, { merge: true });
            updated++;
            process.stdout.write('.');
        } catch (error) {
            console.error(`\n❌ Failed to sync ${item[idField]}: ${error.message}`);
            errors++;
        }
    }

    console.log(`\n✅ ${collectionName} complete: ${updated} updated, ${errors} errors.`);
}

async function run() {
    try {
        await syncCollection('challenges', challenges);
        await syncCollection('courses', courses);
        // Transform achievements if necessary. 
        // Note: The achievements array in src/data/achievements.js contains functions (condition).
        // Firestore cannot store functions. We must strip them.
        const serializableAchievements = achievements.map(({ condition, ...rest }) => rest);
        await syncCollection('achievements', serializableAchievements);

        console.log('\n✨ All data synchronized successfully!');
    } catch (error) {
        console.error('\n❌ Sync failed:', error);
        process.exit(1);
    }
}

run();
