import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bug, Mail, Lock, Eye, EyeOff, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage, isValidEmail } from '../../utils/validation';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Live Validation State
    const [emailStatus, setEmailStatus] = useState(null);

    useEffect(() => {
        if (currentUser) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'email') {
            if (value) {
                const valid = isValidEmail(value);
                setEmailStatus({ isValid: valid, msg: valid ? 'Valid Email' : 'Invalid Email Format' });
            } else {
                setEmailStatus(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            success('Welcome back!');
            navigate('/home');
        } catch (err) {
            console.error(err);
            const msg = getAuthErrorMessage(err.code);
            toastError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                success('Successfully logged in with Google!');
                navigate('/home');
            }
        } catch (err) {
            console.error(err);
            const msg = getAuthErrorMessage(err.code);
            toastError(msg);
        }
    };

    const handleAppleLogin = async () => {
        const msg = 'Apple Sign In is currently unavailable.';
        toastError(msg);
    };

    return (
        <div className="auth-screen">
            <div className="auth-bg-grid"></div>

            <div className="auth-content">
                <div className="auth-logo">
                    <div className="logo-wrapper">
                        <Shield size={40} strokeWidth={1.5} />
                        <Bug className="logo-bug" size={18} />
                    </div>
                    <span className="logo-text">Bounty<span className="text-accent">Prep</span></span>
                </div>

                <h1 className="auth-title">Welcome Back!</h1>
                <p className="auth-subtitle">Continue your security journey</p>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                className="input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {emailStatus && (
                            <div className={`validation-message ${emailStatus.isValid ? 'text-success' : 'text-error'}`}>
                                {emailStatus.isValid ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                {emailStatus.msg}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <div className="flex justify-between items-center">
                            <label className="input-label">Password</label>
                            <button type="button" className="btn-link" style={{ fontSize: '0.8125rem' }}>
                                Forgot Password?
                            </button>
                        </div>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="input-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        Log In
                        <ChevronRight size={20} />
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-buttons">
                    <button className="btn-social" onClick={handleGoogleLogin}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button className="btn-social btn-social-dark" onClick={handleAppleLogin}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Apple
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <button onClick={() => navigate('/auth/signup')}>Sign Up</button>
                    <br /><span style={{ fontSize: '0.7rem', opacity: 0.5 }}>v1.1.1 (Clean UI)</span>
                </p>
            </div>
        </div>
    );
}
