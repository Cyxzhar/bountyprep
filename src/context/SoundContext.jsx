import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export function useSound() {
    return useContext(SoundContext);
}

// Audio assets configuration
const SOUNDS = {
    // SFX
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    levelUp: '/sounds/levelup.mp3',
    notification: '/sounds/notification.mp3',

    // BGM
    cyber: '/sounds/ambient-cyber.mp3',        // Main theme for onboarding
    challenge: '/sounds/candy-clouds-beats.mp3', // Challenge theme
    ambient: '/sounds/ambient-cyber.mp3',      // Kept for backward compatibility
    intro: '/sounds/candy-clouds-beats.mp3',   // Kept for backward compatibility
};

export function SoundProvider({ children }) {
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('sound_muted') === 'true';
    });

    const [globalVolume, setGlobalVolume] = useState(0.5);
    const bgmRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const periodicTimerRef = useRef(null);
    const pendingTrackRef = useRef(null); // Track pending audio info for retry

    // Persist mute state to localStorage
    useEffect(() => {
        localStorage.setItem('sound_muted', isMuted);
        // Note: We now pause/resume in toggleMute() instead of using audio.muted
    }, [isMuted]);

    const playSFX = (name) => {
        if (isMuted) return;

        const path = SOUNDS[name];
        if (!path) {
            console.warn(`Sound "${name}" not found`);
            return;
        }

        const audio = new Audio(path);
        audio.volume = globalVolume; // SFX play at standard volume
        audio.play().catch(e => {
            // Ignore autoplay errors for SFX usually
            // console.debug('SFX play failed', e);
        });
    };

    const playBGM = (name, options = {}) => {
        const { loop = true, volume = 1.0, periodic = false, periodInterval = 600000 } = options;
        const path = SOUNDS[name];
        if (!path) {
            console.warn(`[Audio] Sound "${name}" not found`);
            return;
        }

        // Don't start new audio if muted (can resume existing via toggleMute)
        if (isMuted && !bgmRef.current) {
            return;
        }

        // Only skip if actually playing (not just paused/blocked)
        if (currentTrack === name && isPlaying && bgmRef.current && !bgmRef.current.paused) {
            return;
        }

        // Store pending track info for retry after user interaction
        pendingTrackRef.current = { name, path, loop, volume, options };

        // Clear any existing periodic timer
        if (periodicTimerRef.current) {
            clearInterval(periodicTimerRef.current);
            periodicTimerRef.current = null;
        }

        // Stop current if exists
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current = null;
        }

        startNewTrack(path, name, loop, volume);
        if (periodic) {
            setupPeriodicPlayback(name, options);
        }
    };

    const startNewTrack = (path, name, loop, relativeVol) => {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.volume = 0; // Start at 0 for fade in
        // Don't set muted here - we use pause/resume for mute control

        bgmRef.current = audio;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // If the current track changed while we were loading, stop this one
                if (bgmRef.current !== audio) {
                    audio.pause();
                    return;
                }
                // Only set as current track if it actually started playing
                setCurrentTrack(name);
                setIsPlaying(true);
                fadeIn(audio, relativeVol);

                // Clear pending track since it's now playing
                pendingTrackRef.current = null;
            }).catch(e => {
                // Ignore "interrupted by pause" errors (common during rapid navigation)
                if (e.name === 'AbortError' || e.message.includes('interrupted')) {
                    return;
                }
                // Handle Autoplay policy errors (User didn't interact yet)
                if (e.name === 'NotAllowedError') {
                    console.warn("⚠️ [Audio] Autoplay blocked - waiting for user interaction");
                    // Don't set as current track since it didn't play
                    setCurrentTrack(null);
                    setIsPlaying(false);
                    // Keep pendingTrackRef so we can retry later
                    return;
                }
                console.error("❌ [Audio] Playback failed:", e.message, e);
                setCurrentTrack(null);
                setIsPlaying(false);
            });
        }
    };

    const stopBGM = (immediate = false) => {
        // Clear periodic timer
        if (periodicTimerRef.current) {
            clearInterval(periodicTimerRef.current);
            periodicTimerRef.current = null;
        }

        if (bgmRef.current) {
            if (immediate) {
                // Stop immediately without fade (for navigation cleanup)
                bgmRef.current.pause();
                bgmRef.current.currentTime = 0;
                bgmRef.current = null;
                setCurrentTrack(null);
                setIsPlaying(false);
            } else {
                // Fade out gracefully
                fadeOutAndStop(bgmRef.current, () => {
                    bgmRef.current = null;
                    setCurrentTrack(null);
                    setIsPlaying(false);
                });
            }
        }
    };

    const setupPeriodicPlayback = (name, options) => {
        const { periodInterval = 600000, volume = 1.0 } = options; // Default 10 minutes

        periodicTimerRef.current = setInterval(() => {
            // Play the track once (non-looping)
            const path = SOUNDS[name];
            if (path && !isMuted) {
                const audio = new Audio(path);
                audio.volume = globalVolume * volume;
                audio.play().catch(e => console.debug('[Audio] Periodic playback failed:', e));
            }
        }, periodInterval);
    };

    const retryPendingAudio = () => {
        if (pendingTrackRef.current) {
            const { name, path, loop, volume } = pendingTrackRef.current;
            startNewTrack(path, name, loop, volume);
        }
    };

    // Fade helpers
    const fadeIn = (audio, targetVol) => {
        // Instant play for snap
        audio.volume = globalVolume * targetVol;
    };

    const fadeOutAndStop = (audio, callback) => {
        if (!audio) {
            if (callback) callback();
            return;
        }

        callback(); // Immediate stop for snap
        audio.pause();
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        // Actually pause/resume audio when toggling, not just mute
        if (bgmRef.current) {
            if (newMutedState) {
                bgmRef.current.pause();
                setIsPlaying(false);
            } else {
                const resumePromise = bgmRef.current.play();
                if (resumePromise !== undefined) {
                    resumePromise.then(() => {
                        setIsPlaying(true);
                    }).catch(e => {
                        console.warn('[Audio] Resume failed:', e.message);
                    });
                }
            }
        }
    };

    // Cleanup periodic timer on unmount
    useEffect(() => {
        return () => {
            if (periodicTimerRef.current) {
                clearInterval(periodicTimerRef.current);
            }
            if (bgmRef.current) {
                bgmRef.current.pause();
            }
        };
    }, []);

    const value = {
        isMuted,
        toggleMute,
        playSFX,
        playBGM,
        stopBGM,
        currentTrack,
        isPlaying,
        retryPendingAudio
    };

    return (
        <SoundContext.Provider value={value}>
            {children}
        </SoundContext.Provider>
    );
}
