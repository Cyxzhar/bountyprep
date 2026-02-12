import React from 'react';
import { CheckCircle, Terminal as TerminalIcon, ArrowRight, Zap } from 'lucide-react';

const VictoryModal = ({ attackIndex, currentAttack, nextAttack, resetSimulation }) => {
    return (
        <div className="simulation-modal-overlay">
            <div className="victory-modal animate-pop-in">
                <div className="victory-glow"></div>
                <div className="victory-icon-wrapper">
                    <div className="victory-ring"></div>
                    <CheckCircle size={36} className="victory-icon" />
                </div>

                <h3 className="victory-title">
                    {attackIndex === 0 ? "Vulnerability Found" : "System Compromised"}
                </h3>

                {/* Attack Result Terminal UI */}
                <div className="modal-result-terminal">
                    <div className="mt-header">
                        <TerminalIcon size={12} />
                        <span>Execution Result - payload.py</span>
                    </div>
                    <div className="mt-body">
                        <div className="mt-line success">
                            {currentAttack.summary}
                        </div>
                        <div className="mt-line cursor">_</div>
                    </div>
                </div>

                <div className="xp-gain">
                    <span className="plus">+</span>{attackIndex === 0 ? "50" : "150"} <span className="unit">XP</span>
                </div>

                <button
                    className="btn-victory-primary"
                    onClick={nextAttack}
                >
                    {attackIndex === 0 ? (
                        <>Next Phase <ArrowRight size={16} /></>
                    ) : (
                        <><Zap size={16} fill="currentColor" /> Access Real Lab</>
                    )}
                </button>
                <button className="btn-victory-text" onClick={resetSimulation}>
                    Reset Lab
                </button>
            </div>
        </div>
    );
};

export default VictoryModal;
