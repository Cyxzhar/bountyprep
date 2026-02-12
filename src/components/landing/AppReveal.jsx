import React from 'react';
import { Layers } from 'lucide-react';
import RevealContainer from './reveal/RevealContainer';

const AppReveal = () => {
    return (
        <section className="app-reveal">
            <div className="landing-container">
                <div className="reveal-wrapper animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <RevealContainer />

                    <div className="floating-stat s1">
                        <Layers size={14} /> 50+ Real Labs
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppReveal;
