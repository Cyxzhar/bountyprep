import { db } from '../config/firebase'; // Adjust path if needed
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { courses } from '../data/courses';
import { challenges } from '../data/challenges';

export const seedDatabase = async () => {
    console.log('Starting database seed...');
    try {
        const batch = writeBatch(db);

        // Seed Courses
        console.log(`Seeding ${courses.length} courses...`);
        courses.forEach(course => {
            const courseRef = doc(db, 'courses', course.id);
            batch.set(courseRef, course, { merge: true });
        });

        // Seed Challenges
        console.log(`Seeding ${challenges.length} challenges...`);
        challenges.forEach(challenge => {
            const challengeRef = doc(db, 'challenges', challenge.id);
            batch.set(challengeRef, challenge, { merge: true });
        });

        await batch.commit();
        console.log('Database seeded successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
};
