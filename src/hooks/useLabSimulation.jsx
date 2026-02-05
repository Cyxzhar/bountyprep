import { useState, useCallback } from 'react';

// ============ XSS Alert Overlay Component ============
function XSSAlertPopup({ message, flag }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
        }}>
            <div style={{
                background: '#fff', padding: '24px', borderRadius: '12px',
                textAlign: 'center', maxWidth: '320px', width: '90%',
                border: '2px solid #ef4444',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: '#1a1a1a' }}>
                    alert() says:
                </div>
                <div style={{ fontSize: '2.5rem', color: '#2563eb', fontFamily: 'monospace', margin: '12px 0' }}>
                    {message}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: '12px' }}>
                    XSS Triggered! Capture the flag:
                </div>
                <code style={{
                    display: 'block', background: '#111', color: '#4ade80',
                    padding: '8px 12px', borderRadius: '6px',
                    fontFamily: 'monospace', fontSize: '0.85rem',
                    userSelect: 'all', WebkitUserSelect: 'all',
                }}>
                    {flag}
                </code>
                <button
                    onClick={() => setDismissed(true)}
                    style={{
                        marginTop: '16px', background: 'none', border: 'none',
                        color: '#6b7280', textDecoration: 'underline', cursor: 'pointer',
                        fontSize: '0.85rem',
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

// ============ Shared Inline Styles for Simulated Web Pages ============
const ws = {
    page: { padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100%', fontSize: '0.9rem', lineHeight: 1.6 },
    heading: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#e6edf3' },
    subheading: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#c9d1d9' },
    text: { fontSize: '0.9rem', color: '#8b949e', lineHeight: 1.6, marginBottom: '8px' },
    card: { background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' },
    apiResponse: { fontFamily: 'monospace', fontSize: '0.82rem', background: 'rgba(0,0,0,0.4)', color: '#94a3b8', padding: '14px', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: 1.5, overflow: 'auto', wordBreak: 'break-word', border: '1px solid rgba(255,255,255,0.06)' },
    badge: { display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 },
    error: { color: '#ef4444', fontWeight: 600 },
    muted: { color: '#6b7280', fontSize: '0.85rem' },
};

// ============ Main Hook ============
export function useLabSimulation(challenge) {

    const handleBrowserNavigate = useCallback((url) => {
        try {
            const type = challenge.type || '';
            const id = challenge.id || '';

            if (type.includes('XSS') || id.includes('xss')) {
                return simulateXSSLab(url, challenge);
            }
            if (type.includes('IDOR') || id.includes('idor') || type.includes('Access Control')) {
                return simulateIDORLab_Browser(url, challenge);
            }
            if (type.includes('SSRF') || id.includes('ssrf')) {
                return simulateSSRFLab_Browser(url, challenge);
            }
            if (type.includes('SQL') || id.includes('sqli')) {
                return simulateSQLiLab_Browser(url, challenge);
            }

            return defaultBrowserPage(url);
        } catch (e) {
            return { render: () => <div style={{ ...ws.page, ...ws.error }}>Error: {e.message}</div> };
        }
    }, [challenge]);

    const handleRepeaterSend = useCallback((req) => {
        try {
            const type = challenge.type || '';
            const id = challenge.id || '';

            if (type.includes('IDOR') || id.includes('idor') || type.includes('Access Control')) {
                return simulateIDORLab_Repeater(req, challenge);
            }
            if (type.includes('SSRF') || id.includes('ssrf')) {
                return simulateSSRFLab_Repeater(req, challenge);
            }
            if (type.includes('SQL') || id.includes('sqli')) {
                return simulateSQLiLab_Repeater(req, challenge);
            }

            return { status: 404, time: '15ms', data: { error: 'Endpoint not found in simulation.' } };
        } catch (e) {
            return { status: 500, time: '0ms', data: { error: e.message } };
        }
    }, [challenge]);

    const handleGraphQLQuery = useCallback((query, variables) => {
        try {
            if (challenge.id === 'lab-graphql-intro' || (challenge.type || '').includes('GraphQL')) {
                return simulateGraphQL(query, variables, challenge);
            }
            return { status: 400, data: { errors: [{ message: 'Unknown GraphQL endpoint' }] } };
        } catch (e) {
            return { status: 500, data: { errors: [{ message: e.message }] } };
        }
    }, [challenge]);

    return { handleBrowserNavigate, handleRepeaterSend, handleGraphQLQuery };
}

// ============ BROWSER SIMULATIONS ============

function simulateXSSLab(url, challenge) {
    try {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        const q = searchParams.get('q') || searchParams.get('search') || '';

        // Simulated filter: remove the word "script" (case insensitive)
        const filteredQ = q.replace(/script/gi, '');

        let success = false;
        let alertMsg = null;

        // Event handler payloads: <img onerror=alert(1)>, <svg onload=alert(1)>
        if (filteredQ.match(/<img\b[^>]*onerror\s*=\s*.*?alert\s*\(\s*1\s*\)/i) ||
            filteredQ.match(/<svg\b[^>]*onload\s*=\s*.*?alert\s*\(\s*1\s*\)/i) ||
            filteredQ.match(/<body\b[^>]*onload\s*=\s*.*?alert\s*\(\s*1\s*\)/i) ||
            filteredQ.match(/<details\b[^>]*ontoggle\s*=\s*.*?alert\s*\(\s*1\s*\)/i)) {
            success = true;
            alertMsg = '1';
        }

        // Nested tag bypass: <scrscriptipt> -> <script> after filter
        if (filteredQ.toLowerCase().includes('<script>') && filteredQ.includes('alert(1)')) {
            success = true;
            alertMsg = '1';
        }

        return {
            render: () => (
                <div style={{ ...ws.page, background: '#fff', color: '#1f2937', position: 'relative' }}>
                    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Search Results</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input style={{ border: '1px solid #d1d5db', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', width: '160px' }} defaultValue={q} readOnly />
                            <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Search</button>
                        </div>
                    </div>

                    <p style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#374151' }}>
                        Results for: <strong>{filteredQ || '(empty)'}</strong>
                    </p>

                    {q.length > 0 ? (
                        <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#6b7280' }}>
                            No results found for your query.
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Enter a search term above.</p>
                    )}

                    {q.length > 0 && !success && (
                        <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '6px', fontSize: '0.82rem', color: '#92400e' }}>
                            <strong>Server Log:</strong> Input sanitized. Removed blocked keywords from query.
                        </div>
                    )}

                    {success && <XSSAlertPopup message={alertMsg} flag={challenge.flag?.value || 'FLAG_NOT_SET'} />}
                </div>
            )
        };
    } catch (e) {
        return { render: () => <div style={{ ...ws.page, ...ws.error }}>Invalid URL format. Check your address.</div> };
    }
}

function simulateIDORLab_Browser(url, challenge) {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        const userMatch = path.match(/\/api\/users\/(\d+)(\/profile)?/);

        if (userMatch) {
            const userId = parseInt(userMatch[1]);
            const mockProfiles = {
                1001: { id: 1001, username: 'your_account', email: 'you@example.com', role: 'user', balance: '$150.00', joined: '2026-01-15' },
                1: { id: 1, username: 'admin', email: 'admin@company.internal', role: 'administrator', balance: '$999,999.00', internal_notes: 'Master admin account', api_key: challenge.flag?.value || 'BUGORA{IDOR_FLAG}', joined: '2024-03-01' },
                1000: { id: 1000, username: 'jane_security', email: 'jane@company.com', role: 'moderator', balance: '$2,400.00', joined: '2025-06-12' },
                1002: { id: 1002, username: 'bob_dev', email: 'bob@external.dev', role: 'user', balance: '$85.00', joined: '2026-01-20' },
            };

            const profile = mockProfiles[userId];
            const responseData = profile
                ? { status: 200, data: profile }
                : { status: 404, error: 'User not found' };
            const statusColor = profile ? '#22c55e' : '#ef4444';

            return {
                render: () => (
                    <div style={ws.page}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Response</span>
                            <span style={{ ...ws.badge, background: profile ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: statusColor }}>
                                {profile ? '200 OK' : '404 NOT FOUND'}
                            </span>
                        </div>
                        <pre style={ws.apiResponse}>{JSON.stringify(responseData, null, 2)}</pre>
                        {profile && userId === 1 && (
                            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px', fontSize: '0.82rem', color: '#22c55e' }}>
                                IDOR detected! You accessed another user's private data. The flag is in the api_key field.
                            </div>
                        )}
                    </div>
                )
            };
        }

        // API root/documentation
        if (path === '/' || path === '/api' || path === '/api/') {
            return {
                render: () => (
                    <div style={{ ...ws.page, background: '#fff', color: '#1f2937' }}>
                        <h2 style={{ ...ws.heading, color: '#111827' }}>API v1 Documentation</h2>
                        <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Endpoints</h3>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 2 }}>
                                <div><span style={{ color: '#22c55e', fontWeight: 600 }}>GET</span> /api/users/&#123;id&#125;/profile</div>
                                <div><span style={{ color: '#f59e0b', fontWeight: 600 }}>PUT</span> /api/users/&#123;id&#125;/profile</div>
                                <div><span style={{ color: '#22c55e', fontWeight: 600 }}>GET</span> /api/users/&#123;id&#125;/orders</div>
                            </div>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Authentication: Bearer token required. Your user ID: 1001</p>
                    </div>
                )
            };
        }

        return {
            render: () => (
                <div style={ws.page}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>API Response</span>
                        <span style={{ ...ws.badge, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>404 NOT FOUND</span>
                    </div>
                    <pre style={ws.apiResponse}>{JSON.stringify({ status: 404, error: 'Endpoint not found', path }, null, 2)}</pre>
                </div>
            )
        };
    } catch (e) {
        return { render: () => <div style={{ ...ws.page, ...ws.error }}>Invalid URL: {e.message}</div> };
    }
}

function simulateSSRFLab_Browser(url, challenge) {
    if (url.includes('169.254.169.254')) {
        return {
            render: () => (
                <div style={{ ...ws.page, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>&#128683;</div>
                    <h2 style={{ ...ws.heading, color: '#ef4444' }}>Access Denied</h2>
                    <p style={ws.text}>Browser prevents direct access to private network ranges (RFC 1918).</p>
                    <p style={{ ...ws.muted, marginTop: '12px' }}>Hint: Can you trick the server into fetching this for you?</p>
                </div>
            )
        };
    }

    return {
        render: () => (
            <div style={{ ...ws.page, background: '#fff', color: '#1f2937' }}>
                <h1 style={{ ...ws.heading, color: '#7c3aed' }}>Image Fetcher Service</h1>
                <p style={{ ...ws.text, color: '#4b5563' }}>We fetch and resize images for you!</p>
                <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem', color: '#6b7280' }}>
                        Usage: <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>/fetch?url=https://example.com/image.png</code>
                    </p>
                </div>
                <p style={{ ...ws.muted, marginTop: '12px' }}>Status: Waiting for input...</p>
            </div>
        )
    };
}

function simulateSQLiLab_Browser(url, challenge) {
    try {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        const id = searchParams.get('id') || '';
        const q = searchParams.get('q') || searchParams.get('search') || '';

        const mockProducts = [
            { id: 1, name: 'Hacker Hoodie', price: '$49.99', description: 'Stay hidden in style.' },
            { id: 2, name: 'Cyber Deck Pro', price: '$1,299.99', description: 'High performance hacking station.' },
            { id: 3, name: 'Network Cable Kit', price: '$29.99', description: 'Cat6 premium ethernet cables.' },
        ];

        const mockUsers = challenge.labEnvironment?.mockData?.database?.users || [
            { id: 1, username: 'admin', password: challenge.flag?.value || 'flag{sql_union_master}' },
            { id: 2, username: 'user1', password: 'password123' },
        ];

        const input = id || q;
        let injected = false;
        let errorMode = false;
        let displayData = null;

        if (input.includes("'") && !input.toUpperCase().includes('UNION')) {
            errorMode = true;
        } else if (input.toUpperCase().includes('UNION') && input.toUpperCase().includes('SELECT')) {
            injected = true;
            if (input.toLowerCase().includes('users') || input.toLowerCase().includes('password')) {
                displayData = mockUsers;
            } else if (input.toLowerCase().includes('information_schema') || input.toLowerCase().includes('tables')) {
                displayData = [
                    { TABLE_NAME: 'products' },
                    { TABLE_NAME: 'users' },
                    { TABLE_NAME: 'orders' },
                    { TABLE_NAME: 'sessions' },
                ];
            } else {
                displayData = [{ col1: '1', col2: '2', col3: '3' }];
            }
        }

        return {
            render: () => (
                <div style={{ ...ws.page, background: '#fff', color: '#1f2937' }}>
                    <h2 style={{ ...ws.heading, color: '#111827' }}>Product Catalog</h2>

                    {errorMode && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#991b1b' }}>
                            <strong>MySQL Error:</strong> You have an error in your SQL syntax near &#39;{input}&#39; at line 1
                        </div>
                    )}

                    {injected && displayData && (
                        <div>
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', fontSize: '0.8rem', color: '#166534' }}>
                                UNION injection successful - data extracted
                            </div>
                            <pre style={{ ...ws.apiResponse, background: '#1e293b' }}>{JSON.stringify(displayData, null, 2)}</pre>
                        </div>
                    )}

                    {!errorMode && !injected && (
                        <div>
                            {mockProducts.filter(p => {
                                if (id && !isNaN(id)) return p.id === parseInt(id);
                                if (q) return p.name.toLowerCase().includes(q.toLowerCase());
                                return true;
                            }).map((p, i) => (
                                <div key={i} style={{ background: '#f3f4f6', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ color: '#111827' }}>{p.name}</strong>
                                        <span style={{ color: '#059669', fontWeight: 600 }}>{p.price}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>{p.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        };
    } catch (e) {
        return { render: () => <div style={{ ...ws.page, ...ws.error }}>Error: {e.message}</div> };
    }
}

function defaultBrowserPage(url) {
    let hostname = 'target.app';
    try { hostname = new URL(url).hostname; } catch (e) { /* ignore */ }

    return {
        render: () => (
            <div style={{ ...ws.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>&#127760;</div>
                <h2 style={{ ...ws.heading }}>Welcome to {hostname}</h2>
                <p style={{ ...ws.text, maxWidth: '380px' }}>
                    This is the simulated target. Use the tools and follow the step guide to discover vulnerabilities.
                </p>
            </div>
        )
    };
}

// ============ REPEATER SIMULATIONS ============

function simulateIDORLab_Repeater(req, challenge) {
    const url = req.url || '';
    const userMatch = url.match(/\/api\/users\/(\d+)/);

    if (userMatch) {
        const userId = parseInt(userMatch[1]);
        const profiles = {
            1001: { id: 1001, username: 'your_account', email: 'you@example.com', role: 'user' },
            1: { id: 1, username: 'admin', email: 'admin@company.internal', role: 'administrator', api_key: challenge.flag?.value || 'BUGORA{IDOR_FLAG}' },
            1000: { id: 1000, username: 'jane_security', email: 'jane@company.com', role: 'moderator' },
        };

        const profile = profiles[userId];
        if (profile) {
            return { status: 200, time: '23ms', data: { status: 200, data: profile } };
        }
        return { status: 404, time: '12ms', data: { status: 404, error: 'User not found' } };
    }

    return { status: 404, time: '8ms', data: { error: 'Endpoint not found' } };
}

function simulateSSRFLab_Repeater(req, challenge) {
    const targetUrl = req.url || '';

    if (targetUrl.includes('/fetch')) {
        const params = new URLSearchParams(targetUrl.split('?')[1]);
        const payload = params.get('url');

        if (payload && payload.includes('169.254.169.254')) {
            return {
                status: 200,
                time: '45ms',
                data: challenge.labEnvironment?.mockData?.response_metadata || {
                    'instance-id': 'i-0abc123def456',
                    'ami-id': 'ami-12345678',
                    'security-credentials': {
                        'AccessKeyId': 'AKIAEXAMPLE123456',
                        'SecretAccessKey': challenge.flag?.value || 'BUGORA{SSRF_FLAG}',
                    }
                }
            };
        }
        if (!payload) {
            return { status: 400, time: '10ms', data: { error: "Missing 'url' parameter" } };
        }
        return { status: 200, time: '30ms', data: { fetched: payload, content: 'Image data...' } };
    }

    return { status: 404, time: '20ms', data: { error: '404 Not Found' } };
}

function simulateSQLiLab_Repeater(req, challenge) {
    const url = req.url || '';
    const qIndex = url.indexOf('?');
    const searchParams = qIndex !== -1 ? new URLSearchParams(url.slice(qIndex + 1)) : new URLSearchParams();
    const id = searchParams.get('id') || '';
    const q = searchParams.get('q') || '';
    const input = id || q;

    const mockUsers = challenge.labEnvironment?.mockData?.database?.users || [
        { id: 1, username: 'admin', password: challenge.flag?.value || 'flag{sqli}' },
        { id: 2, username: 'user1', password: 'password123' },
    ];

    if (input.includes("'") && !input.toUpperCase().includes('UNION')) {
        return { status: 500, time: '5ms', data: { error: "MySQL Error: syntax error near '" + input + "'" } };
    }

    if (input.toUpperCase().includes('UNION') && input.toUpperCase().includes('SELECT')) {
        if (input.toLowerCase().includes('users') || input.toLowerCase().includes('password')) {
            return { status: 200, time: '35ms', data: mockUsers };
        }
        if (input.toLowerCase().includes('information_schema')) {
            return { status: 200, time: '28ms', data: [{ TABLE_NAME: 'products' }, { TABLE_NAME: 'users' }, { TABLE_NAME: 'orders' }] };
        }
        return { status: 200, time: '18ms', data: [{ col1: '1', col2: '2', col3: '3' }] };
    }

    return { status: 200, time: '12ms', data: { products: [{ id: 1, name: 'Product 1' }] } };
}

// ============ GRAPHQL SIMULATION ============

function simulateGraphQL(query, variables, challenge) {
    const mockData = challenge.labEnvironment?.mockData;

    if (query.includes('__schema') && query.includes('types')) {
        return {
            status: 200,
            data: mockData?.response_schema || {
                data: {
                    __schema: {
                        types: [
                            { name: 'Query' }, { name: 'User' }, { name: 'Post' },
                            { name: 'String' }, { name: 'Int' }, { name: 'Boolean' },
                            { name: 'ID' }, { name: '__Schema' }, { name: '__Type' },
                        ]
                    }
                }
            }
        };
    }

    if (query.includes('user') || query.includes('User')) {
        return {
            status: 200,
            data: {
                data: {
                    user: {
                        id: '1',
                        username: 'admin',
                        email: 'admin@target.com',
                        role: 'ADMIN',
                        secretToken: challenge.flag?.value || 'BUGORA{GRAPHQL_FLAG}'
                    }
                }
            }
        };
    }

    return {
        status: 200,
        data: { data: { message: 'Query executed. Try introspection with __schema to explore the API.' } }
    };
}
