import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2, Circle, Lock, ChevronRight,
    BookOpen, Target, Zap, Trophy, Search,
    Shield, FileText, Clipboard, Cpu, MessageSquare,
    Briefcase, Binary, Layout, UserCheck, Award,
    Star, Crown
} from 'lucide-react';
import './Roadmap.css';

const IconMap = {
    BookOpen, Target, Zap, Trophy, Search,
    Lock, Shield, FileText, Clipboard, Cpu,
    MessageSquare, Briefcase, Binary, Layout,
    UserCheck, Award, Star, Crown
};

export default function Roadmap({ milestones, title = "Your Roadmap" }) {
    const navigate = useNavigate();

    return (
        <section className="dashboard-roadmap-section">
            <div className="section-header">
                <div className="section-title-group">
                    <h3 className="section-title">{title}</h3>
                    <p className="section-subtitle">Based on your bug bounty goals</p>
                </div>
                <button className="btn-ghost" onClick={() => navigate('/challenges')}>
                    View Full Path
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="roadmap-container">
                <div className="roadmap-timeline-track"></div>
                <div className="roadmap-milestones">
                    {milestones.map((milestone, index) => {
                        const IconComponent = IconMap[milestone.icon] || Circle;
                        const isCompleted = milestone.status === 'completed';
                        const isCurrent = milestone.status === 'current';
                        const isLocked = milestone.status === 'locked';

                        return (
                            <div
                                key={milestone.id}
                                className={`roadmap-milestone-item ${milestone.status}`}
                            >
                                <div className="milestone-visual">
                                    <div className="milestone-node">
                                        {isCompleted ? (
                                            <CheckCircle2 size={24} className="node-icon completed" />
                                        ) : isCurrent ? (
                                            <div className="node-pulse">
                                                <div className="pulse-ring"></div>
                                                <Circle size={20} className="node-icon active" />
                                            </div>
                                        ) : (
                                            <Lock size={18} className="node-icon locked" />
                                        )}
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <div className={`milestone-connector ${isCompleted ? 'completed' : ''}`} />
                                    )}
                                </div>

                                <div className="milestone-content card-glow" onClick={() => !isLocked && navigate('/challenges')}>
                                    <div className="milestone-icon-wrapper">
                                        <IconComponent size={20} />
                                    </div>
                                    <div className="milestone-info">
                                        <h4 className="milestone-title">{milestone.title}</h4>
                                        <p className="milestone-description">{milestone.desc}</p>
                                    </div>
                                    {isCurrent && <div className="current-badge">UP NEXT</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
