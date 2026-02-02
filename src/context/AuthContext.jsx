import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Helper to create user profile in Firestore
async function createUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Only create if doesn't exist (prevents overwriting on Google re-login)
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Hacker',
            photoURL: user.photoURL || null,

            // Profile & Leveling
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            title: 'Beginner',

            // Gamification
            streak: 0,
            lastActivityDate: null,

            // Stats
            totalCompleted: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            accuracyRate: 0,

            // Subscription
            isPremium: false,
            subscriptionType: null,

            // Timestamps
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }
}

// Helper to load user profile from Firestore
async function loadUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // Merge Firebase Auth user with Firestore profile
        return { ...user, ...userSnap.data() };
    }

    // Profile doesn't exist yet, create it
    await createUserProfile(user);
    const newSnap = await getDoc(userRef);
    return { ...user, ...newSnap.data() };
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Load full profile from Firestore
                    const fullUser = await loadUserProfile(user);
                    setCurrentUser(fullUser);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                    // Fallback to Firebase Auth user only
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        loading,
        logout,
        // Expose helper for signup flow
        createUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
