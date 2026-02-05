
import React from 'react';
import { RefreshCw, XCircle } from 'lucide-react';
import './ChallengeFailureModal.css';

export default function ChallengeFailureModal({ onRetry, onExit, reason = 'Time out' }) {
    return (
        <div className="failure-modal-overlay">
            <div className="failure-modal">
                <div className="failure-icon">
                    <XCircle size={48} />
                </div>
                <h3>Challenge Failed</h3>
                <p>{reason === 'timeout' ? "Time's up! You ran out of time to complete the challenge." : "You've exhausted your attempts."}</p>

                <div className="failure-actions">
                    <button className="btn-retry" onClick={onRetry}>
                        <RefreshCw size={16} /> Try Again
                    </button>
                    <button className="btn-exit" onClick={onExit}>
                        Exit Challenge
                    </button>
                </div>
            </div>
        </div>
    );
}
