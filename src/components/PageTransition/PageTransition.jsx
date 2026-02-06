import { useEffect, useState } from 'react';
import { usePageAnimation } from '../../context/AnimationContext';
import './PageTransition.css';

// Transition directions
export const SLIDE_LEFT = 'slide-left';
export const SLIDE_RIGHT = 'slide-right';
export const SLIDE_UP = 'slide-up';
export const FADE = 'fade';

export default function PageTransition({
    children,
    pageName,
    direction = SLIDE_LEFT,
    duration = 400
}) {
    const shouldAnimate = usePageAnimation(pageName);
    const [isVisible, setIsVisible] = useState(!shouldAnimate);

    useEffect(() => {
        if (shouldAnimate) {
            // Small delay to ensure CSS transition works
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate]);

    const getTransitionClass = () => {
        if (!shouldAnimate) return 'page-visible';
        return isVisible ? `page-enter-active ${direction}` : `page-enter ${direction}`;
    };

    return (
        <div
            className={`page-transition ${getTransitionClass()}`}
            style={{ '--transition-duration': `${duration}ms` }}
        >
            {children}
        </div>
    );
}

// Simple fade transition for main app pages (first visit only)
export function FirstVisitTransition({ children, pageName }) {
    const shouldAnimate = usePageAnimation(pageName);
    const [stage, setStage] = useState(shouldAnimate ? 'loading' : 'complete');

    useEffect(() => {
        if (shouldAnimate && stage === 'loading') {
            const timer = setTimeout(() => {
                setStage('complete');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate, stage]);

    if (stage === 'loading') {
        return (
            <div className="first-visit-loader">
                <div className="loader-content">
                    <div className="loader-ring"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={shouldAnimate ? 'first-visit-enter' : ''}>
            {children}
        </div>
    );
}
