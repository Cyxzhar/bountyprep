
import { db } from '../lib/firebase';
import { doc, setDoc, writeBatch, collection } from 'firebase/firestore';
import { courses } from '../data/courses';
import { challenges } from '../data/challenges';

/**
 * Seeds the database with courses and challenges data.
 * This is an admin utility to ensure Firestore has the latest content.
 */
export async function seedDatabase() {
    console.log('Starting database seed...');
    let results = {
        courses: 0,
        challenges: 0,
        errors: []
    };

    try {
        // 1. Seed Courses
        const courseBatch = writeBatch(db);
        let courseCount = 0;

        for (const course of courses) {
            const courseRef = doc(db, 'courses', course.id);
            // Sanitize: remove icon keys (React components/functions)
            const { icon, ...courseData } = course;

            // We use setDoc with merge to update content without destroying unrelated fields if any
            courseBatch.set(courseRef, {
                ...courseData,
                lastUpdated: new Date()
            }, { merge: true });
            courseCount++;
        }

        await courseBatch.commit();
        results.courses = courseCount;
        console.log(`Seeded ${courseCount} courses.`);

        // 2. Seed Challenges
        // Firestore batches produce limits (500 ops), so we might need multiple batches if challenges grow
        const BATCH_SIZE = 400;
        const chunks = [];

        for (let i = 0; i < challenges.length; i += BATCH_SIZE) {
            chunks.push(challenges.slice(i, i + BATCH_SIZE));
        }

        for (const chunk of chunks) {
            const batch = writeBatch(db);
            for (const challenge of chunk) {
                const challengeRef = doc(db, 'challenges', challenge.id);
                // Sanitize: remove icon keys if present (just in case)
                const { icon, ...challengeData } = challenge;

                batch.set(challengeRef, {
                    ...challengeData,
                    lastUpdated: new Date()
                }, { merge: true });
            }
            await batch.commit();
            results.challenges += chunk.length;
        }

        console.log(`Seeded ${results.challenges} challenges.`);
        return { success: true, ...results };

    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, error: error.message };
    }
}
