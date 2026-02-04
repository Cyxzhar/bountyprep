import React, { useState } from 'react';
import { Send, Globe, Plus, Trash2 } from 'lucide-react';
import './Tools.css';

export default function RequestRepeater({ initialUrl, onSend }) {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState(initialUrl || 'http://target.api/v1/user');
    const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState(null);

    const handleSend = () => {
        // In a real implementation, this would hit a proxy.
        // For the simulation, we pass it up to the parent container which manages the mock state.
        const req = {
            method,
            url,
            headers: headers.reduce((acc, h) => {
                if (h.key) acc[h.key] = h.value;
                return acc;
            }, {}),
            body
        };

        // Simulate network delay
        setResponse({ status: 'Loading...', time: '...' });

        setTimeout(() => {
            const resp = onSend(req);
            setResponse(resp);
        }, 600);
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const updateHeader = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const removeHeader = (index) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    return (
        <div className="tool-repeater">
            <div className="repeater-controls">
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className={`method-select ${method}`}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="url-input"
                    placeholder="Enter URL"
                />
                <button className="btn-send" onClick={handleSend}>
                    <Send size={16} />
                </button>
            </div>

            <div className="repeater-tabs">
                <div className="tab-section">
                    <h4>Headers</h4>
                    <div className="headers-list">
                        {headers.map((h, i) => (
                            <div key={i} className="header-row">
                                <input
                                    placeholder="Key"
                                    value={h.key}
                                    onChange={(e) => updateHeader(i, 'key', e.target.value)}
                                />
                                <input
                                    placeholder="Value"
                                    value={h.value}
                                    onChange={(e) => updateHeader(i, 'value', e.target.value)}
                                />
                                <button onClick={() => removeHeader(i)} className="btn-icon-sm">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        <button onClick={addHeader} className="btn-sm btn-text">
                            <Plus size={14} /> Add Header
                        </button>
                    </div>
                </div>

                <div className="tab-section">
                    <h4>Body</h4>
                    <div className="body-editor">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="{ 'username': 'admin' }"
                        />
                    </div>
                </div>
            </div>

            {response && (
                <div className="repeater-response">
                    <div className="response-status">
                        <span className={response.status === 200 ? 'status-ok' : 'status-err'}>
                            {response.status || 'Checking...'}
                        </span>
                        <span>{response.time || '0ms'}</span>
                    </div>
                    <pre className="response-body">
                        {typeof response.data === 'object'
                            ? JSON.stringify(response.data, null, 2)
                            : response.data}
                    </pre>
                </div>
            )}
        </div>
    );
}
