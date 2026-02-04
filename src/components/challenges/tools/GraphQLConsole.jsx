import React, { useState } from 'react';
import { Play, Book, Database } from 'lucide-react';
import './Tools.css';

export default function GraphQLConsole({ endpoint, onQuery }) {
    const [query, setQuery] = useState('{\n  __schema {\n    types {\n      name\n    }\n  }\n}');
    const [variables, setVariables] = useState('{}');
    const [response, setResponse] = useState(null);

    const handleExecute = () => {
        setResponse({ data: 'Executing...' });

        setTimeout(() => {
            const result = onQuery(query, JSON.parse(variables || '{}'));
            setResponse(result);
        }, 500);
    };

    return (
        <div className="tool-graphql">
            <div className="graphql-header">
                <div className="endpoint-display">
                    <Database size={14} />
                    <span>{endpoint}</span>
                </div>
                <button className="btn-execute" onClick={handleExecute}>
                    <Play size={14} />
                    Execute
                </button>
            </div>

            <div className="graphql-main">
                <div className="graphql-editor">
                    <div className="editor-label">Query</div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        spellCheck="false"
                    />
                </div>

                <div className="graphql-result">
                    <div className="editor-label">Result</div>
                    <pre>
                        {response ? JSON.stringify(response, null, 2) : '// Response will appear here'}
                    </pre>
                </div>
            </div>

            <div className="graphql-variables">
                <div className="editor-header">
                    <span>Query Variables</span>
                </div>
                <textarea
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                    placeholder="{}"
                />
            </div>
        </div>
    );
}
