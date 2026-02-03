/**
 * Interview Quota Management
 * 
 * Tracks daily usage of the AI Interview Coach to prevent API abuse.
 * Free users: 5 messages per day
 * Premium users: Unlimited (TODO: implement premium check)
 */

const QUOTA_KEY = 'bountyprep_interview_quota';
const FREE_DAILY_LIMIT = 5;

function getQuotaData() {
    try {
        const data = localStorage.getItem(QUOTA_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch {
        return null;
    }
}

function setQuotaData(data) {
    localStorage.setItem(QUOTA_KEY, JSON.stringify(data));
}

function getTodayKey() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export function getRemainingQuota() {
    const data = getQuotaData();
    const today = getTodayKey();

    if (!data || data.date !== today) {
        // New day or no data - reset quota
        return FREE_DAILY_LIMIT;
    }

    return Math.max(0, FREE_DAILY_LIMIT - (data.used || 0));
}

export function useQuota() {
    const today = getTodayKey();
    const data = getQuotaData();

    if (!data || data.date !== today) {
        // New day - start fresh
        setQuotaData({ date: today, used: 1 });
        return { success: true, remaining: FREE_DAILY_LIMIT - 1 };
    }

    if (data.used >= FREE_DAILY_LIMIT) {
        return { success: false, remaining: 0 };
    }

    const newUsed = (data.used || 0) + 1;
    setQuotaData({ date: today, used: newUsed });

    return {
        success: true,
        remaining: FREE_DAILY_LIMIT - newUsed
    };
}

export function getQuotaResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diffMs = tomorrow - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}
