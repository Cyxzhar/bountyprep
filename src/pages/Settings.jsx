import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Added useToast
import { useSound } from '../context/SoundContext';
import { refreshUserProfile } from '../utils/firestore';
import { updateProfile, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
    Camera, User, Mail, Bell, Shield, Lock, LogOut,
    ChevronRight, Moon, Sun, Loader2, Check, ChevronLeft,
    Volume2, VolumeX
} from 'lucide-react';
import './Settings.css';

// ...

export default function Settings() {
    const navigate = useNavigate();
    const { currentUser, logout, setCurrentUser } = useAuth(); // Assuming 'auth' is accessible via currentUser or import
    const { success, error: showError } = useToast(); // Using Toast context
    const { isMuted, toggleMute } = useSound();

    const [displayName, setDisplayName] = useState('');
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
        }
    }, [currentUser]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('File too large (max 2MB)');
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                const storageRef = ref(getStorage(), `avatars/${currentUser.uid}`);
                await uploadString(storageRef, base64String, 'data_url');
                const photoURL = await getDownloadURL(storageRef);
                await updateProfile(currentUser, { photoURL });
                await updateDoc(doc(db, 'users', currentUser.uid), { photoURL });
                const updatedUser = await refreshUserProfile(currentUser.uid);
                setCurrentUser(prev => ({ ...prev, ...updatedUser, photoURL }));
            } catch (err) {
                console.error('Upload failed:', err);
                showError('Failed to upload photo');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!displayName.trim() || displayName === currentUser.displayName) return;
        setSaving(true);
        try {
            await updateProfile(currentUser, { displayName });
            await updateDoc(doc(db, 'users', currentUser.uid), { displayName });
            const updatedUser = await refreshUserProfile(currentUser.uid);
            setCurrentUser(prev => ({ ...prev, ...updatedUser }));
            success('Profile updated');
        } catch (err) {
            console.error('Save failed:', err);
            showError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!currentUser?.email) return;
        try {
            await sendPasswordResetEmail(currentUser.auth, currentUser.email);
            success(`Password reset email sent to ${currentUser.email}`);
        } catch (err) {
            console.error('Password reset failed:', err);
            showError('Failed to send reset email.');
        }
    };



    // Toggle modal instead of confirm
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setSaving(true);
        try {
            // 1. Delete Firestore Data
            await deleteDoc(doc(db, 'users', currentUser.uid));
            // 2. Delete Auth User (Must use the real auth instance, not the context copy)
            const user = auth.currentUser;
            if (user) {
                await deleteUser(user);
            }
            // 3. Complete Cleanup
            success('Account deleted successfully.');

            // Clear local cache/storage to ensure fresh start
            localStorage.clear();
            sessionStorage.clear();

            // Hard reload to clear memory state
            setTimeout(() => {
                window.location.replace('/');
            }, 1000);

        } catch (err) {
            console.error('Delete failed:', err);
            if (err.code === 'auth/requires-recent-login') {
                showError('Security check: Please log out and log in again to delete account.');
            } else {
                showError('Failed to delete account. Please try again.');
            }
        } finally {
            setSaving(false);
            setShowDeleteModal(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="page-container settings-page">
            <header className="page-header-nav">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1>Settings</h1>
            </header>

            <div className="settings-grid">
                {/* ... (existing sections) ... */}
                {/* Profile Section */}
                <section className="settings-card">
                    <h2>Profile</h2>

                    <div className="profile-edit-header">
                        <div className="avatar-upload-wrapper">
                            <div className="avatar-preview">
                                {currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" />
                                ) : (
                                    <User size={32} />
                                )}
                                {uploading && (
                                    <div className="upload-overlay">
                                        <Loader2 className="spin" size={24} />
                                    </div>
                                )}
                            </div>
                            <label className="change-photo-btn">
                                <Camera size={16} />
                                <span>Change Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Display Name</label>
                        <div className="input-row">
                            <input
                                type="text"
                                className="input"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleSaveProfile}
                                disabled={saving || displayName === currentUser?.displayName}
                            >
                                {saving ? <Loader2 className="spin" size={16} /> : 'Save'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-group disabled">
                            <Mail size={16} className="input-icon" />
                            <input type="email" className="input" value={currentUser?.email} disabled />
                            <span className="verified-badge">
                                <Check size={12} /> Verified
                            </span>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="settings-card">
                    <h2>Preferences</h2>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <div>
                                <h3>Appearance</h3>
                                <p>Switch between dark and light mode</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={() => {
                                    const newTheme = theme === 'dark' ? 'light' : 'dark';
                                    setTheme(newTheme);
                                    success(`Theme set to ${newTheme} mode`);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3>Notifications</h3>
                                <p>Receive updates about new challenges</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={() => {
                                    setNotifications(!notifications);
                                    success(!notifications ? 'Notifications enabled' : 'Notifications disabled');
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon">
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </div>
                            <div>
                                <h3>Sound Effects</h3>
                                <p>Enable background music and effects</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={!isMuted}
                                onChange={toggleMute}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>

                {/* Account Actions */}
                <section className="settings-card danger-zone">
                    <h2>Account</h2>

                    <div className="action-list">
                        <button className="action-btn" onClick={handlePasswordReset}>
                            <Lock size={18} />
                            <span>Change Password</span>
                            <ChevronRight size={16} className="action-arrow" />
                        </button>

                        <button className="action-btn text-error" onClick={handleDeleteClick}>
                            <Shield size={18} />
                            <span>Delete Account</span>
                            <ChevronRight size={16} className="action-arrow" />
                        </button>

                        <button className="btn btn-secondary btn-full logout-btn" onClick={handleLogout}>
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </section>
            </div >

            {/* Custom Delete Modal */}
            {
                showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <Shield size={48} className="text-error" style={{ marginBottom: '16px' }} />
                            <h3>Delete Account?</h3>
                            <p>
                                This action is permanent and cannot be undone. All your progress, XP, and badges will be lost forever.
                            </p>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn-delete" onClick={confirmDelete} disabled={saving}>
                                    {saving ? 'Deleting...' : 'Delete Forever'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
