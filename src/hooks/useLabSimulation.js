import { useState, useCallback } from 'react';

// This hook acts as the "Mock Backend" for the Virtual Tools.
// It intercepts requests/actions from the tools and returns realistic responses
// based on the current challenge ID and its mock data.

export function useLabSimulation(challenge) {

    // --- BROWSER SIMULATION ---
    const handleBrowserNavigate = useCallback((url) => {
        console.log(`[Browser Sim] Navigating to: ${url}`);

        // 1. LAB: Reflected XSS Filter Bypass
        // ID: 'lab-xss-reflected-1' (assuming this ID based on context, or generic checker)
        if (challenge.id.includes('xss') || challenge.title.includes('XSS')) {
            return simulateXSSLab(url, challenge);
        }

        // 2. LAB: Cloud SSRF
        if (challenge.id === 'lab-cloud-ssrf') {
            return simulateSSRFLab_Browser(url);
        }

        // Default: Generic 404 or Welcome
        return {
            render: () => (
                <div className="p-4">
                    <h1 className="text-xl font-bold mb-2">Welcome to {new URL(url).hostname}</h1>
                    <p>This page is static. Try using the tools to find vulnerabilities.</p>
                </div>
            )
        };
    }, [challenge]);


    // --- REPEATER SIMULATION ---
    const handleRepeaterSend = useCallback((req) => {
        console.log(`[Repeater Sim] ${req.method} ${req.url}`);

        // 1. LAB: Cloud SSRF
        if (challenge.id === 'lab-cloud-ssrf') {
            return simulateSSRFLab_Repeater(req, challenge);
        }

        return {
            status: 404,
            time: '15ms',
            data: { error: "Route not found in simulation." }
        };
    }, [challenge]);


    // --- GRAPHQL SIMULATION ---
    const handleGraphQLQuery = useCallback((query, variables) => {
        // 1. LAB: GraphQL Intro
        if (challenge.id === 'lab-graphql-intro') {
            if (query.includes('__schema') && query.includes('types')) {
                return {
                    status: 200,
                    data: challenge.labEnvironment.mockData.response_schema
                };
            }
            return {
                status: 200,
                data: { data: { message: "Query executed securely. Try introspection?" } }
            };
        }

        return { status: 400, data: { errors: [{ message: "Syntax Error" }] } };
    }, [challenge]);

    return {
        handleBrowserNavigate,
        handleRepeaterSend,
        handleGraphQLQuery
    };
}

// --- SPECIFIC LAB LOGIC HELPERS ---

function simulateXSSLab(url, challenge) {
    try {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        let q = searchParams.get('q') || searchParams.get('search') || '';

        // Simulating the "Filter": Remove the word "script" (case insensitive usually, but let's emulate the lab desc)
        // Lab Desc: "filters out the word 'script'"

        // Naive filter: remove 'script'
        const filteredQ = q.replace(/script/gi, '');

        // Check for successful execution (e.g., if <img ... alert(1)> remains)
        // Or if they bypassed script filter via nested tags <scrscriptipt> -> script

        let success = false;
        let alertMsg = null;

        // Simple heuristic for success: does the output string contain a valid JS trigger?
        if (filteredQ.match(/<img.*onerror=.*alert\(1\).*>/i) || filteredQ.match(/<svg.*onload=.*alert\(1\).*>/i)) {
            success = true;
            alertMsg = "1";
        }

        // If they managed to reconstruct 'script' (e.g. <scrscriptipt>) -> <script>
        if (filteredQ.toLowerCase().includes('<script>') && filteredQ.includes('alert(1)')) {
            success = true;
            alertMsg = "1";
        }

        return {
            render: () => (
                <div className="p-4 bg-white min-h-screen text-black">
                    <header className="border-b p-4 mb-4 flex justify-between items-center">
                        <h1 className="text-lg font-bold">Search Results</h1>
                        <form className="flex gap-2">
                            <input className="border p-1" defaultValue={q} disabled />
                            <button className="bg-blue-500 text-white px-3 py-1">Search</button>
                        </form>
                    </header>

                    <div className="container mx-auto">
                        <p className="mb-4">Results for: <b>{filteredQ}</b></p>

                        {filteredQ.length > 0 ? (
                            <div className="bg-gray-100 p-4 rounded">
                                No results found.
                            </div>
                        ) : (
                            <div className="text-gray-500">Enter a search term.</div>
                        )}

                        {/* THE ALERT OVERLAY (Success Simulation) */}
                        {success && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded shadow-xl text-center border-2 border-red-500 w-80">
                                    <h3 className="text-xl font-mono font-bold mb-2">alert says:</h3>
                                    <div className="text-4xl mb-4 text-blue-600 font-mono">
                                        {alertMsg}
                                    </div>
                                    <div className="text-sm text-green-600 mb-4 font-bold">
                                        XSS Triggered! Capture the flag:
                                    </div>
                                    <code className="bg-black text-green-400 p-2 rounded block select-all">
                                        {challenge.flag.value}
                                    </code>
                                    <button className="mt-4 text-sm text-gray-500 underline" onClick={(e) => e.target.closest('.fixed').remove()}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        };
    } catch (e) {
        return { render: () => <div className="p-4 text-red-500">Invalid URL format</div> };
    }
}

function simulateSSRFLab_Browser(url) {
    if (url.includes('169.254.169.254')) {
        return {
            render: () => (
                <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-xl font-bold text-red-500 mb-2">Access Denied</h2>
                    <p>The browser prevents direct access to private network ranges (RFC 1918).</p>
                    <p className="mt-4 text-sm text-gray-500">Hint: Can you trick the server into fetching this for you?</p>
                </div>
            )
        };
    }
    return {
        render: () => (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-purple-600 mb-4">Image Fetcher Service</h1>
                <p className="mb-4">We fetch images for you! Try <code>/fetch?url=...</code></p>
                <div className="border p-4 rounded bg-gray-50">
                    <p className="font-mono text-sm text-gray-600">waiting for input...</p>
                </div>
            </div>
        )
    };
}

function simulateSSRFLab_Repeater(req, challenge) {
    const targetUrl = req.url || '';
    if (targetUrl.includes('vulnerable-site.com/fetch')) {
        const params = new URLSearchParams(targetUrl.split('?')[1]);
        const payload = params.get('url');

        if (payload && payload.includes('169.254.169.254')) {
            return {
                status: 200,
                time: '45ms',
                data: challenge.labEnvironment.mockData.response_metadata
            };
        }
        if (!payload) {
            return { status: 400, time: '10ms', data: { error: "Missing 'url' parameter" } };
        }
        return { status: 200, time: '30ms', data: "Fetched: " + payload };
    }
    return { status: 404, time: '20ms', data: { error: "404 Not Found" } };
}
