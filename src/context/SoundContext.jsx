import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export function useSound() {
    return useContext(SoundContext);
}

// Audio assets configuration
// In a real app, these would be paths to files in /public/sounds/
const SOUNDS = {
    // SFX
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    levelUp: '/sounds/levelup.mp3',
    notification: '/sounds/notification.mp3',

    // BGM
    ambient: '/sounds/ambient-cyber.mp3',
    focus: '/sounds/ambient-cyber.mp3', // Fallback as deep-focus is missing
    intro: '/sounds/candy-clouds-beats.mp3',
};

export function SoundProvider({ children }) {
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('sound_muted') === 'true';
    });

    const [globalVolume, setGlobalVolume] = useState(0.5);
    const bgmRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Persist mute state
    useEffect(() => {
        localStorage.setItem('sound_muted', isMuted);
        if (bgmRef.current) {
            bgmRef.current.muted = isMuted;
        }
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
        const { loop = true, volume = 1.0 } = options;
        const path = SOUNDS[name];
        if (!path) return;

        // If already playing this track, do nothing
        if (currentTrack === name && bgmRef.current && !bgmRef.current.paused) return;

        // Stop current if different
        if (bgmRef.current) {
            fadeOutAndStop(bgmRef.current, () => {
                startNewTrack(path, name, loop, volume);
            });
        } else {
            startNewTrack(path, name, loop, volume);
        }
    };

    const startNewTrack = (path, name, loop, relativeVol) => {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.volume = 0; // Start at 0 for fade in
        audio.muted = isMuted;

        bgmRef.current = audio;
        setCurrentTrack(name);

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // If the current track changed while we were loading, stop this one
                if (bgmRef.current !== audio) {
                    audio.pause();
                    return;
                }
                fadeIn(audio, relativeVol);
            }).catch(e => {
                // Ignore "interrupted by pause" errors (common during rapid navigation)
                if (e.name === 'AbortError' || e.message.includes('interrupted')) {
                    return;
                }
                // Ignore Autoplay policy errors (User didn't interact yet)
                if (e.name === 'NotAllowedError') {
                    // console.debug("Autoplay waiting for interaction");
                    return;
                }
                console.warn("BGM Playback failed:", e.message);
            });
        }
    };

    const stopBGM = () => {
        if (bgmRef.current) {
            fadeOutAndStop(bgmRef.current, () => {
                bgmRef.current = null;
                setCurrentTrack(null);
            });
        }
    };

    // Fade helpers
    const fadeIn = (audio, relativeVol = 1.0) => {
        let vol = 0;
        const target = globalVolume * relativeVol; // BGM is softer than SFX
        const interval = setInterval(() => {
            if (!audio || audio.paused) {
                clearInterval(interval);
                return;
            }
            vol = Math.min(vol + 0.05, target);
            audio.volume = vol;
            if (vol >= target) clearInterval(interval);
        }, 100);
    };

    const fadeOutAndStop = (audio, callback) => {
        if (!audio) {
            if (callback) callback();
            return;
        }

        let vol = audio.volume;
        const interval = setInterval(() => {
            vol = Math.max(0, vol - 0.05);
            audio.volume = vol;
            if (vol <= 0) {
                clearInterval(interval);
                audio.pause();
                if (callback) callback();
            }
        }, 50);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const value = {
        isMuted,
        toggleMute,
        playSFX,
        playBGM,
        stopBGM
    };

    return (
        <SoundContext.Provider value={value}>
            {children}
        </SoundContext.Provider>
    );
}
