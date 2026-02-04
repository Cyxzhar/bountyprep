import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Terminal, Lightbulb, BookOpen, CheckCircle, XCircle, ChevronRight, Monitor, Globe, Activity } from 'lucide-react';
import { validateFlag } from '../../utils/challengeValidation';
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
    const [activeTool, setActiveTool] = useState(challenge.labEnvironment?.tools?.[0] || 'Browser');

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

    // --- Mock Handlers for Virtual Tools ---

    const handleBrowserNavigate = (url) => {
        // Mock logic for browser navigation
        // In a real app, this would fetch from a container or check paths
        console.log("Navigating to:", url);

        // Example logic for "Cloud SSRF" challenge
        if (url.includes('169.254.169.254') && challenge.id === 'lab-cloud-ssrf') {
            // Browser usually blocks this, but let's simulate a basic response or block
            return { render: () => <div style={{ color: 'red' }}>Error: Connection to private IP blocked by browser. Try using the Repeater to bypass client-side checks?</div> };
        }

        return { render: () => <div><h1>Welcome to {url}</h1><p>Nothing interesting here yet.</p></div> };
    };

    const handleRepeaterSend = (req) => {
        // Mock logic for Repeater
        console.log("Repeater Request:", req);

        // 1. Logic for Cloud SSRF Lab
        if (challenge.id === 'lab-cloud-ssrf') {
            const targetUrl = req.url || '';
            // Check if they are hitting the vuln endpoint
            if (targetUrl.includes('vulnerable-site.com/fetch')) {
                const params = new URLSearchParams(targetUrl.split('?')[1]);
                const payload = params.get('url');

                if (payload && payload.includes('169.254.169.254')) {
                    // Success!
                    return {
                        status: 200,
                        time: '45ms',
                        data: challenge.labEnvironment.mockData.response_metadata
                    };
                }
                return { status: 200, time: '30ms', data: "Fetched: " + payload };
            }
        }

        return { status: 404, time: '20ms', data: { error: "Route not found in mock environment." } };
    };

    const handleGraphQLQuery = (query, variables) => {
        console.log("GraphQL Query:", query);

        // 2. Logic for GraphQL Lab
        if (challenge.id === 'lab-graphql-intro') {
            // Check if it's an introspection query
            if (query.includes('__schema') && query.includes('types')) {
                return { status: 200, data: challenge.labEnvironment.mockData.response_schema };
            }
            return { status: 200, data: { data: { message: "Query executed, but returned no interesting data." } } };
        }

        return { status: 400, data: { errors: [{ message: "Syntax Error" }] } };
    };

    return (
        <div className="lab-challenge-container">
            {/* Top Bar: Objectives & Guide */}
            <div className="lab-header-section">
                <div className="section-title">
                    <Terminal size={18} className="text-primary" />
                    <h3>{challenge.title}</h3>
                </div>
                <div className="step-tracker">
                    Step {currentStep + 1} of {challenge.steps.length}
                </div>
            </div>

            {/* Split View: Left (Guide) | Right (Tools) */}
            <div className="lab-workspace">
                {/* Left Panel: Guide & Scenario */}
                <div className="lab-guide-panel">
                    <div className="guide-card">
                        <h4>Objective</h4>
                        <p>{challenge.objective}</p>
                    </div>

                    <div className="current-step-card">
                        <div className="card-header">
                            <Activity size={16} />
                            <span>Current Task</span>
                        </div>
                        <h5>{challenge.steps[currentStep].title}</h5>
                        <p>{challenge.steps[currentStep].description}</p>

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

                    {/* Flag Input (Always Visible) */}
                    <div className="flag-card">
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

                {/* Right Panel: Virtual Tools */}
                <div className="lab-tools-panel">
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
                }
                .lab-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .lab-workspace {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 1.5rem;
                    height: 600px;
                }
                .lab-guide-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    overflow-y: auto;
                }
                .guide-card, .current-step-card, .flag-card {
                    background: var(--bg-card);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-color);
                }
                .current-step-card {
                    border-left: 3px solid var(--primary-color);
                }
                .lab-tools-panel {
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                .tools-tabs {
                    display: flex;
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                }
                .tool-tab {
                    padding: 0.75rem 1rem;
                    background: transparent;
                    border: none;
                    border-right: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .tool-tab.active {
                    background: var(--bg-card);
                    color: var(--primary-color);
                    border-bottom: 2px solid var(--primary-color);
                }
                .active-tool-container {
                    flex: 1;
                    padding: 1rem;
                    background: #f8fafc;
                }
                .dark-mode .active-tool-container {
                    background: #0f172a;
                }
                .flag-input-row {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                .flag-input-row input {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    font-family: monospace;
                }

                @media (max-width: 900px) {
                    .lab-workspace {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    .lab-tools-panel {
                        height: 500px;
                    }
                }
            `}</style>
        </div>
    );
}

