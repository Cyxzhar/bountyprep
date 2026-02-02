import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
    const [visitedPages, setVisitedPages] = useState(() => {
        // Load visited pages from sessionStorage
        const stored = sessionStorage.getItem('visitedPages');
        return stored ? JSON.parse(stored) : {};
    });

    const [isFirstAppVisit, setIsFirstAppVisit] = useState(() => {
        return !sessionStorage.getItem('appVisited');
    });

    // Mark app as visited after first render
    useEffect(() => {
        if (isFirstAppVisit) {
            const timer = setTimeout(() => {
                sessionStorage.setItem('appVisited', 'true');
                setIsFirstAppVisit(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isFirstAppVisit]);

    const markPageVisited = useCallback((pageName) => {
        setVisitedPages(prev => {
            if (prev[pageName]) return prev; // Already visited, no update needed
            const updated = { ...prev, [pageName]: true };
            sessionStorage.setItem('visitedPages', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const hasVisitedPage = useCallback((pageName) => {
        return visitedPages[pageName] === true;
    }, [visitedPages]);

    const shouldAnimatePage = useCallback((pageName) => {
        return !visitedPages[pageName];
    }, [visitedPages]);

    return (
        <AnimationContext.Provider value={{
            visitedPages,
            isFirstAppVisit,
            markPageVisited,
            hasVisitedPage,
            shouldAnimatePage
        }}>
            {children}
        </AnimationContext.Provider>
    );
}

export function useAnimation() {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within AnimationProvider');
    }
    return context;
}

// Hook for page-level animations
export function usePageAnimation(pageName) {
    const { shouldAnimatePage, markPageVisited } = useAnimation();
    // Capture the initial value only once
    const shouldAnimateRef = useRef(shouldAnimatePage(pageName));
    const hasMarkedRef = useRef(false);

    useEffect(() => {
        // Only mark once
        if (!hasMarkedRef.current) {
            hasMarkedRef.current = true;
            markPageVisited(pageName);
        }
    }, [pageName, markPageVisited]);

    return shouldAnimateRef.current;
}
