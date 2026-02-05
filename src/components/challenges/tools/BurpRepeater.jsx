import React, { useState } from 'react';
import { Send, RotateCcw, Copy, Check, FileText } from 'lucide-react';
import './Tools.css';

export default function BurpRepeater({ initialUrl, onSend }) {
    const [request, setRequest] = useState(`GET / HTTP/1.1\nHost: target.app\nUser-Agent: Mozilla/5.0\nAccept: */*`);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('raw');

    // Parse functionality to help users who might paste full URLs
    // simulating Burp's "Paste URL as request" might be too complex, keeping it simple text editor for now.

    const handleSend = () => {
        if (!onSend) return;
        setLoading(true);
        setResponse(null);

        // Parse the raw request to object for the hook
        // This is a naive parser for simulation purposes
        const lines = request.split('\n');
        const [method, path] = lines[0].split(' ');

        // Extract headers
        const headers = {};
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') break; // End of headers
            const [key, ...vals] = line.split(':');
            if (key && vals.length) {
                headers[key.trim()] = vals.join(':').trim();
            }
        }

        // Construct full URL (simulation needs it)
        let host = headers['Host'] || 'target.app';
        let fullUrl = `http://${host}${path || '/'}`;

        // Prepare request object
        const reqObj = {
            method: method || 'GET',
            url: fullUrl,
            headers,
            body: '' // Body parsing omitted for brevity in this version, could add if needed
        };

        setTimeout(() => {
            try {
                const result = onSend(reqObj);
                setResponse(result);
            } catch (e) {
                setResponse({ status: 500, time: '0ms', data: { error: e.message } });
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="tool-burp">
            <div className="burp-toolbar">
                <div className="burp-actions">
                    <button className="btn-burp-send" onClick={handleSend} disabled={loading}>
                        <div className="btn-content">
                            Send
                        </div>
                    </button>
                    <button className="btn-burp-action" onClick={() => setRequest('')}>
                        Cancel
                    </button>
                </div>
                <div className="burp-status">
                    {loading && <span className="status-loading">Sending request...</span>}
                    {response && (
                        <span className={`status-code ${response.status >= 400 ? 'error' : 'success'}`}>
                            {response.status} {response.status === 200 ? 'OK' : 'Error'}
                        </span>
                    )}
                    {response && <span className="status-time">{response.time}</span>}
                </div>
            </div>

            <div className="burp-split-pane">
                {/* Request Pane */}
                <div className="burp-pane request-pane">
                    <div className="burp-pane-header">
                        <div className="pane-title">Request</div>
                        <div className="pane-tabs">
                            <button className={activeTab === 'raw' ? 'active' : ''}>Raw</button>
                            <button>Hex</button>
                            <button>Render</button>
                        </div>
                    </div>
                    <textarea
                        className="burp-editor"
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        spellCheck="false"
                    />
                </div>

                {/* Response Pane */}
                <div className="burp-pane response-pane">
                    <div className="burp-pane-header">
                        <div className="pane-title">Response</div>
                        <div className="pane-tabs">
                            <button className={activeTab === 'raw' ? 'active' : ''}>Raw</button>
                            <button>Hex</button>
                            <button>Render</button>
                        </div>
                    </div>
                    <div className="burp-viewer">
                        {response ? (
                            <pre>
                                {`HTTP/1.1 ${response.status} ${response.status === 200 ? 'OK' : 'Error'}\n`}
                                {`Date: ${new Date().toUTCString()}\n`}
                                {`Content-Type: application/json\n`}
                                {`Content-Length: ${JSON.stringify(response.data).length}\n\n`}
                                {JSON.stringify(response.data, null, 2)}
                            </pre>
                        ) : (
                            <div className="empty-response">No response available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
