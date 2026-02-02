/**
 * Seed Challenges Script
 * 
 * This script migrates challenges from src/data/challenges.js to Firestore.
 * Run with: node src/scripts/seedChallenges.js
 * 
 * Note: This is a one-time operation. It requires Firebase Admin SDK for
 * server-side execution OR can be run from the browser dev console.
 */

// For browser execution (copy-paste into dev console while logged in as admin):
/*
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { challenges } from '../data/challenges';

async function seedChallenges() {
    console.log('🌱 Seeding challenges to Firestore...');

    for (const challenge of challenges) {
        try {
            await setDoc(doc(db, 'challenges', challenge.id.toString()), {
                id: challenge.id.toString(),
                title: challenge.title,
                description: challenge.description,
                type: challenge.type,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
                isPremium: challenge.isPremium || false,
                estimatedTimeMinutes: challenge.estimatedTime || 10,
                questions: challenge.questions,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            console.log(`✅ ${challenge.title}`);
        } catch (error) {
            console.error(`❌ Error seeding ${challenge.id}:`, error);
        }
    }

    console.log('✨ Done!');
}

seedChallenges();
*/

// Export for easy import in a React component (temporary seeder UI)
export const seedChallengesFromBrowser = async (db, challenges) => {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    console.log('🌱 Seeding challenges to Firestore...');
    const results = [];

    for (const challenge of challenges) {
        try {
            await setDoc(doc(db, 'challenges', challenge.id.toString()), {
                id: challenge.id.toString(),
                title: challenge.title,
                description: challenge.description,
                type: challenge.type,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
                isPremium: challenge.isPremium || false,
                estimatedTimeMinutes: challenge.estimatedTime || 10,
                questions: challenge.questions,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            console.log(`✅ ${challenge.title}`);
            results.push({ id: challenge.id, success: true });
        } catch (error) {
            console.error(`❌ Error seeding ${challenge.id}:`, error);
            results.push({ id: challenge.id, success: false, error: error.message });
        }
    }

    console.log('✨ Done!');
    return results;
};
