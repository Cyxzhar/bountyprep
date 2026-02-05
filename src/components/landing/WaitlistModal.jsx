import React, { useState } from 'react';
import { X, Zap, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const WaitlistModal = ({ isOpen, onClose, setIsJoined }) => {
    const { currentUser } = useAuth();
    const { success, error: toastError } = useToast();
    const [waitlistEmail, setWaitlistEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!waitlistEmail) return;

        setIsSubmitting(true);
        try {
            // Lazy load firestore util
            const { addToWaitlist } = await import('../../utils/firestore');
            const result = await addToWaitlist(currentUser?.uid, waitlistEmail, 'landing_page_modal');

            if (result.success) {
                setIsJoined(true);
                success("You're on the list! Watch your inbox.");
                setTimeout(onClose, 2000);
            } else {
                toastError("Something went wrong. Try again.");
            }
        } catch (err) {
            console.error(err);
            toastError("Connection failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glassmorphic" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <div className="modal-icon-wrapper">
                        <Zap size={32} className="text-neon" />
                    </div>
                    <h3>Join the Elite Waitlist</h3>
                    <p>We are currently in private beta. Spots are opening up at $1/month for the next 500 hackers.</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="input-group-landing">
                        <Mail size={20} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Enter your hacker email"
                            value={waitlistEmail}
                            onChange={(e) => setWaitlistEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary full-width"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Securing Spot..." : "Secure My Spot"}
                    </button>
                    <p className="form-note">No spam. Only critical updates.</p>
                </form>
            </div>
        </div>
    );
};

export default WaitlistModal;
