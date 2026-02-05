import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime = 0, options = {}) => {
    const { mode = 'countup', onExpire } = options;
    const [elapsedTime, setElapsedTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        setElapsedTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    if (mode === 'countdown') {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setIsRunning(false);
                            if (onExpire) onExpire();
                            return 0;
                        }
                        return prev - 1;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, mode, onExpire]);

    const start = useCallback(() => setIsRunning(true), []);
    const stop = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedTime(initialTime);
    }, [initialTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        time: elapsedTime, // Renamed for clarity, but kept aliases below
        elapsedTime,      // Legacy support
        remainingTime: elapsedTime, // Alias for countdown
        formattedTime: formatTime(elapsedTime),
        isRunning,
        start,
        stop,
        reset,
        formatTime
    };
};
