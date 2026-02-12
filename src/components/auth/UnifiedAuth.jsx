import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  getAuthErrorMessage,
  isValidEmail,
  checkPasswordStrength
} from '../../utils/validation';
import AuthIllustration from './AuthIllustration';
import './UnifiedAuth.css';

/**
 * Unified Authentication Component - Split Screen Design
 * Left: Custom SVG illustration with branding
 * Right: Auth form that toggles between login/signup
 */
export default function UnifiedAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();
  const { currentUser } = useAuth();

  // Determine initial mode from route
  const [mode, setMode] = useState(
    location.pathname.includes('signup') ? 'signup' : 'login'
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live validation states
  const [emailStatus, setEmailStatus] = useState(null);
  const [passStrength, setPassStrength] = useState({ score: 0, label: '', color: '' });
  const [matchStatus, setMatchStatus] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  // Handle mode toggle
  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    // Keep email, reset passwords
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    setPassStrength({ score: 0, label: '', color: '' });
    setMatchStatus(null);
  };

  // Form input handler with live validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Email validation
    if (name === 'email') {
      if (value) {
        const valid = isValidEmail(value);
        setEmailStatus({
          isValid: valid,
          msg: valid ? 'Valid email' : 'Invalid email format'
        });
      } else {
        setEmailStatus(null);
      }
    }

    // Password strength (signup only)
    if (name === 'password' && mode === 'signup') {
      setPassStrength(checkPasswordStrength(value));
      if (formData.confirmPassword) {
        setMatchStatus({ isMatch: value === formData.confirmPassword });
      }
    }

    // Confirm password match
    if (name === 'confirmPassword') {
      if (value) {
        setMatchStatus({ isMatch: value === formData.password });
      } else {
        setMatchStatus(null);
      }
    }
  };

  // Login handler
  const handleLogin = async (e) => {
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

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!isValidEmail(formData.email)) {
      toastError('Please enter a valid email address');
      return;
    }

    if (passStrength.score < 2 && formData.password.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const username = formData.email.split('@')[0];
      await updateProfile(userCredential.user, { displayName: username });
      success('Account created successfully!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      let msg = getAuthErrorMessage(err.code);
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      }
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth handler
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const additionalInfo = getAdditionalUserInfo(result);

      if (result.user) {
        if (additionalInfo?.isNewUser) {
          success('Account created successfully with Google!');
        } else {
          success('Welcome back!');
        }
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      const msg = getAuthErrorMessage(err.code);
      if (msg) toastError(msg);
    }
  };

  // Apple handler (placeholder)
  const handleAppleAuth = () => {
    toastError('Apple Sign In is currently unavailable.');
  };

  return (
    <div className="split-auth-container">
      {/* Left Panel - Illustration */}
      <div className="split-auth-left">
        <AuthIllustration />
      </div>

      {/* Right Panel - Form */}
      <div className="split-auth-right">
        {/* Back Button - Icon Only */}
        <button
          type="button"
          className="split-auth-back-btn"
          onClick={() => navigate('/')}
          aria-label="Back to home"
          title="Back to home"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="split-auth-form-wrapper">
          {/* Header */}
          <div className="split-auth-header">
            <h1 className="split-auth-title">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="split-auth-subtitle">
              {mode === 'login'
                ? 'Continue your security journey'
                : 'Start learning cybersecurity today'}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={mode === 'login' ? handleLogin : handleSignup}
            className="split-auth-form"
            noValidate
          >
            {/* Email Input */}
            <div className="split-input-group">
              <label htmlFor="email" className="split-input-label">
                Email address
              </label>
              <div className="split-input-wrapper">
                <Mail size={20} className="split-input-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="split-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={emailStatus && !emailStatus.isValid}
                  aria-describedby={emailStatus ? 'email-validation' : undefined}
                />
              </div>
              {emailStatus && (
                <div
                  id="email-validation"
                  className={`split-validation ${emailStatus.isValid ? 'success' : 'error'}`}
                  role="alert"
                  aria-live="polite"
                >
                  {emailStatus.isValid ? (
                    <CheckCircle size={14} aria-hidden="true" />
                  ) : (
                    <XCircle size={14} aria-hidden="true" />
                  )}
                  {emailStatus.msg}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="split-input-group">
              <div className="split-input-label-row">
                <label htmlFor="password" className="split-input-label">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="split-forgot-link"
                    onClick={() => navigate('/auth/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="split-input-wrapper">
                <Lock size={20} className="split-input-icon" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="split-input"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="split-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength (Signup only) */}
              {mode === 'signup' && formData.password && (
                <div className="split-strength-wrapper">
                  <div className="split-strength-bar">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`split-strength-segment ${passStrength.score >= level ? 'active' : ''
                          } ${passStrength.label.toLowerCase()}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`split-strength-label ${passStrength.color}`}
                    aria-live="polite"
                  >
                    {passStrength.label} password
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {mode === 'signup' && (
              <div className="split-input-group">
                <label htmlFor="confirmPassword" className="split-input-label">
                  Confirm password
                </label>
                <div className="split-input-wrapper">
                  <Lock size={20} className="split-input-icon" aria-hidden="true" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="split-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={matchStatus && !matchStatus.isMatch}
                  />
                </div>
                {matchStatus && (
                  <div
                    className={`split-validation ${matchStatus.isMatch ? 'success' : 'error'}`}
                    role="alert"
                    aria-live="polite"
                  >
                    {matchStatus.isMatch ? (
                      <CheckCircle size={14} aria-hidden="true" />
                    ) : (
                      <XCircle size={14} aria-hidden="true" />
                    )}
                    {matchStatus.isMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="split-btn-primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <Loader2 size={20} className="spin" aria-hidden="true" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={20} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="split-divider">
            <span>or continue with</span>
          </div>

          {/* Social Auth */}
          <div className="split-social-buttons">
            <button
              type="button"
              className="split-btn-social google"
              onClick={handleGoogleAuth}
              aria-label="Continue with Google"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="split-btn-social apple"
              onClick={handleAppleAuth}
              aria-label="Continue with Apple"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="split-footer">
            <span>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button type="button" onClick={toggleMode} className="split-toggle-btn">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
