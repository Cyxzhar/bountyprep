
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Cache to prevent re-fetching on every mount (simple in-memory cache)
const cache = {
    challenges: null,
    courses: null,
    achievements: null
};

export const useChallenges = () => {
    const [challenges, setChallenges] = useState(cache.challenges || []);
    const [loading, setLoading] = useState(!cache.challenges);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache.challenges) {
            setLoading(false);
            return;
        }

        const fetchChallenges = async () => {
            try {
                // Fetch all challenges
                const querySnapshot = await getDocs(collection(db, 'challenges'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by ID (numeric if possible) or createAt
                const sorted = data.sort((a, b) => {
                    const idA = parseInt(a.id);
                    const idB = parseInt(b.id);
                    return !isNaN(idA) && !isNaN(idB) ? idA - idB : a.id.localeCompare(b.id);
                });

                cache.challenges = sorted;
                setChallenges(sorted);
            } catch (err) {
                console.error("Error fetching challenges:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    return { challenges, loading, error };
};

export const useCourses = () => {
    const [courses, setCourses] = useState(cache.courses || []);
    const [loading, setLoading] = useState(!cache.courses);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache.courses) {
            setLoading(false);
            return;
        }

        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                cache.courses = data;
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading, error };
};

export const useAchievements = () => {
    const [achievements, setAchievements] = useState(cache.achievements || []);
    const [loading, setLoading] = useState(!cache.achievements);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache.achievements) {
            setLoading(false);
            return;
        }

        const fetchAchievements = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'achievements'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                cache.achievements = data;
                setAchievements(data);
            } catch (err) {
                console.error("Error fetching achievements:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    return { achievements, loading, error };
};
