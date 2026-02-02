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
            return 'Sign-in cancelled.';
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
export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    return { isValid: true, message: '' };
};
