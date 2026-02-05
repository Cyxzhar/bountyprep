
import React from 'react';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import './CompletionModal.css';

export default function CompletionModal({ xpEarned, onBack, onReplay }) {
    return (
        <div className="completion-modal-overlay">
            <div className="completion-modal">
                <div className="completion-icon">
                    <Trophy size={48} />
                </div>
                <h3>Challenge Complete!</h3>
                <p>You've mastered this concept and earned <span className="xp-highlight">+{xpEarned} XP</span>.</p>

                <div className="completion-actions">
                    <button className="btn-back" onClick={onBack}>
                        <ArrowLeft size={16} /> Back to Challenges
                    </button>
                    {onReplay && (
                        <button className="btn-replay" onClick={onReplay}>
                            <RotateCcw size={16} /> Replay
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
