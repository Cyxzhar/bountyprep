import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime = 0) => {
    const [elapsedTime, setElapsedTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        setElapsedTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const start = useCallback(() => setIsRunning(true), []);
    const stop = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedTime(0);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        elapsedTime,
        setElapsedTime,
        formattedTime: formatTime(elapsedTime),
        isRunning,
        start,
        stop,
        reset,
        formatTime // Exporting utility in case custom formatting needed
    };
};
