import React, { useState } from 'react';
import LandingNav from '../../components/landing/LandingNav';
import LandingHero from '../../components/landing/LandingHero';
import AppReveal from '../../components/landing/AppReveal';
import LandingFeatures from '../../components/landing/LandingFeatures';
import LandingCurriculum from '../../components/landing/LandingCurriculum';
import LandingPricing from '../../components/landing/LandingPricing';
import LandingCourseLibrary from '../../components/landing/LandingCourseLibrary';
import WhyBugora from '../../components/landing/WhyBugora';
import WaitlistModal from '../../components/landing/WaitlistModal';
import LandingFooter from '../../components/landing/LandingFooter';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

const Landing = () => {
    const { currentUser } = useAuth();

    // Waitlist States (Shared between Hero, Pricing, and Modal)
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const handleOpenWaitlist = () => setIsWaitlistOpen(true);

    const scrollToLibrary = () => {
        document.getElementById('course-library')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            <LandingNav />

            {/* Hero Section */}
            <LandingHero
                onOpenWaitlist={handleOpenWaitlist}
                isJoined={isJoined}
                onExplore={scrollToLibrary}
            />

            {/* App Reveal / Live Hack Simulation */}
            <AppReveal />

            {/* Features (The Bugora Edge) */}
            <LandingFeatures />

            {/* Curriculum Preview (Rotation) */}
            <LandingCurriculum onAction={scrollToLibrary} />

            {/* Course Library (Hacker's Curriculum) */}
            <LandingCourseLibrary />

            {/* Why Bugora? Comparison */}
            <WhyBugora />

            {/* Pricing Section (Moved to bottom) */}
            <LandingPricing
                onOpenWaitlist={handleOpenWaitlist}
                isJoined={isJoined}
            />

            {/* Waitlist Modal */}
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                setIsJoined={setIsJoined}
            />

            <LandingFooter />
        </div>
    );
};

export default Landing;
