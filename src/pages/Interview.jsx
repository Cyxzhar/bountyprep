import { useState } from 'react';
import {
    Sprout, BookOpen, Rocket, ChevronRight, Bot,
    Mic, Send, X, Timer, Volume2
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './Interview.css';

const difficulties = [
    { id: 'junior', title: 'Junior Level', desc: '0-2 years experience', icon: Sprout },
    { id: 'mid', title: 'Mid Level', desc: '2-5 years experience', icon: BookOpen },
    { id: 'senior', title: 'Senior Level', desc: '5+ years experience', icon: Rocket }
];

const mockMessages = [
    { role: 'ai', text: "Hello! I'm your AI interview coach. Let's practice some FAANG-level security questions. Ready to begin?" },
    { role: 'user', text: "Yes, I'm ready!" },
    { role: 'ai', text: "Great! Let's start with a fundamental question: Explain the difference between XSS and CSRF attacks, and how would you prevent each one?" },
];

export default function Interview() {
    const [started, setStarted] = useState(false);
    const [difficulty, setDifficulty] = useState('mid');
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "That's a solid answer! You correctly identified the core differences. XSS is client-side script injection while CSRF exploits authenticated sessions. Let me follow up: Can you describe a scenario where both vulnerabilities could be chained together?"
            }]);
        }, 1500);
    };

    if (!started) {
        return (
            <div className="interview-screen">
                <div className="screen-content">
                    <div className="interview-intro">
                        <div className="intro-icon">
                            <Bot size={48} />
                        </div>
                        <h1 className="intro-title">AI Interview Coach</h1>
                        <p className="intro-subtitle">Practice FAANG-level security interview questions with real-time AI feedback</p>
                    </div>

                    <div className="difficulty-section">
                        <h3 className="section-label">Select Difficulty</h3>
                        <div className="difficulty-grid">
                            {difficulties.map(d => {
                                const Icon = d.icon;
                                return (
                                    <button
                                        key={d.id}
                                        className={`diff-card ${difficulty === d.id ? 'selected' : ''}`}
                                        onClick={() => setDifficulty(d.id)}
                                    >
                                        <div className="diff-icon">
                                            <Icon size={24} />
                                        </div>
                                        <div className="diff-content">
                                            <span className="diff-title">{d.title}</span>
                                            <span className="diff-desc">{d.desc}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="topics-section">
                        <h3 className="section-label">Topics Covered</h3>
                        <div className="topics-grid">
                            <span className="topic-chip">Web Security</span>
                            <span className="topic-chip">Network Attacks</span>
                            <span className="topic-chip">Cryptography</span>
                            <span className="topic-chip">Incident Response</span>
                            <span className="topic-chip">Secure Coding</span>
                            <span className="topic-chip">Threat Modeling</span>
                        </div>
                    </div>

                    <div className="cta-section">
                        <button className="btn btn-primary btn-full" onClick={() => setStarted(true)}>
                            Begin Interview Session
                            <ChevronRight size={20} />
                        </button>
                        <p className="cta-note">~15 min session • Personalized feedback</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="interview-screen chat-mode">
            {/* Chat Header */}
            <header className="chat-header">
                <button className="back-btn" onClick={() => setStarted(false)}>
                    <X size={20} />
                </button>
                <div className="chat-info">
                    <span className="chat-title">Mock Interview</span>
                    <span className="chat-level">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level</span>
                </div>
                <div className="chat-timer">
                    <Timer size={16} />
                    <span>12:34</span>
                </div>
            </header>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        {msg.role === 'ai' && (
                            <div className="message-avatar">
                                <Bot size={20} />
                            </div>
                        )}
                        <div className="message-bubble">
                            <p>{msg.text}</p>
                            {msg.role === 'ai' && (
                                <button className="speak-btn">
                                    <Volume2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type your answer..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="voice-btn">
                        <Mic size={20} />
                    </button>
                </div>
                <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
