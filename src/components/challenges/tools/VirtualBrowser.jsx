import React, { useState } from 'react';
import { Search, RotateCw, Lock } from 'lucide-react';
import './Tools.css';

export default function VirtualBrowser({ initialUrl, onNavigate }) {
    const [url, setUrl] = useState(initialUrl || 'http://vulnerable-shop.com');
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleNavigate = () => {
        setLoading(true);
        setTimeout(() => {
            const result = onNavigate(url);
            setContent(result);
            setLoading(false);
        }, 500);
    };

    // Initial load
    React.useEffect(() => {
        handleNavigate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="tool-browser">
            <div className="browser-bar">
                <div className="browser-nav">
                    <button className="btn-icon">
                        <RotateCw size={14} />
                    </button>
                    <div className="address-bar">
                        <Lock size={12} className="lock-icon" />
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
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
                            content.render ? content.render() : <pre>{JSON.stringify(content, null, 2)}</pre>
                        ) : (
                            <div className="empty-state">
                                <Search size={48} />
                                <p>Enter a URL to browse</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
