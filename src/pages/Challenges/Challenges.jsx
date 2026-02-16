import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Lock, Clock, CheckCircle, Star, Crown, Code, FlaskConical, Layers, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FirstVisitTransition } from '../../components/PageTransition/PageTransition';
import { useChallenges } from '../../hooks/useContent';
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

const difficultyConfig = {
    easy: { label: 'Beginner', icon: '🌱', color: 'var(--accent-green)', description: 'Start your journey here' },
    medium: { label: 'Intermediate', icon: '⚡', color: 'var(--accent-orange)', description: 'Level up your skills' },
    hard: { label: 'Advanced', icon: '🔥', color: 'var(--accent-red)', description: 'For experienced hackers' },
    expert: { label: 'Expert', icon: '💀', color: 'var(--accent-purple)', description: 'Ultimate challenges' }
};

// Cache for completed challenges
let cachedCompletedChallenges = null;

function DifficultySection({ difficulty, challenges, config, onChallengeClick, completedSet, isPremiumUser }) {
    if (challenges.length === 0) return null;

    const completedCount = challenges.filter(c => completedSet.has(c.id)).length;
    const progress = Math.round((completedCount / challenges.length) * 100);
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="difficulty-section" data-difficulty={difficulty}>
            <div className="difficulty-header">
                <div className="difficulty-info">
                    <span className="difficulty-icon">{config.icon}</span>
                    <div>
                        <h2 className="difficulty-title">{config.label}</h2>
                        <p className="difficulty-desc">{config.description}</p>
                    </div>
                </div>
                <div className="difficulty-progress">
                    <div className="progress-ring">
                        <svg viewBox="0 0 48 48">
                            <circle className="ring-bg" cx="24" cy="24" r={radius} />
                            <circle
                                className="ring-fill"
                                cx="24" cy="24" r={radius}
                                strokeDasharray={`${circumference} ${circumference}`}
                                strokeDashoffset={offset}
                                style={{ stroke: config.color }}
                            />
                        </svg>
                        <span className="ring-percent">{progress}%</span>
                    </div>
                    <span className="progress-label">{completedCount}/{challenges.length} Done</span>
                </div>
            </div>

            <div className="challenges-grid">
                {challenges.map((challenge, idx) => (
                    <ChallengeCardV2
                        key={challenge.id}
                        challenge={challenge}
                        index={idx}
                        isCompleted={completedSet.has(challenge.id)}
                        isLocked={challenge.isPremium && !isPremiumUser}
                        onClick={() => onChallengeClick(challenge)}
                    />
                ))}
            </div>
        </div>
    );
}

function ChallengeCardV2({ challenge, index, isCompleted, isLocked, onClick }) {
    const category = challenge.type?.split(' ')[0].toLowerCase() || 'default';

    return (
        <div
            className={`challenge-card-v2 ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
            data-category={category}
            data-id={challenge.id}
            onClick={onClick}
        >
            {/* Icon Section */}
            <div className="challenge-icon-section">
                <div className="challenge-number-icon">
                    {isCompleted ? <CheckCircle size={32} /> : isLocked ? <Lock size={28} /> : `#${index + 1}`}
                </div>
            </div>

            {/* Content Section */}
            <div className="challenge-content-section">
                <div className="challenge-header">
                    <div className="challenge-badges">
                        <span className="badge badge-info">{challenge.type}</span>
                        {challenge.difficulty && (
                            <span className={`badge badge-${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'danger'}`}>
                                {challenge.difficulty}
                            </span>
                        )}
                        {isLocked && <span className="badge badge-premium"><Crown size={12} /> Premium</span>}
                    </div>
                </div>

                <h3 className="challenge-title">{challenge.title}</h3>
                <p className="challenge-desc">{challenge.description}</p>

                <div className="challenge-meta-section">
                    <span className="meta-item">
                        <Clock size={14} />
                        {challenge.estimatedTime || challenge.estimatedTimeMinutes || 15} min
                    </span>
                    <span className="meta-item xp">
                        <Star size={14} />
                        +{challenge.xpReward || 50} XP
                    </span>
                    <span className="meta-item">
                        <Users size={14} />
                        {Math.floor(Math.random() * 500) + 100} Solved
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <button className="challenge-action-btn">
                {isCompleted ? 'Review' : isLocked ? 'Unlock' : 'Start'}
            </button>
        </div>
    );
}

export default function Challenges() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChallengeType, setActiveChallengeType] = useState('all');
    const [activeVulnFilter, setActiveVulnFilter] = useState(initialFilter);

    const { challenges, loading: challengesLoading } = useChallenges();

    const [completedChallenges, setCompletedChallenges] = useState(cachedCompletedChallenges || new Set());
    const loading = challengesLoading;

    const [showFilters, setShowFilters] = useState(true);

    const isPremium = currentUser?.isPremium || false;

    // Load completed challenges
    useEffect(() => {
        if (!currentUser?.uid) return;
        if (cachedCompletedChallenges) setCompletedChallenges(cachedCompletedChallenges);

        async function syncData() {
            try {
                const userChallengesRef = collection(db, 'users', currentUser.uid, 'challenges');
                const userChallengesSnap = await getDocs(userChallengesRef);
                const completed = new Set();
                userChallengesSnap.docs.forEach(doc => {
                    if (doc.data().completed) completed.add(doc.id);
                });
                cachedCompletedChallenges = completed;
                setCompletedChallenges(completed);
            } catch (error) {
                console.warn('Sync skipped:', error);
            }
        }
        syncData();
    }, [currentUser?.uid]);

    // Filter challenges
    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesChallengeType = activeChallengeType === 'all' ||
            (c.challengeType && c.challengeType === activeChallengeType) ||
            (activeChallengeType === 'quiz' && !c.challengeType);

        const matchesVulnFilter = activeVulnFilter === 'All' ||
            c.type === activeVulnFilter ||
            c.type.toLowerCase().includes(activeVulnFilter.toLowerCase()) ||
            activeVulnFilter.toLowerCase().includes(c.type.toLowerCase());

        return matchesSearch && matchesChallengeType && matchesVulnFilter;
    });

    const totalCompleted = currentUser?.totalCompleted || completedChallenges.size;

    // Group challenges by difficulty
    const groupedChallenges = {
        easy: filteredChallenges.filter(c => c.difficulty === 'easy' || !c.difficulty),
        medium: filteredChallenges.filter(c => c.difficulty === 'medium'),
        hard: filteredChallenges.filter(c => c.difficulty === 'hard'),
        expert: filteredChallenges.filter(c => c.difficulty === 'expert')
    };

    const handleChallengeClick = (challenge) => {
        if (challenge.isPremium && !isPremium) {
            navigate('/upgrade');
        } else {
            navigate(`/challenge/${challenge.id}`);
        }
    };

    return (
        <FirstVisitTransition pageName="challenges">
            <div className="challenges-screen">
                <div className="screen-content">
                    {/* Header */}
                    <header className="page-header">
                        <h1>Challenges</h1>
                        <p className="header-subtitle">Master real-world vulnerabilities through hands-on practice labs.</p>
                    </header>

                    {/* Search & Filters */}
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

                    {showFilters && (
                        <>
                            <div className="filter-section">
                                <h3 className="filter-title">Type</h3>
                                <div className="type-filters">
                                    {challengeTypeFilters.map(filter => {
                                        const Icon = filter.icon;
                                        return (
                                            <button
                                                key={filter.id}
                                                className={`type-filter-btn ${activeChallengeType === filter.id ? 'active' : ''}`}
                                                onClick={() => setActiveChallengeType(filter.id)}
                                            >
                                                <Icon size={16} />
                                                <span>{filter.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
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

                    {/* Stats */}
                    <div className="challenges-stats">
                        <span className="stat-text"><strong>{filteredChallenges.length}</strong> available</span>
                        <span className="stat-separator">•</span>
                        <span className="stat-text"><strong>{totalCompleted}</strong> completed</span>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Loading challenges...</span>
                        </div>
                    ) : (
                        <div className="challenges-container">
                            {/* Render sections if there are results in them */}
                            <DifficultySection
                                difficulty="easy"
                                challenges={groupedChallenges.easy}
                                config={difficultyConfig.easy}
                                onChallengeClick={handleChallengeClick}
                                completedSet={completedChallenges}
                                isPremiumUser={isPremium}
                            />
                            <DifficultySection
                                difficulty="medium"
                                challenges={groupedChallenges.medium}
                                config={difficultyConfig.medium}
                                onChallengeClick={handleChallengeClick}
                                completedSet={completedChallenges}
                                isPremiumUser={isPremium}
                            />
                            <DifficultySection
                                difficulty="hard"
                                challenges={groupedChallenges.hard}
                                config={difficultyConfig.hard}
                                onChallengeClick={handleChallengeClick}
                                completedSet={completedChallenges}
                                isPremiumUser={isPremium}
                            />
                            <DifficultySection
                                difficulty="expert"
                                challenges={groupedChallenges.expert}
                                config={difficultyConfig.expert}
                                onChallengeClick={handleChallengeClick}
                                completedSet={completedChallenges}
                                isPremiumUser={isPremium}
                            />

                            {/* Empty State */}
                            {filteredChallenges.length === 0 && (
                                <div className="empty-state">
                                    <p>No challenges found matching your filters.</p>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveChallengeType('all');
                                            setActiveVulnFilter('All');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </FirstVisitTransition>
    );
}
