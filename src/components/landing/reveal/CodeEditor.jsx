import React from 'react';
import { X } from 'lucide-react';

const CodeEditor = ({ currentAttack, hackStep, displayCode, attackIndex }) => {

    const renderCode = () => {
        let remainingDisplay = displayCode;

        return currentAttack.tokens.map((token, index) => {
            if (remainingDisplay.length === 0) return null;

            const tokenLen = token.text.length;
            const content = remainingDisplay.slice(0, tokenLen);
            remainingDisplay = remainingDisplay.slice(tokenLen);

            return (
                <span key={`${attackIndex}-${index}`} className={`c-${token.type}`}>
                    {content}
                </span>
            );
        });
    };

    return (
        <div className="simulation-container">
            {/* Code Editor Header */}
            <div className="editor-header-tabs">
                <div className="tab active">
                    <span className={`file-icon ${currentAttack.fileExt}`}>{currentAttack.fileExt}</span>
                    <span className="tab-name">{currentAttack.fileName}</span>
                    <X size={10} className="close-x" />
                </div>
                <div className="tab">
                    <span className="file-icon">txt</span>
                    <span className="tab-name">recon.log</span>
                </div>
                {hackStep === 1 && (
                    <div className="editor-status-badge running animate-pulse">
                        <span className="desktop-text">Executing...</span>
                        <span className="mobile-text">Running</span>
                    </div>
                )}
            </div>

            {/* Code Editor Body */}
            <div className="editor-content">
                <div className="line-numbers">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n}>{n}</div>)}
                </div>
                <div className="code-area">
                    <pre>{renderCode()}<span className="cursor-block"></span></pre>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
