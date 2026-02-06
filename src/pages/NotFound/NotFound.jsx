import { useNavigate } from 'react-router-dom';
import { Home, ShieldAlert, ChevronLeft, Terminal } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-screen">
            <div className="glitch-overlay"></div>
            <div className="scanline"></div>

            <div className="notfound-content">
                <div className="error-icon-wrapper">
                    <ShieldAlert size={80} className="error-icon" />
                    <div className="error-glow"></div>
                </div>

                <div className="error-code">
                    <span className="digit">4</span>
                    <span className="digit glitch" data-text="0">0</span>
                    <span className="digit">4</span>
                </div>

                <h1 className="error-title">CONNECTION TERMINATED</h1>
                <p className="error-message">
                    The endpoint you are trying to reach does not exist in our secure network.
                    It may have been moved, deleted, or encrypted.
                </p>

                <div className="terminal-box">
                    <div className="terminal-header">
                        <Terminal size={14} />
                        <span>system_log_v2.1</span>
                    </div>
                    <div className="terminal-body">
                        <p className="log-line">&gt; GET /requested-path HTTP/1.1</p>
                        <p className="log-line text-error">&gt; RESPONSE: 404_NOT_FOUND</p>
                        <p className="log-line">&gt; ACTION: redirecting_to_home_base...</p>
                        <div className="cursor"></div>
                    </div>
                </div>

                <div className="error-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/home')}>
                        <Home size={20} />
                        Return to Dashboard
                    </button>
                    <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>

            <div className="background-noise"></div>
        </div>
    );
}
