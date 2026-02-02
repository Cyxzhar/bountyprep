import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, Lightbulb, CheckCircle, XCircle,
    ChevronRight, Award, Copy, Zap
} from 'lucide-react';
import { challenges } from '../data/challenges';
import './ChallengeDetail.css';

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const challenge = challenges.find(c => c.id === id) || challenges[0];

    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const question = challenge.questions[currentQ];

    const handleSubmit = () => {
        if (selected === null) return;
        const isCorrect = selected === question.correctAnswer;
        setResult(isCorrect);
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentQ < challenge.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelected(null);
            setShowHint(false);
            setShowResult(false);
            setResult(null);
        } else {
            navigate('/challenges');
        }
    };

    return (
        <div className="detail-screen">
            {/* Header */}
            <header className="detail-header">
                <button className="back-btn" onClick={() => navigate('/challenges')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-info">
                    <span className="badge badge-info">{challenge.type}</span>
                    <span className={`badge ${challenge.difficulty === 'easy' ? 'badge-success' :
                            challenge.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        {challenge.difficulty}
                    </span>
                </div>
                <div className="header-time">
                    <Clock size={16} />
                    <span>{challenge.estimatedTime}m</span>
                </div>
            </header>

            <div className="detail-content">
                {/* Progress */}
                <div className="question-progress">
                    <span>Question {currentQ + 1} of {challenge.questions.length}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentQ + 1) / challenge.questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Scenario */}
                <div className="scenario-card">
                    <h2 className="scenario-title">{challenge.title}</h2>
                    {question.scenario && (
                        <p className="scenario-text">{question.scenario}</p>
                    )}

                    {question.codeBlock && (
                        <div className="code-block">
                            <div className="code-header">
                                <span>{question.codeLanguage || 'code'}</span>
                                <button className="copy-btn">
                                    <Copy size={14} />
                                </button>
                            </div>
                            <pre><code>{question.codeBlock}</code></pre>
                        </div>
                    )}
                </div>

                {/* Question */}
                <div className="question-section">
                    <h3 className="question-text">{question.question}</h3>

                    <div className="options-list">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${selected === idx ? 'selected' : ''} ${showResult && idx === question.correctAnswer ? 'correct' : ''
                                    } ${showResult && selected === idx && selected !== question.correctAnswer ? 'incorrect' : ''}`}
                                onClick={() => !showResult && setSelected(idx)}
                                disabled={showResult}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="option-text">{option}</span>
                                {showResult && idx === question.correctAnswer && <CheckCircle size={20} />}
                                {showResult && selected === idx && selected !== question.correctAnswer && <XCircle size={20} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hint */}
                {!showResult && (
                    <button
                        className="hint-btn"
                        onClick={() => setShowHint(!showHint)}
                    >
                        <Lightbulb size={18} />
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                )}

                {showHint && !showResult && (
                    <div className="hint-box">
                        <p>{question.hint}</p>
                    </div>
                )}

                {/* Result */}
                {showResult && (
                    <div className={`result-box ${result ? 'success' : 'error'}`}>
                        <div className="result-header">
                            {result ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            <span>{result ? 'Correct!' : 'Incorrect'}</span>
                        </div>
                        <p className="result-explanation">{question.explanation}</p>
                        {result && (
                            <div className="xp-earned">
                                <Award size={18} />
                                <span>+{Math.round(challenge.xpReward / challenge.questions.length)} XP earned</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="detail-footer">
                {!showResult ? (
                    <button
                        className="btn btn-primary btn-full"
                        disabled={selected === null}
                        onClick={handleSubmit}
                    >
                        Submit Answer
                        <Zap size={20} />
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleNext}
                    >
                        {currentQ < challenge.questions.length - 1 ? 'Next Question' : 'Complete Challenge'}
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
