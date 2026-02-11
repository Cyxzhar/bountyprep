/**
 * Maps Firebase auth error codes to user-friendly messages
 * @param {string} errorCode - The error code from Firebase (e.g., 'auth/user-not-found')
 * @returns {string} A friendly error message
 */
export const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try logging in instead.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return null; // Don't show error for user cancellation
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked. Please allow popups for this site.';
        default:
            return `An unexpected error occurred (${errorCode}). Please try again.`;
    }
};

/**
 * Validates email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validates password strength
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
/**
 * Checks password strength
 * @param {string} password 
 * @returns {object} { score: 0-4, label: string, color: string }
 */
export const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'text-muted' };

    let score = 0;
    if (password.length > 5) score++; // Min length
    if (password.length > 8) score++; // Good length
    if (/[A-Z]/.test(password)) score++; // Uppercase
    if (/[0-9]/.test(password)) score++; // Number
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special char

    if (score < 2) return { score, label: 'Weak', color: 'text-error' };
    if (score < 4) return { score, label: 'Medium', color: 'text-warning' };
    return { score, label: 'Strong', color: 'text-success' };
};

export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }
    return { isValid: true, message: '' };
};

/**
 * Hashes a string using SHA-256
 * @param {string} string 
 * @returns {Promise<string>}
 */
export const hashPassword = async (string) => {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
