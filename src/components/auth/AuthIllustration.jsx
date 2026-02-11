import { memo } from 'react';
import './AuthIllustration.css';

/**
 * Custom SVG Illustration for Auth Left Panel
 * Theme: Cybersecurity, Hacking, Bug Bounty
 */
function AuthIllustration() {
  return (
    <div className="auth-illustration">
      <svg
        viewBox="0 0 800 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="auth-illustration-svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FEF00" />
            <stop offset="100%" stopColor="#7BC100" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9FEF00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="shieldGlow">
            <stop offset="0%" stopColor="#9FEF00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Grid Pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(159, 239, 0, 0.05)" strokeWidth="1" />
        </pattern>
        <rect width="800" height="1000" fill="url(#grid)" />

        {/* Animated Circuit Lines */}
        <g className="circuit-lines">
          <path
            d="M 100 200 L 200 200 L 200 300 L 300 300"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            fill="none"
            className="circuit-line"
            style={{ animationDelay: '0s' }}
          />
          <path
            d="M 600 150 L 700 150 L 700 250"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            fill="none"
            className="circuit-line"
            style={{ animationDelay: '0.5s' }}
          />
          <path
            d="M 150 700 L 250 700 L 250 800 L 350 800"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            fill="none"
            className="circuit-line"
            style={{ animationDelay: '1s' }}
          />
        </g>

        {/* Central Shield Icon */}
        <g className="shield-icon" transform="translate(400, 400)">
          {/* Glow Effect */}
          <circle cx="0" cy="0" r="120" fill="url(#shieldGlow)" className="shield-glow" />

          {/* Shield Outline */}
          <path
            d="M 0 -80 L 60 -60 L 60 20 Q 60 80 0 100 Q -60 80 -60 20 L -60 -60 Z"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="3"
            className="shield-outline"
          />

          {/* Bug Symbol Inside Shield */}
          <g transform="scale(0.8)">
            {/* Bug Body */}
            <ellipse cx="0" cy="0" rx="20" ry="30" fill="#9FEF00" opacity="0.3" />
            <ellipse cx="0" cy="-10" rx="15" ry="15" fill="#9FEF00" opacity="0.5" />

            {/* Bug Antennae */}
            <path d="M -8 -20 L -15 -35" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8 -20 L 15 -35" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />

            {/* Bug Legs */}
            <path d="M -15 -5 L -30 -10" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M -15 5 L -30 5" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M -15 15 L -30 20" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M 15 -5 L 30 -10" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M 15 5 L 30 5" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M 15 15 L 30 20" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Lock Symbol */}
          <g transform="translate(0, 50) scale(0.6)">
            <rect x="-15" y="0" width="30" height="25" rx="3" fill="none" stroke="#9FEF00" strokeWidth="2" />
            <path
              d="M -10 0 L -10 -10 Q -10 -20 0 -20 Q 10 -20 10 -10 L 10 0"
              fill="none"
              stroke="#9FEF00"
              strokeWidth="2"
            />
            <circle cx="0" cy="12" r="3" fill="#9FEF00" />
          </g>
        </g>

        {/* Floating Code Brackets */}
        <g className="floating-code" opacity="0.4">
          <text x="100" y="500" fontSize="40" fill="#9FEF00" className="code-bracket">&lt;/&gt;</text>
          <text x="650" y="600" fontSize="40" fill="#9FEF00" className="code-bracket">{ }</text>
          <text x="150" y="350" fontSize="30" fill="#9FEF00" className="code-bracket">[ ]</text>
        </g>

        {/* Binary Rain Effect */}
        <g className="binary-rain" opacity="0.2">
          <text x="50" y="100" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">01010</text>
          <text x="250" y="150" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">11001</text>
          <text x="450" y="80" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">10110</text>
          <text x="650" y="120" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">01101</text>
          <text x="100" y="850" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">10011</text>
          <text x="600" y="900" fontSize="14" fill="#9FEF00" fontFamily="JetBrains Mono">11100</text>
        </g>

        {/* Corner Decorative Elements */}
        <g className="corner-deco">
          {/* Top Left */}
          <path d="M 50 50 L 150 50 M 50 50 L 50 150" stroke="#9FEF00" strokeWidth="2" opacity="0.3" />
          {/* Top Right */}
          <path d="M 650 50 L 750 50 M 750 50 L 750 150" stroke="#9FEF00" strokeWidth="2" opacity="0.3" />
          {/* Bottom Left */}
          <path d="M 50 850 L 50 950 M 50 950 L 150 950" stroke="#9FEF00" strokeWidth="2" opacity="0.3" />
          {/* Bottom Right */}
          <path d="M 750 850 L 750 950 M 650 950 L 750 950" stroke="#9FEF00" strokeWidth="2" opacity="0.3" />
        </g>

        {/* Data Stream Effect - Terminal-like */}
        <g className="data-streams" opacity="0.6">
          {/* Stream 1 */}
          <g className="data-stream stream-1">
            <rect x="120" y="0" width="2" height="80" fill="url(#primaryGradient)" />
            <text x="115" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">&gt;</text>
          </g>
          {/* Stream 2 */}
          <g className="data-stream stream-2">
            <rect x="300" y="0" width="2" height="120" fill="url(#primaryGradient)" />
            <text x="295" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">$</text>
          </g>
          {/* Stream 3 */}
          <g className="data-stream stream-3">
            <rect x="500" y="0" width="2" height="60" fill="url(#primaryGradient)" />
            <text x="495" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">#</text>
          </g>
          {/* Stream 4 */}
          <g className="data-stream stream-4">
            <rect x="680" y="0" width="2" height="100" fill="url(#primaryGradient)" />
            <text x="675" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">*</text>
          </g>
          {/* Stream 5 */}
          <g className="data-stream stream-5">
            <rect x="200" y="0" width="2" height="70" fill="url(#primaryGradient)" />
            <text x="195" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">+</text>
          </g>
          {/* Stream 6 */}
          <g className="data-stream stream-6">
            <rect x="580" y="0" width="2" height="90" fill="url(#primaryGradient)" />
            <text x="575" y="-10" fontSize="10" fill="#9FEF00" fontFamily="JetBrains Mono">/</text>
          </g>
        </g>

        {/* Glitch Lines - Horizontal flashes */}
        <g className="glitch-lines-horizontal">
          <rect x="0" y="250" width="800" height="1" fill="#9FEF00" opacity="0" className="glitch-h glitch-h1" />
          <rect x="0" y="500" width="800" height="1" fill="#9FEF00" opacity="0" className="glitch-h glitch-h2" />
          <rect x="0" y="750" width="800" height="1" fill="#9FEF00" opacity="0" className="glitch-h glitch-h3" />
        </g>

        {/* Glitch Lines - Vertical flashes */}
        <g className="glitch-lines-vertical">
          <rect x="200" y="0" width="1" height="1000" fill="#9FEF00" opacity="0" className="glitch-v glitch-v1" />
          <rect x="450" y="0" width="1" height="1000" fill="#9FEF00" opacity="0" className="glitch-v glitch-v2" />
          <rect x="650" y="0" width="1" height="1000" fill="#9FEF00" opacity="0" className="glitch-v glitch-v3" />
        </g>
      </svg>

      {/* Overlay Content */}
      <div className="auth-illustration-content">
        <div className="auth-illustration-logo">
          <img src="/logo.png" alt="" className="auth-illustration-logo-img" />
          <h1 className="auth-illustration-title">
            Bugo<span style={{ color: '#9FEF00' }}>ra</span>
          </h1>
        </div>
        <p className="auth-illustration-tagline">
          Master cybersecurity through gamified learning
        </p>
        <div className="auth-illustration-features">
          <div className="auth-feature-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Interactive Challenges</span>
          </div>
          <div className="auth-feature-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>AI-Powered Interview Coach</span>
          </div>
          <div className="auth-feature-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#9FEF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Structured Learning Paths</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AuthIllustration);
