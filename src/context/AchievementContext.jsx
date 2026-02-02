import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AchievementUnlock from '../components/AchievementUnlock';

const AchievementContext = createContext(null);

export function AchievementProvider({ children }) {
    const [queue, setQueue] = useState([]);
    const [currentAchievement, setCurrentAchievement] = useState(null);

    // Process queue
    useEffect(() => {
        if (!currentAchievement && queue.length > 0) {
            setCurrentAchievement(queue[0]);
            setQueue(prev => prev.slice(1));
        }
    }, [queue, currentAchievement]);

    const unlock = useCallback((achievement) => {
        setQueue(prev => [...prev, achievement]);
    }, []);

    // Unlock multiple at once
    const unlockMultiple = useCallback((achievements) => {
        setQueue(prev => [...prev, ...achievements]);
    }, []);

    const closeUnlock = useCallback(() => {
        setCurrentAchievement(null);
    }, []);

    return (
        <AchievementContext.Provider value={{ unlock, unlockMultiple }}>
            {children}
            {currentAchievement && (
                <AchievementUnlock
                    achievement={currentAchievement}
                    onClose={closeUnlock}
                />
            )}
        </AchievementContext.Provider>
    );
}

export function useAchievement() {
    return useContext(AchievementContext);
}
