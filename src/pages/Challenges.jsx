import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Lock, ChevronRight, Clock, CheckCircle, Star, Crown, Code, FlaskConical, Layers, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirstVisitTransition } from '../components/PageTransition/PageTransition';
import { challenges as localChallenges } from '../data/challenges';
import './Challenges.css';

// Challenge type filters with icons
const challengeTypeFilters = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: BookOpen },
    { id: 'coding', label: 'Coding', icon: Code },
    { id: 'lab', label: 'Lab', icon: FlaskConical },
    { id: 'practical', label: 'Practical', icon: Layers }
];

const vulnerabilityFilters = ['All', 'SQL Injection', 'XSS', 'CSRF', 'Auth Bypass', 'IDOR', 'File Upload', 'Coding'];

// Cache for completed challenges
let cachedCompletedChallenges = null;

export default function Challenges() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChallengeType, setActiveChallengeType] = useState('all');
    const [activeVulnFilter, setActiveVulnFilter] = useState(initialFilter);
    const [challenges, setChallenges] = useState(localChallenges);
    const [completedChallenges, setCompletedChallenges] = useState(cachedCompletedChallenges || new Set());
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    const isPremium = currentUser?.isPremium || false;

    // Load completed challenges from Firestore (background sync)
    useEffect(() => {
        if (!currentUser?.uid) return;

        if (cachedCompletedChallenges) {
            setCompletedChallenges(cachedCompletedChallenges);
        }

        async function syncData() {
            try {
                const userChallengesRef = collection(db, 'users', currentUser.uid, 'challenges');

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                );

                const userChallengesSnap = await Promise.race([
                    getDocs(userChallengesRef),
                    timeoutPromise
                ]);

                const completed = new Set();
                userChallengesSnap.docs.forEach(doc => {
                    if (doc.data().completed) {
                        completed.add(doc.id);
                    }
                });

                cachedCompletedChallenges = completed;
                setCompletedChallenges(completed);
            } catch (error) {
                console.warn('Background sync skipped:', error.message);
            }
        }

        syncData();
    }, [currentUser?.uid]);

    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by challenge type (quiz, coding, lab, practical)
        const matchesChallengeType = activeChallengeType === 'all' ||
            (c.challengeType && c.challengeType === activeChallengeType) ||
            (activeChallengeType === 'quiz' && !c.challengeType); // Old challenges without challengeType are quizzes

        // Filter by vulnerability type (SQL Injection, XSS, etc.)
        const matchesVulnFilter = activeVulnFilter === 'All' ||
            c.type === activeVulnFilter ||
            c.type.toLowerCase().includes(activeVulnFilter.toLowerCase()) ||
            activeVulnFilter.toLowerCase().includes(c.type.toLowerCase());

        return matchesSearch && matchesChallengeType && matchesVulnFilter;
    });

    const totalCompleted = currentUser?.totalCompleted || completedChallenges.size;

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
                        <button
                            className={`filter-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                            title={showFilters ? 'Hide filters' : 'Show filters'}
                        >
                            <Filter size={18} />
                        </button>
                    </div>

                    {/* Challenge Type Filters */}
                    {showFilters && (
                        <>
                            <div className="filter-section">
                                <h3 className="filter-title">Challenge Type</h3>
                                <div className="type-filters">
                                    {challengeTypeFilters.map(filter => {
                                        const Icon = filter.icon;
                                        return (
                                            <button
                                                key={filter.id}
                                                className={`type-filter-btn ${activeChallengeType === filter.id ? 'active' : ''}`}
                                                onClick={() => setActiveChallengeType(filter.id)}
                                            >
                                                <Icon size={18} />
                                                <span>{filter.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Vulnerability Filters */}
                            <div className="filter-section">
                                <h3 className="filter-title">Vulnerability</h3>
                                <div className="filters-scroll">
                                    {vulnerabilityFilters.map(filter => (
                                        <button
                                            key={filter}
                                            className={`chip ${activeVulnFilter === filter ? 'active' : ''}`}
                                            onClick={() => setActiveVulnFilter(filter)}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Stats Bar */}
                    <div className="challenges-stats">
                        <span className="stat-text"><strong>{filteredChallenges.length}</strong> challenges</span>
                        <span className="stat-separator">•</span>
                        <span className="stat-text"><strong>{totalCompleted}</strong> completed</span>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Loading challenges...</span>
                        </div>
                    )}

                    {/* Challenges List */}
                    <div className="challenges-list">
                        {filteredChallenges.map((challenge, idx) => {
                            const isCompleted = completedChallenges.has(challenge.id);
                            const isLocked = challenge.isPremium && !isPremium;

                            const handleClick = () => {
                                if (isLocked) {
                                    navigate('/upgrade');
                                } else {
                                    navigate(`/challenge/${challenge.id}`);
                                }
                            };

                            return (
                                <div
                                    key={challenge.id}
                                    className={`challenge-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                                    onClick={handleClick}
                                >
                                    <div className="card-left">
                                        <div className={`card-icon ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
                                            {isCompleted ? <CheckCircle size={22} /> :
                                                isLocked ? <Lock size={18} /> :
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
                                            {isLocked && (
                                                <span className="badge badge-premium">
                                                    <Crown size={10} /> Premium
                                                </span>
                                            )}
                                            {isCompleted && (
                                                <span className="badge badge-completed">
                                                    <CheckCircle size={12} /> Done
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="card-title">{challenge.title}</h3>
                                        <p className="card-desc">{challenge.description}</p>
                                        <div className="card-meta">
                                            <span className="meta-item">
                                                <Clock size={14} />
                                                {challenge.estimatedTime || challenge.estimatedTimeMinutes} min
                                            </span>
                                            <span className="meta-item xp-reward">
                                                <Star size={14} />
                                                +{challenge.xpReward} XP
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight className="card-arrow" size={20} />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </FirstVisitTransition>
    );
}
