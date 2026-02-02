import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocFromCache, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Default profile for new users (used as fallback)
const DEFAULT_PROFILE = {
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    title: 'Beginner',
    streak: 0,
    lastActivityDate: null,
    totalCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    accuracyRate: 0,
    isPremium: false,
    subscriptionType: null,
};

// Promise with timeout - don't wait forever for Firestore
function withTimeout(promise, ms = 5000) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), ms)
        )
    ]);
}

// Helper to load user profile from Firestore (with graceful fallback)
async function loadUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);

    try {
        // Try to get from cache first (instant)
        const cachedSnap = await getDocFromCache(userRef).catch(() => null);
        if (cachedSnap?.exists()) {
            console.log('Loaded profile from cache');
            return { ...user, ...cachedSnap.data() };
        }
    } catch {
        // Cache miss is fine, continue to network
    }

    try {
        // Try network with timeout (5 seconds max)
        const userSnap = await withTimeout(getDoc(userRef), 5000);

        if (userSnap.exists()) {
            return { ...user, ...userSnap.data() };
        }

        // Profile doesn't exist - create it
        await withTimeout(setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Hacker',
            photoURL: user.photoURL || null,
            ...DEFAULT_PROFILE,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }), 5000);

        // Return the user with default profile
        return {
            ...user,
            ...DEFAULT_PROFILE,
            displayName: user.displayName || user.email?.split('@')[0] || 'Hacker',
        };
    } catch (error) {
        console.warn('Firestore unavailable, using fallback profile:', error.message);
    }

    // FALLBACK: Return Firebase Auth user with default profile
    return {
        ...user,
        ...DEFAULT_PROFILE,
        displayName: user.displayName || user.email?.split('@')[0] || 'Hacker',
    };
}

// Helper to create user profile in Firestore
async function createUserProfile(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        await withTimeout(setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Hacker',
            photoURL: user.photoURL || null,
            ...DEFAULT_PROFILE,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true }), 5000);
    } catch (error) {
        console.warn('Could not create Firestore profile:', error.message);
    }
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const fullUser = await loadUserProfile(user);
                setCurrentUser(fullUser);
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
        createUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
