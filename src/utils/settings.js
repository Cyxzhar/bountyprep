/**
 * Settings Utility
 * Persists user preferences to localStorage
 */

const SETTINGS_KEY = 'bugora_settings';

const DEFAULT_SETTINGS = {
    darkMode: true, // Default is dark
    notifications: true,
    language: 'en',
    learningReminders: false,
};

export function getSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.warn('Failed to read settings:', e);
    }
    return DEFAULT_SETTINGS;
}

export function updateSetting(key, value) {
    try {
        const current = getSettings();
        const updated = { ...current, [key]: value };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.warn('Failed to save setting:', e);
        return getSettings();
    }
}

export function getSetting(key) {
    return getSettings()[key];
}

// Share functionality using Web Share API
export async function shareApp() {
    const shareData = {
        title: 'Bugora',
        text: 'Master Bug Bounty Hunting with interactive security challenges!',
        url: 'https://bugora.app',
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            return { success: true };
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareData.url);
            return { success: true, copied: true };
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.warn('Share failed:', e);
        }
        return { success: false };
    }
}
