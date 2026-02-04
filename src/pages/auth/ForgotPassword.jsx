import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            await sendPasswordResetEmail(auth, email);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            switch (err.code) {
                case 'auth/user-not-found':
                    setErrorMessage('No account found with this email address.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Please enter a valid email address.');
                    break;
                case 'auth/too-many-requests':
                    setErrorMessage('Too many attempts. Please try again later.');
                    break;
                default:
                    setErrorMessage('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="auth-page forgot-password-page">
            <div className="auth-container">
                <Link to="/auth/login" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Login</span>
                </Link>

                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <Mail size={32} />
                    </div>
                    <h1>Reset Password</h1>
                    <p>Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {status === 'success' ? (
                    <div className="success-state">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h2>Check your inbox</h2>
                        <p>We've sent a password reset link to <strong>{email}</strong></p>
                        <p className="hint-text">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <button
                            className="btn btn-secondary btn-full"
                            onClick={() => setStatus('idle')}
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">Email Address</label>
                            <div className="input-with-icon">
                                <Mail className="input-icon" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    className="input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="error-box">
                                <AlertCircle size={18} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={status === 'loading' || !email.trim()}
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="spin" size={20} />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>Remember your password? <Link to="/auth/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
