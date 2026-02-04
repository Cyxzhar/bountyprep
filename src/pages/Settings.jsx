import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { refreshUserProfile } from '../utils/firestore';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
    Camera, User, Mail, Bell, Shield, Lock, LogOut,
    ChevronRight, Moon, Sun, Loader2, Check
} from 'lucide-react';
import './Settings.css';

const storage = getStorage();

export default function Settings() {
    const navigate = useNavigate();
    const { currentUser, logout, setCurrentUser } = useAuth();

    // Local state for edits
    const [displayName, setDisplayName] = useState('');
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            // Load other prefs if available in profile
        }
    }, [currentUser]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simple validation
        if (file.size > 2 * 1024 * 1024) {
            alert('File too large (max 2MB)');
            return;
        }

        setUploading(true);
        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                // Compress image roughly by using canvas (skipped for brevity, uploading raw first)
                const base64String = reader.result;

                // Upload to Firebase Storage
                const storageRef = ref(storage, `avatars/${currentUser.uid}`);
                await uploadString(storageRef, base64String, 'data_url');
                const photoURL = await getDownloadURL(storageRef);

                // Update Auth Profile
                await updateProfile(currentUser, { photoURL });

                // Update Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, { photoURL });

                // Update Local State
                const updatedUser = await refreshUserProfile(currentUser.uid);
                setCurrentUser(prev => ({ ...prev, ...updatedUser, photoURL }));
            } catch (err) {
                console.error('Upload failed:', err);
                alert('Failed to upload photo');
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
            // Update Auth
            await updateProfile(currentUser, { displayName });

            // Update Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { displayName });

            // Update Local State
            const updatedUser = await refreshUserProfile(currentUser.uid);
            setCurrentUser(prev => ({ ...prev, ...updatedUser }));
        } catch (err) {
            console.error('Save failed:', err);
        } finally {
            setSaving(false);
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
                                onChange={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
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
                                onChange={() => setNotifications(!notifications)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>

                {/* Account Actions */}
                <section className="settings-card danger-zone">
                    <h2>Account</h2>

                    <div className="action-list">
                        <button className="action-btn">
                            <Lock size={18} />
                            <span>Change Password</span>
                            <ChevronRight size={16} className="action-arrow" />
                        </button>

                        <button className="action-btn text-error">
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
            </div>
        </div>
    );
}
