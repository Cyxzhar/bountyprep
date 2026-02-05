import React, { useState } from 'react';
import { Play, Database } from 'lucide-react';
import './Tools.css';

export default function GraphQLConsole({ endpoint, onQuery }) {
    const [query, setQuery] = useState('{\n  __schema {\n    types {\n      name\n    }\n  }\n}');
    const [variables, setVariables] = useState('{}');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleExecute = () => {
        if (!onQuery) return;
        setLoading(true);
        setResponse(null);

        setTimeout(() => {
            try {
                let parsedVars = {};
                try {
                    parsedVars = JSON.parse(variables || '{}');
                } catch {
                    setResponse({ errors: [{ message: 'Invalid JSON in variables field' }] });
                    setLoading(false);
                    return;
                }
                const result = onQuery(query, parsedVars);
                setResponse(result?.data || result);
            } catch (e) {
                setResponse({ errors: [{ message: e.message }] });
            }
            setLoading(false);
        }, 400);
    };

    return (
        <div className="tool-graphql">
            <div className="graphql-header">
                <div className="endpoint-display">
                    <Database size={14} />
                    <span>{endpoint || '/graphql'}</span>
                </div>
                <button className="btn-execute" onClick={handleExecute} disabled={loading}>
                    <Play size={14} />
                    {loading ? 'Running...' : 'Execute'}
                </button>
            </div>

            <div className="graphql-main">
                <div className="graphql-editor">
                    <div className="editor-label">Query</div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        spellCheck="false"
                        placeholder="Write your GraphQL query here..."
                    />
                </div>

                <div className="graphql-result">
                    <div className="editor-label">Result</div>
                    <pre>
                        {loading
                            ? '// Executing query...'
                            : response
                                ? JSON.stringify(response, null, 2)
                                : '// Response will appear here'}
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
                    spellCheck="false"
                />
            </div>
        </div>
    );
}
