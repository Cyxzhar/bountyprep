import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Lock, ChevronRight, Clock, CheckCircle, Star, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import { challenges as localChallenges } from '../data/challenges';
import './Challenges.css';

const filters = ['All', 'SQL Injection', 'XSS', 'CSRF', 'Auth Bypass', 'IDOR', 'File Upload'];

// Cache for completed challenges
let cachedCompletedChallenges = null;

export default function Challenges() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [challenges, setChallenges] = useState(localChallenges);
    const [completedChallenges, setCompletedChallenges] = useState(cachedCompletedChallenges || new Set());
    const [loading, setLoading] = useState(false);

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
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            c.type === activeFilter ||
            c.type.toLowerCase().includes(activeFilter.toLowerCase()) ||
            activeFilter.toLowerCase().includes(c.type.toLowerCase());
        return matchesSearch && matchesFilter;
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

                <BottomNav />
            </div>
        </FirstVisitTransition>
    );
}
