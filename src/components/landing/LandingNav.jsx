import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../../components/Logo/Logo';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import '../../pages/Landing/Landing.css'; // Ensure path is correct relative to components/landing

const LandingNav = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { id: 'features', selector: '#features' },
                { id: 'curriculum', selector: '#curriculum' },
                { id: 'why-bugora', selector: '.why-bugora-section' }
            ];

            const scrollPosition = window.scrollY + 120; // Offset for header height

            let current = '';
            for (const section of sections) {
                const element = document.querySelector(section.selector);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount to set initial active state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (selector) => {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <nav className={`landing-nav ${isMenuOpen ? 'menu-active' : ''}`}>
            <div className="nav-container">
                <div className="landing-logo">
                    <Logo style={{ width: '32px', height: '32px' }} />
                    <span className="brand-text">Bug<span className="brand-accent">ora</span></span>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>

                    <a
                        href="#features"
                        className={activeSection === 'features' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); scrollToSection('#features'); }}
                    >
                        Features
                    </a>

                    <a
                        href="#curriculum"
                        className={activeSection === 'curriculum' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); scrollToSection('#curriculum'); }}
                    >
                        Curriculum
                    </a>

                    <a
                        href="#why-bugora"
                        className={activeSection === 'why-bugora' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); scrollToSection('.why-bugora-section'); }}
                    >
                        Why Bugora
                    </a>

                    <div className="nav-actions">
                        <ThemeToggle className="landing-variant" />
                        <button className="nav-btn login-btn" onClick={() => { navigate('/auth/login'); setIsMenuOpen(false); }}>Login</button>
                        <button className="nav-btn primary" onClick={() => { navigate('/onboarding/welcome'); setIsMenuOpen(false); }}>Open App</button>
                    </div>

                    {/* Decorative elements for mobile menu */}
                    <div className="mobile-menu-decoration">
                        <div className="glass-blob"></div>
                        <div className="glass-blob bottom"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNav;
