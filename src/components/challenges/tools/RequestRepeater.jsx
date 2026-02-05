import React, { useState } from 'react';
import { Send, Plus, Trash2 } from 'lucide-react';
import './Tools.css';

export default function RequestRepeater({ initialUrl, onSend }) {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState(initialUrl || 'http://target.api/v1/user');
    const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = () => {
        if (!onSend) return;
        const req = {
            method,
            url,
            headers: headers.reduce((acc, h) => {
                if (h.key) acc[h.key] = h.value;
                return acc;
            }, {}),
            body
        };

        setLoading(true);
        setResponse(null);

        setTimeout(() => {
            try {
                const resp = onSend(req);
                setResponse(resp);
            } catch (e) {
                setResponse({ status: 500, time: '0ms', data: { error: e.message } });
            }
            setLoading(false);
        }, 500);
    };

    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);

    const updateHeader = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [field]: value };
        setHeaders(newHeaders);
    };

    const removeHeader = (index) => setHeaders(headers.filter((_, i) => i !== index));

    const getStatusClass = () => {
        if (!response || !response.status) return '';
        const s = typeof response.status === 'number' ? response.status : 0;
        if (s >= 200 && s < 300) return 'status-ok';
        return 'status-err';
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
                    <option value="PATCH">PATCH</option>
                </select>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="url-input"
                    placeholder="Enter request URL"
                    spellCheck="false"
                />
                <button className="btn-send" onClick={handleSend} disabled={loading}>
                    <Send size={14} />
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

                {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                    <div className="tab-section">
                        <h4>Body</h4>
                        <div className="body-editor">
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder='{ "key": "value" }'
                                spellCheck="false"
                            />
                        </div>
                    </div>
                )}
            </div>

            {(response || loading) && (
                <div className="repeater-response">
                    <div className="response-status">
                        <span className={getStatusClass()}>
                            {loading ? 'Sending...' : (response?.status || 'Error')}
                        </span>
                        <span style={{ color: 'var(--text-muted, #5A5A6E)' }}>
                            {loading ? '...' : (response?.time || '')}
                        </span>
                    </div>
                    {!loading && response && (
                        <pre className="response-body">
                            {typeof response.data === 'object'
                                ? JSON.stringify(response.data, null, 2)
                                : String(response.data || '')}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}
