import React, { useState, useCallback, useRef } from 'react';
import { RotateCw, Lock } from 'lucide-react';
import './Tools.css';

export default function VirtualBrowser({ initialUrl, onNavigate }) {
    const [url, setUrl] = useState(initialUrl || 'http://target.app');
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleNavigate = useCallback(() => {
        if (!onNavigate || !url) return;
        setLoading(true);
        setTimeout(() => {
            try {
                const result = onNavigate(url);
                setContent(result);
            } catch (e) {
                setContent({
                    render: () => (
                        <div style={{ padding: '1rem', color: '#ef4444' }}>
                            Error loading page: {e.message}
                        </div>
                    )
                });
            }
            setLoading(false);
        }, 400);
    }, [url, onNavigate]);

    // Initial page load
    React.useEffect(() => {
        handleNavigate();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="tool-browser">
            <div className="browser-bar">
                <div className="browser-nav">
                    <button className="btn-icon" onClick={handleNavigate} title="Reload">
                        <RotateCw size={14} />
                    </button>
                    <div className="address-bar">
                        <Lock size={12} className="lock-icon" />
                        <input
                            ref={inputRef}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                            placeholder="Enter URL..."
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>

            <div className="browser-viewport">
                {loading ? (
                    <div className="browser-loading">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="browser-content">
                        {content ? (
                            typeof content.render === 'function'
                                ? content.render()
                                : <pre>{JSON.stringify(content, null, 2)}</pre>
                        ) : (
                            <div className="empty-state">
                                <p>Enter a URL and press Enter to browse</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
