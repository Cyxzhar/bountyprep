import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Lock, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import { challenges } from '../data/challenges';
import './Challenges.css';

const filters = ['All', 'SQL Injection', 'XSS', 'CSRF', 'Auth Bypass', 'IDOR', 'File Upload'];

export default function Challenges() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(initialFilter);

    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            c.type === activeFilter ||
            c.type.toLowerCase().includes(activeFilter.toLowerCase()) ||
            activeFilter.toLowerCase().includes(c.type.toLowerCase());
        return matchesSearch && matchesFilter;
    });

    return (
        <FirstVisitTransition pageName="challenges">
            <div className="challenges-screen">
                <div className="screen-content">
                    {/* Header */}
                    <header className="page-header">
                        <h1>Challenges</h1>
                        <p className="header-subtitle">Master real-world vulnerabilities</p>
                    </header>

                    {/* Search */}
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="filter-btn">
                            <Filter size={18} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters-scroll">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                className={`chip ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Stats Bar */}
                    <div className="challenges-stats">
                        <span className="stat-text"><strong>{filteredChallenges.length}</strong> challenges</span>
                        <span className="stat-separator">•</span>
                        <span className="stat-text"><strong>24</strong> completed</span>
                    </div>

                    {/* Challenges List */}
                    <div className="challenges-list">
                        {filteredChallenges.map((challenge, idx) => (
                            <div
                                key={challenge.id}
                                className="challenge-card"
                                onClick={() => navigate(`/challenge/${challenge.id}`)}
                            >
                                <div className="card-left">
                                    <div className={`card-icon ${challenge.completed ? 'completed' : ''}`}>
                                        {challenge.completed ? <CheckCircle size={22} /> :
                                            challenge.isPremium ? <Lock size={18} /> :
                                                <span className="icon-number">{idx + 1}</span>}
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="card-badges">
                                        <span className="badge badge-info">{challenge.type}</span>
                                        <span className={`badge ${challenge.difficulty === 'easy' ? 'badge-success' :
                                            challenge.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                                            }`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="card-title">{challenge.title}</h3>
                                    <p className="card-desc">{challenge.description}</p>
                                    <div className="card-meta">
                                        <span className="meta-item">
                                            <Clock size={14} />
                                            {challenge.estimatedTime} min
                                        </span>
                                        <span className="meta-item">
                                            +{challenge.xpReward} XP
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="card-arrow" size={20} />
                            </div>
                        ))}
                    </div>
                </div>

                <BottomNav />
            </div>
        </FirstVisitTransition>
    );
}
