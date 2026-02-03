import { useState } from 'react';
import { X, User, Mail, Camera, Loader2 } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useToast } from '../context/ToastContext';
import { compressImage, getBase64SizeKB } from '../utils/imageCompression';
import './AccountSettingsModal.css';

export default function AccountSettingsModal({ isOpen, onClose, currentUser, onUpdate }) {
    const { success, error, info } = useToast();
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(currentUser?.photoURL || null);

    if (!isOpen) return null;

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            error('Please select an image file');
            return;
        }

        setIsUploading(true);
        info('Compressing image...');

        try {
            // Compress image to base64 (max 500KB for Firestore)
            const compressedBase64 = await compressImage(file, 500, 400);
            const sizeKB = getBase64SizeKB(compressedBase64);

            console.log(`Image compressed to ${sizeKB}KB`);

            // Update preview immediately
            setPhotoPreview(compressedBase64);

            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, { photoURL: compressedBase64 });

            // Update Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                photoURL: compressedBase64,
                updatedAt: serverTimestamp()
            });

            success('Profile photo updated!');
            onUpdate?.();
        } catch (err) {
            console.error('Upload failed:', err);
            error('Failed to upload photo. Try a smaller image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            error('Display name cannot be empty');
            return;
        }

        setIsLoading(true);

        try {
            // Update Firebase Auth
            await updateProfile(auth.currentUser, { displayName: displayName.trim() });

            // Update Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                displayName: displayName.trim(),
                updatedAt: serverTimestamp()
            });

            success('Profile updated!');
            onUpdate?.();
            onClose();
        } catch (err) {
            console.error('Update failed:', err);
            error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="settings-modal-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <h2>Account Settings</h2>
                    <p>Update your profile information</p>
                </div>

                {/* Profile Photo */}
                <div className="photo-section">
                    <div className="photo-preview">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" />
                        ) : (
                            <User size={40} />
                        )}
                        {isUploading && (
                            <div className="photo-loading">
                                <Loader2 size={24} className="spin" />
                            </div>
                        )}
                    </div>
                    <label className="photo-upload-btn">
                        <Camera size={16} />
                        {isUploading ? 'Uploading...' : 'Change Photo'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                            hidden
                        />
                    </label>
                    <span className="photo-hint">Image will be compressed to ~500KB</span>
                </div>

                {/* Display Name */}
                <div className="form-group">
                    <label>Display Name</label>
                    <div className="input-wrapper">
                        <User size={18} />
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name"
                            maxLength={30}
                        />
                    </div>
                </div>

                {/* Email (read-only) */}
                <div className="form-group">
                    <label>Email</label>
                    <div className="input-wrapper disabled">
                        <Mail size={18} />
                        <input
                            type="email"
                            value={currentUser?.email || ''}
                            disabled
                        />
                    </div>
                    <span className="form-hint">Email cannot be changed</span>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={18} className="spin" /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
