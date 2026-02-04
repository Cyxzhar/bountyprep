import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Terminal, Lightbulb, CheckCircle, XCircle, ChevronRight, Monitor, Globe, Activity, Layers, FileText } from 'lucide-react';
import { validateFlag } from '../../utils/challengeValidation';
import { useLabSimulation } from '../../hooks/useLabSimulation';
import RequestRepeater from './tools/RequestRepeater';
import VirtualBrowser from './tools/VirtualBrowser';
import GraphQLConsole from './tools/GraphQLConsole';
import './ChallengeComponents.css';
import './tools/Tools.css';

export default function LabChallenge({ challenge, onComplete }) {
    const navigate = useNavigate();
    const [flagInput, setFlagInput] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);

    // Tools State
    const [activeTool, setActiveTool] = useState(challenge.labEnvironment?.tools?.[0] || 'Browser');

    // Mobile View State ('guide' or 'tools')
    const [mobileView, setMobileView] = useState('guide');

    // Import Simulation Logic
    const { handleBrowserNavigate, handleRepeaterSend, handleGraphQLQuery } = useLabSimulation(challenge);

    const handleSubmitFlag = () => {
        const result = validateFlag(
            flagInput,
            challenge.flag.value,
            challenge.flag.format
        );

        setValidationResult(result);

        if (result.success) {
            const hintPenalty = hintsUsed * 0.15;
            const xpMultiplier = Math.max(1 - hintPenalty, 0.5);
            const xpEarned = Math.round(challenge.xpReward * xpMultiplier);

            onComplete({
                success: true,
                xpEarned,
                hintsUsed,
                flagCaptured: result.flagValue
            });
        }
    };

    return (
        <div className="lab-challenge-container">
            {/* Header - Always Visible */}
            <div className="lab-header-section">
                <div className="section-title">
                    <Terminal size={18} className="text-primary" />
                    <h3>{challenge.title}</h3>
                </div>
                <div className="step-tracker">
                    <span className="step-text">Step {currentStep + 1}/{challenge.steps.length}</span>
                </div>
            </div>

            {/* Mobile Tab Switcher (Visible only on small screens) */}
            <div className="mobile-view-tabs">
                <button
                    className={`mobile-tab ${mobileView === 'guide' ? 'active' : ''}`}
                    onClick={() => setMobileView('guide')}
                >
                    <FileText size={16} /> Guide
                </button>
                <button
                    className={`mobile-tab ${mobileView === 'tools' ? 'active' : ''}`}
                    onClick={() => setMobileView('tools')}
                >
                    <Layers size={16} /> Workstation
                </button>
            </div>

            <div className="lab-workspace">
                {/* GUIDE PANEL (Left on desktop, Tab 1 on mobile) */}
                <div className={`lab-guide-panel ${mobileView === 'guide' ? 'active-mobile' : 'hidden-mobile'}`}>
                    <div className="guide-card objective-card">
                        <div className="card-header-sm">OBJECTIVE</div>
                        <p>{challenge.objective}</p>
                    </div>

                    <div className="current-step-card">
                        <div className="card-header">
                            <Activity size={16} className="pulse-icon" />
                            <span>Current Task</span>
                        </div>
                        <h5 className="step-title">{challenge.steps[currentStep].title}</h5>
                        <p className="step-desc">{challenge.steps[currentStep].description}</p>

                        {challenge.steps[currentStep].hints && (
                            <div className="micro-hints">
                                {challenge.steps[currentStep].hints.map((h, i) => (
                                    <div key={i} className="hint-pill"><Lightbulb size={12} /> {h}</div>
                                ))}
                            </div>
                        )}

                        <div className="step-actions">
                            <button
                                className="btn-next"
                                disabled={currentStep === challenge.steps.length - 1}
                                onClick={() => setCurrentStep(prev => prev + 1)}
                            >
                                Next Step <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flag-card">
                        <div className="card-header-sm">CAPTURE FLAG</div>
                        <div className="flag-input-row">
                            <Flag size={16} />
                            <input
                                placeholder={challenge.flag.format}
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                            />
                            <button className="btn-submit" onClick={handleSubmitFlag}>Submit</button>
                        </div>
                        {validationResult && (
                            <div className={`validation-msg ${validationResult.success ? 'success' : 'error'}`}>
                                {validationResult.feedback}
                            </div>
                        )}
                    </div>
                </div>

                {/* TOOLS PANEL (Right on desktop, Tab 2 on mobile) */}
                <div className={`lab-tools-panel ${mobileView === 'tools' ? 'active-mobile' : 'hidden-mobile'}`}>
                    <div className="tools-tabs">
                        {challenge.labEnvironment.tools.map(tool => (
                            <button
                                key={tool}
                                className={`tool-tab ${activeTool === tool ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool)}
                            >
                                {tool === 'Browser' && <Globe size={14} />}
                                {tool === 'Repeater' && <Monitor size={14} />}
                                {tool === 'GraphQL Console' && <Activity size={14} />}
                                {tool}
                            </button>
                        ))}
                    </div>

                    <div className="active-tool-container">
                        {activeTool === 'Browser' && (
                            <VirtualBrowser
                                initialUrl={challenge.labEnvironment.mockData?.target}
                                onNavigate={handleBrowserNavigate}
                            />
                        )}
                        {activeTool === 'Repeater' && (
                            <RequestRepeater
                                initialUrl={challenge.labEnvironment.mockData?.target}
                                onSend={handleRepeaterSend}
                            />
                        )}
                        {activeTool === 'GraphQL Console' && (
                            <GraphQLConsole
                                endpoint={challenge.labEnvironment.mockData?.endpoint}
                                onQuery={handleGraphQLQuery}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .lab-challenge-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    gap: 1rem;
                    position: relative;
                }
                
                .lab-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .step-text {
                    font-size: 0.9rem;
                    font-weight: 600;
                    background: var(--bg-tertiary);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }

                /* --- Mobile Tabs --- */
                .mobile-view-tabs {
                    display: none; /* Hidden on Desktop */
                    background: var(--bg-card);
                    border-radius: 8px;
                    padding: 4px;
                    margin-bottom: 8px;
                    border: 1px solid var(--border-color);
                }
                
                .mobile-tab {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-weight: 600;
                    color: var(--text-secondary);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .mobile-tab.active {
                    background: var(--primary-color);
                    color: white;
                    shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* --- Workspace --- */
                .lab-workspace {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 1.5rem;
                    height: 600px; /* Fixed height for tools scrolling */
                }
                
                .lab-guide-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                }

                .card-header-sm {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }

                .guide-card, .current-step-card, .flag-card {
                    background: var(--bg-card);
                    padding: 1.25rem;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .current-step-card {
                    border-left: 4px solid var(--primary-color);
                    background: linear-gradient(to right, var(--bg-card) 95%, var(--primary-color-alpha-10));
                }

                .step-title {
                    font-size: 1.1rem;
                    margin: 0.5rem 0;
                    color: var(--text-primary);
                }
                
                .step-desc {
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .lab-tools-panel {
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                /* --- Mobile Responsive Rules --- */
                @media (max-width: 900px) {
                    .lab-workspace {
                        display: block; /* Remove grid */
                        height: auto; /* Allow auto height */
                    }

                    .mobile-view-tabs {
                        display: flex; /* Show tabs */
                    }

                    /* Conditional Visibility based on Tabs */
                    .hidden-mobile {
                        display: none !important;
                    }
                    
                    .active-mobile {
                        display: flex;
                        animation: fadeIn 0.3s ease;
                    }

                    .lab-tools-panel {
                        height: calc(100vh - 200px); /* Fill remaining screen */
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
