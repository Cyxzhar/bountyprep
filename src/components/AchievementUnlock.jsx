import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Share2, Award } from 'lucide-react';
import './AchievementUnlock.css';

export default function AchievementUnlock({ achievement, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            triggerConfetti();
        }
    }, [achievement]);

    const triggerConfetti = () => {
        // Center burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#9FEF00', '#B8FF33', '#FFFFFF']
        });

        // Side cannons after delay
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#9FEF00', '#00D9FF']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#9FEF00', '#00D9FF']
            });
        }, 400);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    if (!achievement) return null;

    return (
        <div className={`achievement-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="achievement-modal">
                <button className="close-btn" onClick={handleClose}>
                    <X size={20} />
                </button>

                <div className="unlock-header">
                    <div className="unlock-icon-wrapper">
                        <span className="unlock-icon">{achievement.icon}</span>
                    </div>
                    <div className="unlock-badge">ACHIEVEMENT UNLOCKED</div>
                </div>

                <h2 className="unlock-title">{achievement.title}</h2>
                <p className="unlock-desc">{achievement.description}</p>

                <div className="unlock-reward">
                    <span className="xp-pill">+{achievement.xpReward} XP</span>
                </div>

                <button className="btn btn-primary share-btn" onClick={triggerConfetti}>
                    <Share2 size={18} />
                    Celebrate Again!
                </button>
            </div>
        </div>
    );
}
