/**
 * Interview Quota Management
 * 
 * Tracks daily usage of the AI Interview Coach to prevent API abuse.
 * Free users: 5 messages per day
 * Premium users: Unlimited (TODO: implement premium check)
 */

const QUOTA_KEY = 'bountyprep_interview_quota';
const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 50;

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

export function getRemainingQuota(isPremium = false) {
    const data = getQuotaData();
    const today = getTodayKey();
    const limit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if (!data || data.date !== today) {
        // New day or no data - reset quota
        return limit;
    }

    return Math.max(0, limit - (data.used || 0));
}

export function useQuota(isPremium = false) {
    const today = getTodayKey();
    const data = getQuotaData();
    const limit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if (!data || data.date !== today) {
        // New day - start fresh
        setQuotaData({ date: today, used: 1 });
        return { success: true, remaining: limit - 1 };
    }

    if (data.used >= limit) {
        return { success: false, remaining: 0 };
    }

    const newUsed = (data.used || 0) + 1;
    setQuotaData({ date: today, used: newUsed });

    return {
        success: true,
        remaining: limit - newUsed
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
