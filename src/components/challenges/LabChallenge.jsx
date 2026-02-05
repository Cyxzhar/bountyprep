import React, { useState, useMemo, useEffect } from 'react';
import { Flag, Terminal, Lightbulb, ChevronRight, ChevronLeft, Monitor, Globe, Activity, Layers, FileText, Wrench, ExternalLink } from 'lucide-react';
import { validateFlag } from '../../utils/challengeValidation';
import { useLabSimulation } from '../../hooks/useLabSimulation.jsx';
import RequestRepeater from './tools/RequestRepeater';
import VirtualBrowser from './tools/VirtualBrowser';
import GraphQLConsole from './tools/GraphQLConsole';
import './ChallengeComponents.css';
import './tools/Tools.css';

// Normalize tool names from challenge data to known component keys
const TOOL_COMPONENT_MAP = {
    'Browser': 'Browser',
    'Browser DevTools': 'Browser',
    'Repeater': 'Repeater',
    'Postman/curl': 'Repeater',
    'Postman': 'Repeater',
    'GraphQL Console': 'GraphQL Console',
    'GraphQL': 'GraphQL Console',
};

const getToolComponentKey = (toolName) => TOOL_COMPONENT_MAP[toolName] || null;

const getToolIcon = (tool) => {
    const key = getToolComponentKey(tool);
    switch (key) {
        case 'Browser': return <Globe size={14} />;
        case 'Repeater': return <Monitor size={14} />;
        case 'GraphQL Console': return <Activity size={14} />;
        default: return <Wrench size={14} />;
    }
};

// Compute smart initial URL based on challenge data
const getInitialUrl = (challenge) => {
    const mockData = challenge.labEnvironment?.mockData;
    if (mockData?.target) return mockData.target;
    if (mockData?.endpoint && mockData.endpoint.startsWith('http')) return mockData.endpoint;

    const type = challenge.type || '';
    if (type.includes('IDOR') || type.includes('Access Control')) return 'http://api.target.com/api/users/1001/profile';
    if (type.includes('XSS')) return 'http://vulnerable-shop.com/search?q=';
    if (type.includes('SSRF')) return 'http://vulnerable-site.com';
    if (type.includes('SQL')) return 'http://shop.target.com/products?id=1';
    return 'http://target.app';
};

// Detect native app environment (Capacitor / PWA standalone)
const isNativeApp = () => {
    if (typeof window !== 'undefined') {
        if (window.Capacitor?.isNativePlatform?.()) return true;
        if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
    }
    return false;
};

export default function LabChallenge({ challenge, onComplete }) {
    const [flagInput, setFlagInput] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showNativeWarning, setShowNativeWarning] = useState(false);

    // Normalize tools list from challenge data
    const tools = useMemo(() => {
        return challenge.labEnvironment?.tools || ['Browser'];
    }, [challenge]);

    const [activeTool, setActiveTool] = useState(tools[0] || 'Browser');

    // Mobile view state ('guide' or 'tools')
    const [mobileView, setMobileView] = useState('guide');

    // Simulation logic
    const { handleBrowserNavigate, handleRepeaterSend, handleGraphQLQuery } = useLabSimulation(challenge);

    // Detect native app on mount
    useEffect(() => {
        setShowNativeWarning(isNativeApp());
    }, []);

    const handleSubmitFlag = () => {
        if (!flagInput.trim()) return;

        const result = validateFlag(
            flagInput,
            challenge.flag.value,
            challenge.flag.format
        );

        setValidationResult(result);

        if (result.success) {
            const xpEarned = Math.round(challenge.xpReward * 1);

            onComplete({
                success: true,
                xpEarned,
                hintsUsed: 0,
                flagCaptured: result.flagValue
            });
        }
    };

    const normalizedActiveTool = getToolComponentKey(activeTool);
    const initialUrl = getInitialUrl(challenge);

    // Render the active tool component
    const renderTool = () => {
        if (showNativeWarning) {
            return (
                <div className="native-app-warning">
                    <ExternalLink size={48} className="warning-icon" />
                    <h4>Open in Browser</h4>
                    <p>Lab tools require a full browser environment. Open this page in your device's web browser for the best experience.</p>
                    <button className="btn-open-browser" onClick={() => setShowNativeWarning(false)}>
                        Continue Anyway
                    </button>
                </div>
            );
        }

        switch (normalizedActiveTool) {
            case 'Browser':
                return <VirtualBrowser initialUrl={initialUrl} onNavigate={handleBrowserNavigate} />;
            case 'Repeater':
                return <RequestRepeater initialUrl={initialUrl} onSend={handleRepeaterSend} />;
            case 'GraphQL Console':
                return <GraphQLConsole endpoint={challenge.labEnvironment?.mockData?.endpoint} onQuery={handleGraphQLQuery} />;
            default:
                return (
                    <div className="tool-placeholder">
                        <Wrench size={32} />
                        <h4>{activeTool}</h4>
                        <p>This tool is a reference. Use the other available tools to interact with the target.</p>
                    </div>
                );
        }
    };

    return (
        <div className="lab-challenge-container">
            {/* Header */}
            <div className="lab-header-section">
                <div className="section-title">
                    <Terminal size={18} className="text-primary" />
                    <h3>{challenge.title}</h3>
                </div>
                <div className="step-tracker">
                    <span className="step-text">Step {currentStep + 1}/{challenge.steps.length}</span>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
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
                {/* GUIDE PANEL */}
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
                                className="btn-prev"
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitFlag()}
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

                {/* TOOLS PANEL */}
                <div className={`lab-tools-panel ${mobileView === 'tools' ? 'active-mobile' : 'hidden-mobile'}`}>
                    <div className="tools-tabs">
                        {tools.map(tool => (
                            <button
                                key={tool}
                                className={`tool-tab ${activeTool === tool ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool)}
                            >
                                {getToolIcon(tool)}
                                {tool}
                            </button>
                        ))}
                    </div>

                    <div className="active-tool-container">
                        {renderTool()}
                    </div>
                </div>
            </div>
        </div>
    );
}
